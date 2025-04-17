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

        // Get today's date
        $today = Carbon::today();
        $currentDay = ($month == $today->month && $year == $today->year)
            ? $today->day
            : ($year < $today->year || ($year == $today->year && $month < $today->month)
                ? 31 // Past month, use max days
                : 0); // Future month, use 0 days

        // Find the latest day with records (up to today)
        $lastDay = min(
            max(
                $foodCosts->where('day', '<=', $currentDay)->max('day') ?? 0,
                $consumableCosts->where('day', '<=', $currentDay)->max('day') ?? 0
            ),
            $currentDay
        );

        // Get the LATEST entries for both FC and CC
        $latestFcEntry = $foodCosts->where('day', $lastDay)->first();
        $latestCcEntry = $consumableCosts->where('day', $lastDay)->first();

        // Get cumulative totals from the latest entries
        $finalFcCumul = $latestFcEntry ? $latestFcEntry->cumul : 0;
        $finalCcCumul = $latestCcEntry ? $latestCcEntry->cumul : 0;
        $finalRevenueCumul = $latestFcEntry ? $latestFcEntry->cumul_revenue : ($latestCcEntry ? $latestCcEntry->cumul_revenue : 0);

        // Calculate percentages
        $fcPercentage = $finalRevenueCumul > 0 ? ($finalFcCumul / $finalRevenueCumul) * 100 : null;
        $ccPercentage = $finalRevenueCumul > 0 ? ($finalCcCumul / $finalRevenueCumul) * 100 : null;
        $combinedPercentage = $finalRevenueCumul > 0 ? (($finalFcCumul + $finalCcCumul) / $finalRevenueCumul) * 100 : null;

        // Monthly summary
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
            'total_revenue' => $finalRevenueCumul,
            'last_updated_day' => $lastDay
        ];

        // Format chart data
        $chartData = [];
        $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;

        // Index data by day for quick lookups
        $fcByDay = $foodCosts->keyBy('day');
        $ccByDay = $consumableCosts->keyBy('day');

        // Last cumulative values for past days with no data
        $lastFcCumul = 0;
        $lastCcCumul = 0;
        $lastRevenueCumul = 0;

        for ($i = 1; $i <= $daysInMonth; $i++) {
            $fcData = $fcByDay->get($i);
            $ccData = $ccByDay->get($i);

            // Check if this day is in the future
            $isInFuture = ($year > $today->year) ||
                ($year == $today->year && $month > $today->month) ||
                ($year == $today->year && $month == $today->month && $i > $today->day);

            if ($isInFuture) {
                // For future dates, set all values to 0 or null
                $chartData[] = [
                    'day' => $i,
                    'fc_amount' => 0,
                    'cc_amount' => 0,
                    'fc_cumul' => 0,
                    'cc_cumul' => 0,
                    'fc_percentage' => null,
                    'cc_percentage' => null,
                    'revenue' => 0,
                    'cumul_revenue' => 0,
                ];
            } else {
                // For past and current dates, use actual data or carry forward the last cumulative values
                $fc_amount = $fcData ? $fcData->amount : 0;
                $cc_amount = $ccData ? $ccData->amount : 0;

                // Update the last known cumulative values if we have data for this day
                if ($fcData) {
                    $lastFcCumul = $fcData->cumul;
                    $lastRevenueCumul = $fcData->cumul_revenue;
                }

                if ($ccData) {
                    $lastCcCumul = $ccData->cumul;
                    if (!$fcData) { // If no FC data but we have CC data with revenue
                        $lastRevenueCumul = $ccData->cumul_revenue;
                    }
                }

                $chartData[] = [
                    'day' => $i,
                    'fc_amount' => $fc_amount,
                    'cc_amount' => $cc_amount,
                    'fc_cumul' => $fcData ? $fcData->cumul : $lastFcCumul,
                    'cc_cumul' => $ccData ? $ccData->cumul : $lastCcCumul,
                    'fc_percentage' => $fcData ? $fcData->percentage : null,
                    'cc_percentage' => $ccData ? $ccData->percentage : null,
                    'revenue' => $fcData ? $fcData->revenue : ($ccData ? $ccData->revenue : 0),
                    'cumul_revenue' => $fcData ? $fcData->cumul_revenue : ($ccData ? $ccData->cumul_revenue : $lastRevenueCumul),
                ];
            }
        }

        // Debug log
        Log::info('Cost Analytics Index Data', [
            'restaurant_id' => $restaurantId,
            'current_day' => $currentDay,
            'last_day_found' => $lastDay,
            'final_fc_cumul' => $finalFcCumul,
            'final_cc_cumul' => $finalCcCumul,
            'final_revenue_cumul' => $finalRevenueCumul
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
            'currentDay' => $currentDay
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

        // Get all FC and CC entries for the month
        $fcEntries = CostAnalytics::where('restaurant_id', $restaurantId)
            ->where('type', 'FC')
            ->where('month', $month)
            ->where('year', $year)
            ->orderBy('day')
            ->get();

        $ccEntries = CostAnalytics::where('restaurant_id', $restaurantId)
            ->where('type', 'CC')
            ->where('month', $month)
            ->where('year', $year)
            ->orderBy('day')
            ->get();

        if ($fcEntries->isEmpty() && $ccEntries->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No data available'
            ]);
        }

        // Get today's date
        $today = Carbon::today();
        $currentDay = ($month == $today->month && $year == $today->year)
            ? $today->day
            : ($year < $today->year || ($year == $today->year && $month < $today->month)
                ? 31 // Past month, use max days
                : 0); // Future month, use 0 days

        // Find the latest day with records (up to today)
        $lastDay = min(
            max(
                $fcEntries->where('day', '<=', $currentDay)->max('day') ?? 0,
                $ccEntries->where('day', '<=', $currentDay)->max('day') ?? 0
            ),
            $currentDay
        );

        // Get the latest entries
        $latestFcEntry = $fcEntries->where('day', $lastDay)->first();
        $latestCcEntry = $ccEntries->where('day', $lastDay)->first();

        // Get the latest cumulative values
        $finalFcCumul = $latestFcEntry ? $latestFcEntry->cumul : 0;
        $finalCcCumul = $latestCcEntry ? $latestCcEntry->cumul : 0;
        $finalRevenueCumul = $latestFcEntry ? $latestFcEntry->cumul_revenue : ($latestCcEntry ? $latestCcEntry->cumul_revenue : 0);

        // Calculate percentages
        $fcPercentage = $finalRevenueCumul > 0 ? ($finalFcCumul / $finalRevenueCumul) * 100 : null;
        $ccPercentage = $finalRevenueCumul > 0 ? ($finalCcCumul / $finalRevenueCumul) * 100 : null;
        $combinedPercentage = $finalRevenueCumul > 0 ? (($finalFcCumul + $finalCcCumul) / $finalRevenueCumul) * 100 : null;

        Log::info('Summary API data', [
            'last_day' => $lastDay,
            'finalFcCumul' => $finalFcCumul,
            'finalCcCumul' => $finalCcCumul,
            'finalRevenueCumul' => $finalRevenueCumul,
            'current_day' => $currentDay
        ]);

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
                'total_revenue' => $finalRevenueCumul,
                'last_updated_day' => $lastDay
            ]
        ]);
    }
}
