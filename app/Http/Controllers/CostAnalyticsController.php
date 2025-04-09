<?php

namespace App\Http\Controllers;

use App\Models\CostAnalytics;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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

        // Calculate monthly totals and averages
        // Only include valid percentage values (not null) when calculating average/min/max
        $fcValidPercentages = $foodCosts->filter(function ($item) {
            return $item->percentage !== null;
        })->pluck('percentage');

        $ccValidPercentages = $consumableCosts->filter(function ($item) {
            return $item->percentage !== null;
        })->pluck('percentage');

        $monthlySummary = [
            'fc' => [
                'total' => $foodCosts->sum('amount'),
                'average' => $fcValidPercentages->count() > 0 ? $fcValidPercentages->avg() : null,
                'highest' => $fcValidPercentages->count() > 0 ? $fcValidPercentages->max() : null,
                'lowest' => $fcValidPercentages->count() > 0 ? $fcValidPercentages->min() : null,
            ],
            'cc' => [
                'total' => $consumableCosts->sum('amount'),
                'average' => $ccValidPercentages->count() > 0 ? $ccValidPercentages->avg() : null,
                'highest' => $ccValidPercentages->count() > 0 ? $ccValidPercentages->max() : null,
                'lowest' => $ccValidPercentages->count() > 0 ? $ccValidPercentages->min() : null,
            ],
            'total_revenue' => $foodCosts->sum('revenue')
        ];

        // Calculate FC+CC combined
        $monthlySummary['combined'] = [
            'total' => $monthlySummary['fc']['total'] + $monthlySummary['cc']['total'],
            'percentage' => $monthlySummary['total_revenue'] > 0
                ? (($monthlySummary['fc']['total'] + $monthlySummary['cc']['total']) / $monthlySummary['total_revenue']) * 100
                : null
        ];

        // Format the data for charts
        $chartData = [];
        $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;

        for ($i = 1; $i <= $daysInMonth; $i++) {
            $fcData = $foodCosts->where('day', $i)->first();
            $ccData = $consumableCosts->where('day', $i)->first();

            $chartData[] = [
                'day' => $i,
                'fc_amount' => $fcData ? $fcData->amount : 0,
                'cc_amount' => $ccData ? $ccData->amount : 0,
                'fc_cumul' => $fcData ? $fcData->cumul : 0,
                'cc_cumul' => $ccData ? $ccData->cumul : 0,
                'fc_percentage' => $fcData ? $fcData->percentage : null,  // Allow null
                'cc_percentage' => $ccData ? $ccData->percentage : null,  // Allow null
                'revenue' => $fcData ? $fcData->revenue : 0,
                'cumul_revenue' => $fcData ? $fcData->cumul_revenue : 0,
            ];
        }

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
            'ramadan'
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

            // Get daily revenue from cloture_caisses table
            $dailyRevenue = DB::table('cloture_caisses')
                ->where('restau', $restaurant->name) // Using restaurant name instead of ID
                ->whereDate('date', $today->format('Y-m-d'))
                ->sum('montant');

            // Calculate cumulative revenue for the month
            $cumulRevenue = DB::table('cloture_caisses')
                ->where('restau', $restaurant->name) // Using restaurant name instead of ID
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->whereDay('date', '<=', $day)
                ->sum('montant');

            // Calculate FC percentage only if revenue exists and is not zero
            // Convert to percentage values (0-100 range)
            $fcPercentage = null;
            if ($dailyRevenue > 0) {
                $fcPercentage = ($fcAmount / $dailyRevenue) * 100;
            }

            // Calculate CC percentage only if revenue exists and is not zero
            $ccPercentage = null;
            if ($dailyRevenue > 0) {
                $ccPercentage = ($ccAmount / $dailyRevenue) * 100;
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
            'ramadan'
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

        // Calculate FC percentage only if revenue exists and is not zero
        $fcPercentage = null;
        if ($dailyRevenue > 0) {
            $fcPercentage = ($fcAmount / $dailyRevenue) * 100;
        }

        // Calculate CC percentage only if revenue exists and is not zero
        $ccPercentage = null;
        if ($dailyRevenue > 0) {
            $ccPercentage = ($ccAmount / $dailyRevenue) * 100;
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
}
