<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class GenerateFCCCRecords extends Command
{
    protected $signature = 'generate:fccc {startMonth?} {startYear?} {endMonth?} {endYear?}';
    protected $description = 'Generate Food Cost and Consumable Cost records for specified period';

    // Define constant arrays matching the ones in CostAnalyticsController
    protected $fcTypes = [
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
    protected $ccTypes = ['consommable'];

    public function handle()
    {
        // Get parameters (default: January and February 2025)
        $startMonth = $this->argument('startMonth') ?? 1;
        $startYear = $this->argument('startYear') ?? 2025;
        $endMonth = $this->argument('endMonth') ?? 2;
        $endYear = $this->argument('endYear') ?? 2025;

        $this->info("Generating FC and CC records from {$startMonth}/{$startYear} to {$endMonth}/{$endYear}");

        // Get all restaurants
        $restaurants = DB::table('restaurants')->select('id', 'name')->get();

        $this->info("Found " . count($restaurants) . " restaurants");

        // Process each restaurant
        foreach ($restaurants as $restaurant) {
            $restaurantId = $restaurant->id;
            $restaurantName = $restaurant->name;
            
            $this->info("Processing restaurant: {$restaurantName} (ID: {$restaurantId})");

            // Process each month in the range
            $currentDate = Carbon::createFromDate($startYear, $startMonth, 1);
            $endDate = Carbon::createFromDate($endYear, $endMonth, 1)->endOfMonth();

            while ($currentDate <= $endDate) {
                $year = $currentDate->year;
                $month = $currentDate->month;
                $daysInMonth = $currentDate->daysInMonth;

                $this->info("Processing {$month}/{$year} for restaurant {$restaurantName}");

                // Get all revenues for the month upfront
                $this->info("Getting revenue data...");
                $revenueData = DB::table('cloture_caisses')
                    ->where('restau', $restaurantName)
                    ->whereYear('date', $year)
                    ->whereMonth('date', $month)
                    ->select(DB::raw('DAY(date) as day'), DB::raw('SUM(montant) as daily_revenue'))
                    ->groupBy(DB::raw('DAY(date)'))
                    ->get()
                    ->keyBy('day');

                // Get all FC totals for the month
                $this->info("Getting FC data...");
                $fcData = DB::table('day_totals')
                    ->where('restaurant_id', $restaurantId)
                    ->where('month', $month)
                    ->where('year', $year)
                    ->whereIn('type', $this->fcTypes)
                    ->select('day', DB::raw('SUM(total) as daily_fc'))
                    ->groupBy('day')
                    ->get()
                    ->keyBy('day');

                // Get all CC totals for the month
                $this->info("Getting CC data...");
                $ccData = DB::table('day_totals')
                    ->where('restaurant_id', $restaurantId)
                    ->where('month', $month)
                    ->where('year', $year)
                    ->whereIn('type', $this->ccTypes)
                    ->select('day', DB::raw('SUM(total) as daily_cc'))
                    ->groupBy('day')
                    ->get()
                    ->keyBy('day');

                // Calculate cumulative values
                $cumulativeFC = 0;
                $cumulativeCC = 0;
                $cumulativeRevenue = 0;

                // Now create records for each day
                for ($day = 1; $day <= $daysInMonth; $day++) {
                    // Get the daily values (or 0 if no data)
                    $fcAmount = isset($fcData[$day]) ? $fcData[$day]->daily_fc : 0;
                    $ccAmount = isset($ccData[$day]) ? $ccData[$day]->daily_cc : 0;
                    $dailyRevenue = isset($revenueData[$day]) ? $revenueData[$day]->daily_revenue : 0;
                    
                    // Update cumulative values
                    $cumulativeFC += $fcAmount;
                    $cumulativeCC += $ccAmount;
                    $cumulativeRevenue += $dailyRevenue;

                    // Calculate percentages only if revenue exists for the day
                    // IMPORTANT: Following the same logic as CostAnalyticsController
                    $fcPercentage = null;
                    $ccPercentage = null;
                    
                    if ($dailyRevenue > 0) {
                        $fcPercentage = ($fcAmount / $dailyRevenue) * 100;
                        $ccPercentage = ($ccAmount / $dailyRevenue) * 100;
                    }

                    // Store FC record
                    $this->storeRecord([
                        'restaurant_id' => $restaurantId,
                        'day' => $day,
                        'month' => $month,
                        'year' => $year,
                        'type' => 'FC',
                        'amount' => $fcAmount,
                        'cumul' => $cumulativeFC,
                        'revenue' => $dailyRevenue,
                        'cumul_revenue' => $cumulativeRevenue,
                        'percentage' => $fcPercentage
                    ]);

                    // Store CC record
                    $this->storeRecord([
                        'restaurant_id' => $restaurantId,
                        'day' => $day,
                        'month' => $month,
                        'year' => $year,
                        'type' => 'CC',
                        'amount' => $ccAmount,
                        'cumul' => $cumulativeCC,
                        'revenue' => $dailyRevenue,
                        'cumul_revenue' => $cumulativeRevenue,
                        'percentage' => $ccPercentage
                    ]);

                    // Log progress
                    if ($dailyRevenue > 0) {
                        $this->info("Day {$day}: FC: {$fcAmount} ({$fcPercentage}%), CC: {$ccAmount} ({$ccPercentage}%), Revenue: {$dailyRevenue}");
                    } else {
                        $this->info("Day {$day}: FC: {$fcAmount}, CC: {$ccAmount}, No revenue");
                    }
                }

                // Calculate and log monthly summary
                $fcAverage = $cumulativeRevenue > 0 ? ($cumulativeFC / $cumulativeRevenue) * 100 : null;
                $ccAverage = $cumulativeRevenue > 0 ? ($cumulativeCC / $cumulativeRevenue) * 100 : null;
                
                $this->info("Month {$month}/{$year} Summary:");
                $this->info("Total FC: {$cumulativeFC}, Average: " . ($fcAverage !== null ? round($fcAverage, 2) . '%' : 'N/A'));
                $this->info("Total CC: {$cumulativeCC}, Average: " . ($ccAverage !== null ? round($ccAverage, 2) . '%' : 'N/A'));
                $this->info("Total Revenue: {$cumulativeRevenue}");

                // Move to next month
                $currentDate->addMonth();
            }
        }

        $this->info("FC and CC records generation completed!");
        
        // Log completion for monitoring
        Log::info('Generated FC and CC records', [
            'period' => "{$startMonth}/{$startYear} to {$endMonth}/{$endYear}",
            'completed_at' => now()
        ]);
    }

    private function storeRecord($data)
    {
        try {
            // Check if record already exists
            $exists = DB::table('cost_analytics')->where([
                'restaurant_id' => $data['restaurant_id'],
                'day' => $data['day'],
                'month' => $data['month'],
                'year' => $data['year'],
                'type' => $data['type']
            ])->exists();

            if ($exists) {
                // Update existing record
                DB::table('cost_analytics')->where([
                    'restaurant_id' => $data['restaurant_id'],
                    'day' => $data['day'],
                    'month' => $data['month'],
                    'year' => $data['year'],
                    'type' => $data['type']
                ])->update([
                    'amount' => $data['amount'],
                    'cumul' => $data['cumul'],
                    'revenue' => $data['revenue'],
                    'cumul_revenue' => $data['cumul_revenue'],
                    'percentage' => $data['percentage'],
                    'updated_at' => now()
                ]);
            } else {
                // Create new record
                DB::table('cost_analytics')->insert([
                    'restaurant_id' => $data['restaurant_id'],
                    'day' => $data['day'],
                    'month' => $data['month'],
                    'year' => $data['year'],
                    'type' => $data['type'],
                    'amount' => $data['amount'],
                    'cumul' => $data['cumul'],
                    'revenue' => $data['revenue'],
                    'cumul_revenue' => $data['cumul_revenue'],
                    'percentage' => $data['percentage'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        } catch (\Exception $e) {
            $this->error("Error storing record: " . $e->getMessage());
            Log::error('Error in GenerateFCCCRecords', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
        }
    }
}