<?php

namespace App\Http\Controllers;

use App\Models\CostAnalytics;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CostAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        // Get query parameters with defaults
        $restaurantId = $request->input('restaurant_id');
        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);

        // Get all restaurants for the dropdown
        $restaurants = Restaurant::all(['id', 'name']);

        // If no restaurant is selected, use the first one
        if (!$restaurantId && count($restaurants) > 0) {
            $restaurantId = $restaurants[0]->id;
        }

        // Get the selected restaurant's data
        $foodCosts = CostAnalytics::where('restaurant_id', $restaurantId)
            ->where('type', 'FC')
            ->where('month', $month)
            ->where('year', $year)
            ->orderBy('day')
            ->get();

        $consumableCosts = CostAnalytics::where('restaurant_id', $restaurantId)
            ->where('type', 'CC')
            ->where('month', $month)
            ->where('year', $year)
            ->orderBy('day')
            ->get();

        // Important change: Get the latest day entry regardless of amount/revenue
        $lastDay = max(
            $foodCosts->max('day') ?? 0,
            $consumableCosts->max('day') ?? 0
        );

        // Get the cumulative totals as of the last day
        $lastFcEntry = $foodCosts->where('day', $lastDay)->first();
        $lastCcEntry = $consumableCosts->where('day', $lastDay)->first();

        // Use the latest values for summary
        $finalFcCumul = $lastFcEntry ? $lastFcEntry->cumul : 0;
        $finalCcCumul = $lastCcEntry ? $lastCcEntry->cumul : 0;
        $finalRevenueCumul = $lastFcEntry ? $lastFcEntry->cumul_revenue : ($lastCcEntry ? $lastCcEntry->cumul_revenue : 0);

        // Calculate FC percentage from cumulative values
        $fcPercentage = null;
        if ($finalRevenueCumul > 0) {
            $fcPercentage = ($finalFcCumul / $finalRevenueCumul) * 100;
        }

        // Calculate CC percentage from cumulative values
        $ccPercentage = null;
        if ($finalRevenueCumul > 0) {
            $ccPercentage = ($finalCcCumul / $finalRevenueCumul) * 100;
        }

        // Calculate combined percentage
        $combinedPercentage = null;
        if ($finalRevenueCumul > 0) {
            $combinedPercentage = (($finalFcCumul + $finalCcCumul) / $finalRevenueCumul) * 100;
        }

        // Create monthly summary with the updated calculations
        $monthlySummary = [
            'fc' => [
                'total' => $finalFcCumul,
                'percentage' => $fcPercentage
            ],
            'cc' => [
                'total' => $finalCcCumul,
                'percentage' => $ccPercentage
            ],
            'combined' => [
                'total' => $finalFcCumul + $finalCcCumul,
                'percentage' => $combinedPercentage
            ],
            'total_revenue' => $finalRevenueCumul
        ];

        // Format the data for charts
        $chartData = [];
        $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;

        // Create a lookup for existing data by day
        $fcByDay = $foodCosts->keyBy('day');
        $ccByDay = $consumableCosts->keyBy('day');

        for ($i = 1; $i <= $daysInMonth; $i++) {
            $fcData = $fcByDay->get($i);
            $ccData = $ccByDay->get($i);

            // Get actual values for this day (default to 0 if no data)
            $fcAmount = $fcData ? $fcData->amount : 0;
            $ccAmount = $ccData ? $ccData->amount : 0;
            $revenue = $fcData ? $fcData->revenue : 0;
            $fcCumul = $fcData ? $fcData->cumul : 0;
            $ccCumul = $ccData ? $ccData->cumul : 0;
            $cumulRevenue = $fcData ? $fcData->cumul_revenue : 0;

            // Only show data for days up to the last day with actual data
            if ($i > $lastDay) {
                // For future days, don't show cumulative values (to avoid misleading data)
                $fcCumul = 0;
                $ccCumul = 0;
                $cumulRevenue = 0;
            }

            // Get the percentage values (they've already been calculated correctly in the database)
            $fcPercentage = $fcData ? $fcData->percentage : null;
            $ccPercentage = $ccData ? $ccData->percentage : null;

            // Add to chart data
            $chartData[] = [
                'day' => $i,
                'fc_amount' => $fcAmount,
                'cc_amount' => $ccAmount,
                'fc_cumul' => $fcCumul,
                'cc_cumul' => $ccCumul,
                'fc_percentage' => $fcPercentage,
                'cc_percentage' => $ccPercentage,
                'revenue' => $revenue,
                'cumul_revenue' => $cumulRevenue,
            ];
        }

        // Log the summary data being sent to the view
        Log::info('Cost Analytics Index Summary', [
            'restaurant_id' => $restaurantId,
            'month' => $month,
            'year' => $year,
            'lastDay' => $lastDay,
            'finalFcCumul' => $finalFcCumul,
            'finalCcCumul' => $finalCcCumul,
            'finalRevenueCumul' => $finalRevenueCumul,
            'fc_percentage' => $fcPercentage,
            'cc_percentage' => $ccPercentage
        ]);

        return Inertia::render('CostAnalytics/Dashboard', [
            'restaurants' => $restaurants,
            'selectedRestaurant' => $restaurantId,
            'selectedMonth' => $month,
            'selectedYear' => $year,
            'foodCosts' => $foodCosts,
            'consumableCosts' => $consumableCosts,
            'monthlySummary' => $monthlySummary,
            'chartData' => $chartData,
        ]);
    }

    public function generateDaily()
    {
        $today = Carbon::today();
        $day = $today->day - 1; // Yesterday
        $month = $today->month;
        $year = $today->year;

        // Define the food cost types
        $fcTypes = [
            'cuisine',
            'pizza',
            'economat',
            'bml_giada',
            'bml_gastro',
            'bml_legume',
            'bml_boisson',
        ];

        // Define the consumable cost type
        $ccTypes = ['consommable'];

        // Get all restaurants
        $restaurants = Restaurant::all();
        $generatedCount = 0;

        foreach ($restaurants as $restaurant) {
            $restaurantId = $restaurant->id;

            // Check if there are any entries for this restaurant on this day
            $hasEntries = DB::table('day_totals')
                ->where('restaurant_id', $restaurantId)
                ->where('day', $day)
                ->where('month', $month)
                ->where('year', $year)
                ->exists();

            if (!$hasEntries) {
                continue;
            }

            // Run recalculation for the day
            $this->recalculateForDay($restaurantId, $day, $month, $year);
            $generatedCount++;
        }

        return redirect()->back()->with('message', "Generated data for {$generatedCount} restaurants");
    }

    public function recalculateForDay($restaurantId, $day, $month, $year)
    {
        // Define the food cost types
        $fcTypes = [
            'cuisine',
            'pizza',
            'economat',
            'bml_giada',
            'bml_gastro',
            'bml_legume',
            'bml_boisson',
        ];

        // Define the consumable cost type
        $ccTypes = ['consommable'];

        // Get the restaurant
        $restaurant = Restaurant::findOrFail($restaurantId);

        // Calculate FC (Food Cost)
        $fcAmount = DB::table('day_totals')
            ->where('restaurant_id', $restaurantId)
            ->where('day', $day)
            ->where('month', $month)
            ->where('year', $year)
            ->whereIn('type', $fcTypes)
            ->sum('total');

        // Calculate CC (Consumable Cost)
        $ccAmount = DB::table('day_totals')
            ->where('restaurant_id', $restaurantId)
            ->where('day', $day)
            ->where('month', $month)
            ->where('year', $year)
            ->whereIn('type', $ccTypes)
            ->sum('total');

        // Calculate FC cumulative total for the month
        $fcCumul = DB::table('day_totals')
            ->where('restaurant_id', $restaurantId)
            ->where('month', $month)
            ->where('year', $year)
            ->where('day', '<=', $day)
            ->whereIn('type', $fcTypes)
            ->sum('total');

        // Calculate CC cumulative total for the month
        $ccCumul = DB::table('day_totals')
            ->where('restaurant_id', $restaurantId)
            ->where('month', $month)
            ->where('year', $year)
            ->where('day', '<=', $day)
            ->whereIn('type', $ccTypes)
            ->sum('total');

        // Create a Carbon date object for the target day
        $targetDate = Carbon::createFromDate($year, $month, $day);

        // Get daily revenue from cloture_caisses table
        $dailyRevenue = DB::table('cloture_caisses')
            ->where('restau', $restaurant->name) // Using restaurant name instead of ID
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->whereDay('date', $day)
            ->sum('montant');

        // Calculate cumulative revenue for the month
        $cumulRevenue = DB::table('cloture_caisses')
            ->where('restau', $restaurant->name) // Using restaurant name instead of ID
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->whereDay('date', '<=', $day)
            ->sum('montant');

        // Log calculation details (helpful for debugging)
        Log::info("Recalculating for {$restaurant->name}: day {$day}/{$month}/{$year}", [
            'fc_amount' => $fcAmount,
            'cc_amount' => $ccAmount,
            'fc_cumul' => $fcCumul,
            'cc_cumul' => $ccCumul,
            'daily_revenue' => $dailyRevenue,
            'cumul_revenue' => $cumulRevenue
        ]);

        // Calculate percentages based on CUMULATIVE values, not daily
        $fcPercentage = null;
        if ($cumulRevenue > 0) {
            $fcPercentage = ($fcCumul / $cumulRevenue) * 100;
        }

        $ccPercentage = null;
        if ($cumulRevenue > 0) {
            $ccPercentage = ($ccCumul / $cumulRevenue) * 100;
        }

        // Save FC record
        CostAnalytics::updateOrCreate(
            [
                'restaurant_id' => $restaurantId,
                'day' => $day,
                'month' => $month,
                'year' => $year,
                'type' => 'FC'
            ],
            [
                'amount' => $fcAmount,
                'cumul' => $fcCumul,
                'revenue' => $dailyRevenue,
                'cumul_revenue' => $cumulRevenue,
                'percentage' => $fcPercentage
            ]
        );

        // Save CC record
        CostAnalytics::updateOrCreate(
            [
                'restaurant_id' => $restaurantId,
                'day' => $day,
                'month' => $month,
                'year' => $year,
                'type' => 'CC'
            ],
            [
                'amount' => $ccAmount,
                'cumul' => $ccCumul,
                'revenue' => $dailyRevenue,
                'cumul_revenue' => $cumulRevenue,
                'percentage' => $ccPercentage
            ]
        );

        return true;
    }

    // New endpoint for real-time data
    public function getSummaryData(Request $request)
    {
        // Get query parameters with defaults
        $restaurantId = $request->input('restaurant_id');
        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);

        // If no restaurant is selected, return empty response
        if (!$restaurantId) {
            return response()->json([
                'success' => false,
                'message' => 'No restaurant selected'
            ]);
        }

        // Get FC entries for the month
        $fcEntries = CostAnalytics::where('restaurant_id', $restaurantId)
            ->where('type', 'FC')
            ->where('month', $month)
            ->where('year', $year)
            ->orderBy('day', 'desc')
            ->get();

        // Get CC entries for the month
        $ccEntries = CostAnalytics::where('restaurant_id', $restaurantId)
            ->where('type', 'CC')
            ->where('month', $month)
            ->where('year', $year)
            ->orderBy('day', 'desc')
            ->get();

        if ($fcEntries->isEmpty() && $ccEntries->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No data available'
            ]);
        }

        // Find the latest day entry
        $lastDay = max(
            $fcEntries->max('day') ?? 0,
            $ccEntries->max('day') ?? 0
        );

        // Get entries for the last day
        $lastFcEntry = $fcEntries->where('day', $lastDay)->first();
        $lastCcEntry = $ccEntries->where('day', $lastDay)->first();

        // Get cumulative values from the latest day
        $finalFcCumul = $lastFcEntry ? $lastFcEntry->cumul : 0;
        $finalCcCumul = $lastCcEntry ? $lastCcEntry->cumul : 0;
        $finalRevenueCumul = $lastFcEntry ? $lastFcEntry->cumul_revenue : ($lastCcEntry ? $lastCcEntry->cumul_revenue : 0);

        // Log debug info
        Log::info("Analytics summary data", [
            'lastDay' => $lastDay,
            'finalFcCumul' => $finalFcCumul,
            'finalCcCumul' => $finalCcCumul,
            'finalRevenueCumul' => $finalRevenueCumul
        ]);

        // Calculate percentages
        $fcPercentage = $finalRevenueCumul > 0 ? ($finalFcCumul / $finalRevenueCumul) * 100 : null;
        $ccPercentage = $finalRevenueCumul > 0 ? ($finalCcCumul / $finalRevenueCumul) * 100 : null;
        $combinedPercentage = $finalRevenueCumul > 0 ? (($finalFcCumul + $finalCcCumul) / $finalRevenueCumul) * 100 : null;

        // Return summary data
        return response()->json([
            'success' => true,
            'monthlySummary' => [
                'fc' => [
                    'total' => $finalFcCumul,
                    'percentage' => $fcPercentage
                ],
                'cc' => [
                    'total' => $finalCcCumul,
                    'percentage' => $ccPercentage
                ],
                'combined' => [
                    'total' => $finalFcCumul + $finalCcCumul,
                    'percentage' => $combinedPercentage
                ],
                'total_revenue' => $finalRevenueCumul
            ],
            'lastDay' => $lastDay
        ]);
    }
}
