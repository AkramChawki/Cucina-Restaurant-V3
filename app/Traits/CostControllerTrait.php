<?php

namespace App\Traits;

use App\Models\DayTotal;
use App\Models\Restaurant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

trait CostControllerTrait
{
    private function updateAnalyticsForDate($restaurantId, $day, $month, $year)
    {
        // Get the CostAnalyticsController instance
        $costAnalyticsController = app()->make(\App\Http\Controllers\CostAnalyticsController::class);

        // Call the recalculateForDay method
        $costAnalyticsController->recalculateForDay($restaurantId, $day, $month, $year);
    }
    public function index()
    {
        $restaurants = Restaurant::all(['id', 'name', 'slug']);

        return Inertia::render($this->getViewPath('Restau'), [
            'restaurants' => $restaurants
        ]);
    }

    protected function getCostType()
    {
        return match (class_basename($this->model)) {
            'CostConsomable' => DayTotal::TYPE_CONSOMMABLE,
            'CostCuisine' => DayTotal::TYPE_CUISINE,
            'CostEconomat' => DayTotal::TYPE_ECONOMAT,
            'CostPizza' => DayTotal::TYPE_PIZZA,
            'CostRamadan' => DayTotal::TYPE_RAMADAN,
            default => throw new \Exception('Invalid cost type')
        };
    }

    public function show(Request $request, $restaurantSlug)
    {
        $restaurant = Restaurant::where('slug', $restaurantSlug)->firstOrFail();
        $currentMonth = $request->get('month', now()->month);
        $currentYear = $request->get('year', now()->year);

        $products = $this->getProducts();

        $costData = $this->model::getMonthlyData($restaurant->id, $currentMonth, $currentYear);

        $transformedProducts = $products->map(function ($product) use ($costData) {
            return [
                'id' => $product->id,
                'designation' => $product->designation,
                'unite' => $product->unite,
                'image' => $product->image,
                'prix' => $product->prix,
                'values' => $costData[$product->id] ?? []
            ];
        });

        return Inertia::render($this->getViewPath(''), [
            'restaurant' => $restaurant,
            'products' => $transformedProducts,
            'currentMonth' => [
                'month' => (int)$currentMonth,
                'year' => (int)$currentYear
            ]
        ]);
    }

    public function updateValue(Request $request)
    {
        $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'product_id' => 'required|exists:cuisinier_products,id',
            'day' => 'required|integer|min:1|max:31',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
            'period' => 'required|in:morning,afternoon',
            'value' => 'required|numeric|min:0',
            'daily_data' => 'required|array',
            'day_total' => 'required|numeric|min:0'
        ]);

        $userRole = auth()->user()->role;
        $isDataEntryRole = $this->isDataEntryRole($userRole);
        $isVerifierRole = $this->isVerifierRole($userRole);
        
        if (!$isDataEntryRole && !$isVerifierRole) {
            return redirect()->back()->with('error', 'You do not have permission to edit this data.');
        }
        
        $costEntry = $this->model::firstOrCreate(
            [
                'restaurant_id' => $request->restaurant_id,
                'product_id' => $request->product_id,
                'month' => $request->month,
                'year' => $request->year,
            ],
            ['daily_data' => [], 'status' => 'pending']
        );

        $dailyData = $costEntry->daily_data ?: [];
        $day = $request->day;
        
        // Check if the day entry exists and its status
        $dayEntryExists = isset($dailyData[$day]);
        $entryStatus = $dayEntryExists ? ($dailyData[$day]['status'] ?? 'pending') : 'pending';
        
        // Check edit permissions
        $canEdit = false;
        
        // Data entry role can only edit if:
        // 1. No entry exists yet
        // 2. Entry exists but was created today by them and is still pending
        if ($isDataEntryRole) {
            // For new entry or if entry was created today and is pending
            if (!$dayEntryExists || 
                ($entryStatus === 'pending' && 
                 isset($dailyData[$day]['created_at']) && 
                 Carbon::parse($dailyData[$day]['created_at'])->isToday())) {
                $canEdit = true;
            }
        }
        
        // Verifier role can edit entries regardless of status
        if ($isVerifierRole) {
            $canEdit = true;
        }
        
        if (!$canEdit) {
            return redirect()->back()->with('error', 'You do not have permission to edit this entry.');
        }
        
        // Update or create the day entry
        $dailyData[$day] = [
            'morning' => (float)$request->daily_data['morning'],
            'afternoon' => (float)$request->daily_data['afternoon'],
            'total' => (float)$request->daily_data['total'],
            'status' => $isVerifierRole && $request->has('verify') ? 'verified' : 'pending',
            'created_at' => $dayEntryExists && isset($dailyData[$day]['created_at']) 
                ? $dailyData[$day]['created_at'] 
                : now()->toDateTimeString(),
            'updated_at' => now()->toDateTimeString(),
        ];
        
        // If verifier is verifying the entry
        if ($isVerifierRole && $request->has('verify')) {
            $costEntry->status = 'verified';
            $costEntry->verified_by_id = auth()->id();
            $costEntry->verified_at = now();
            $dailyData[$day]['verified_by'] = auth()->id();
            $dailyData[$day]['verified_at'] = now()->toDateTimeString();
        }

        $costEntry->update(['daily_data' => $dailyData]);

        // Update day total
        DayTotal::updateOrCreate(
            [
                'restaurant_id' => $request->restaurant_id,
                'day' => $request->day,
                'month' => $request->month,
                'year' => $request->year,
                'type' => $this->getCostType()
            ],
            ['total' => $request->day_total]
        );

        // Update analytics for this day
        $this->updateAnalyticsForDate(
            $request->restaurant_id,
            $request->day,
            $request->month,
            $request->year
        );

        return redirect()->back();
    }
    
    public function verifyEntry(Request $request)
    {
        $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'product_id' => 'required|exists:cuisinier_products,id',
            'day' => 'required|integer|min:1|max:31',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
        ]);
        
        // Check if user has verifier role
        if (!$this->isVerifierRole(auth()->user()->role)) {
            return redirect()->back()->with('error', 'You do not have permission to verify entries.');
        }
        
        $costEntry = $this->model::where([
            'restaurant_id' => $request->restaurant_id,
            'product_id' => $request->product_id,
            'month' => $request->month,
            'year' => $request->year,
        ])->firstOrFail();
        
        $dailyData = $costEntry->daily_data;
        $day = $request->day;
        
        if (isset($dailyData[$day])) {
            $dailyData[$day]['status'] = 'verified';
            $dailyData[$day]['verified_by'] = auth()->id();
            $dailyData[$day]['verified_at'] = now()->toDateTimeString();
            
            $costEntry->update(['daily_data' => $dailyData]);
            
            // Check if all days are verified, then update the overall status
            $allVerified = true;
            foreach ($dailyData as $dayData) {
                if (($dayData['status'] ?? 'pending') !== 'verified') {
                    $allVerified = false;
                    break;
                }
            }
            
            if ($allVerified) {
                $costEntry->update([
                    'status' => 'verified',
                    'verified_by_id' => auth()->id(),
                    'verified_at' => now(),
                ]);
            }
            
            return redirect()->back()->with('success', 'Entry verified successfully.');
        }
        
        return redirect()->back()->with('error', 'Entry not found.');
    }
    
    // Helper methods for role checking
    protected function isDataEntryRole($userRole)
    {
        // Parse JSON string to array if it's a string
        if (is_string($userRole)) {
            $roles = json_decode($userRole, true);
        } else {
            $roles = $userRole;
        }
        
        // If not an array or empty, return false
        if (!is_array($roles) || empty($roles)) {
            return false;
        }
        
        // Check if user has any of the data entry roles
        $dataEntryRoles = [
            'Cost-Cuisine',
            'Cost-Pizza',
            'Cost-Economat',
            'Cost-Consomable'
        ];
        
        foreach ($dataEntryRoles as $role) {
            if (in_array($role, $roles)) {
                return true;
            }
        }
        
        return false;
    }

    protected function isVerifierRole($userRole)
    {
        // Parse JSON string to array if it's a string
        if (is_string($userRole)) {
            $roles = json_decode($userRole, true);
        } else {
            $roles = $userRole;
        }
        
        // If not an array or empty, return false
        if (!is_array($roles) || empty($roles)) {
            return false;
        }
        
        // Check if user has any of the verifier roles
        $verifierRoles = [
            'Audit',      // Primary verification role
            'Admin',      // Admins can verify
            'Analytics'   // Analytics users can verify
        ];
        
        foreach ($verifierRoles as $role) {
            if (in_array($role, $roles)) {
                return true;
            }
        }
        
        return false;
    }

    private function getViewPath($suffix)
    {
        return "FluxReel/{$this->viewPrefix}/{$this->viewPrefix}{$suffix}";
    }
}