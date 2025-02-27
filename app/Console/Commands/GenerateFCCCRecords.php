<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GenerateFCCCRecords extends Command
{
    protected $signature = 'generate:fccc {startMonth?} {startYear?} {endMonth?} {endYear?}';
    protected $description = 'Generate Food Cost and Consumable Cost records for specified period';

    public function handle()
    {
        // Get parameters (default: January and February 2025)
        $startMonth = $this->argument('startMonth') ?? 1;
        $startYear = $this->argument('startYear') ?? 2025;
        $endMonth = $this->argument('endMonth') ?? 2;
        $endYear = $this->argument('endYear') ?? 2025;

        $this->info("Generating FC and CC records from {$startMonth}/{$startYear} to {$endMonth}/{$endYear}");

        // Define the food cost types
        $fcTypes = [
            'cuisine', 'pizza', 'economat', 'bml_giada', 
            'bml_gastro', 'bml_legume', 'bml_boisson'
        ];
        
        // Define the consumable cost type
        $ccTypes = ['consomable'];

        // Get all restaurants
        $restaurants = DB::table('day_totals')
            ->select('restaurant_id')
            ->distinct()
            ->get();

        $this->info("Found " . count($restaurants) . " restaurants");

        // Process each restaurant
        foreach ($restaurants as $restaurant) {
            $restaurantId = $restaurant->restaurant_id;
            $this->info("Processing restaurant ID: {$restaurantId}");

            // Process each month in the range
            $currentDate = Carbon::createFromDate($startYear, $startMonth, 1);
            $endDate = Carbon::createFromDate($endYear, $endMonth, 1)->endOfMonth();

            while ($currentDate <= $endDate) {
                $year = $currentDate->year;
                $month = $currentDate->month;
                $daysInMonth = $currentDate->daysInMonth;

                $this->info("Processing {$month}/{$year} for restaurant {$restaurantId}");

                // Get restaurant name based on ID
                $restaurantName = '';
                switch ($restaurantId) {
                    case 1:
                        $restaurantName = 'Cucina Napoli - Anoual';
                        break;
                    case 2:
                        $restaurantName = 'Cucina Napoli - Palmier';
                        break;
                    case 5:
                        $restaurantName = 'Cucina Napoli - Ziraoui';
                        break;
                    default:
                        // Handle other restaurant mappings as needed
                        $this->warn("Unknown restaurant ID: {$restaurantId}");
                        break;
                }

                // Get all revenues for the month upfront (to avoid multiple queries)
                $monthlyRevenues = [];
                $cumulativeRevenues = [];
                $totalMonthlyRevenue = 0;

                for ($day = 1; $day <= $daysInMonth; $day++) {
                    $dailyRev = DB::table('cloture_caisses')
                        ->where('restau', $restaurantName)
                        ->whereDate('date', "{$year}-{$month}-{$day}")
                        ->sum('montant');
                    
                    $monthlyRevenues[$day] = $dailyRev;
                    $totalMonthlyRevenue += $dailyRev;
                    $cumulativeRevenues[$day] = $totalMonthlyRevenue;
                }

                // Get all FC/CC totals for the month upfront
                $monthlyFC = [];
                $cumulativeFC = [];
                $totalMonthlyFC = 0;

                $monthlyCC = [];
                $cumulativeCC = [];
                $totalMonthlyCC = 0;

                for ($day = 1; $day <= $daysInMonth; $day++) {
                    // Calculate FC (Food Cost) for this day
                    $fcAmount = DB::table('day_totals')
                        ->where('restaurant_id', $restaurantId)
                        ->where('day', $day)
                        ->where('month', $month)
                        ->where('year', $year)
                        ->whereIn('type', $fcTypes)
                        ->sum('total');
                    
                    $monthlyFC[$day] = $fcAmount;
                    $totalMonthlyFC += $fcAmount;
                    $cumulativeFC[$day] = $totalMonthlyFC;

                    // Calculate CC (Consumable Cost) for this day
                    $ccAmount = DB::table('day_totals')
                        ->where('restaurant_id', $restaurantId)
                        ->where('day', $day)
                        ->where('month', $month)
                        ->where('year', $year)
                        ->whereIn('type', $ccTypes)
                        ->sum('total');
                    
                    $monthlyCC[$day] = $ccAmount;
                    $totalMonthlyCC += $ccAmount;
                    $cumulativeCC[$day] = $totalMonthlyCC;
                }

                // Now create records for each day based on the pre-calculated values
                for ($day = 1; $day <= $daysInMonth; $day++) {
                    // Skip days with no entries
                    if (!isset($monthlyRevenues[$day]) || $monthlyRevenues[$day] <= 0) {
                        $this->info("No revenue for {$day}/{$month}/{$year} - skipping");
                        continue;
                    }

                    // Get the daily values
                    $fcAmount = $monthlyFC[$day] ?? 0;
                    $ccAmount = $monthlyCC[$day] ?? 0;
                    $fcCumul = $cumulativeFC[$day] ?? 0;
                    $ccCumul = $cumulativeCC[$day] ?? 0;
                    $dailyRevenue = $monthlyRevenues[$day] ?? 0;
                    $cumulRevenue = $cumulativeRevenues[$day] ?? 0;

                    // Calculate percentages based on cumulative values
                    // The percentage is calculated as (cumulative cost / cumulative revenue) * 100
                    $fcPercentage = $cumulRevenue > 0 ? ($fcCumul / $cumulRevenue) * 100 : 0;
                    $ccPercentage = $cumulRevenue > 0 ? ($ccCumul / $cumulRevenue) * 100 : 0;

                    // Store FC record
                    $this->storeRecord([
                        'restaurant_id' => $restaurantId,
                        'day' => $day,
                        'month' => $month,
                        'year' => $year,
                        'type' => 'FC',
                        'amount' => $fcAmount,
                        'cumul' => $fcCumul,
                        'revenue' => $dailyRevenue,
                        'cumul_revenue' => $cumulRevenue,
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
                        'cumul' => $ccCumul,
                        'revenue' => $dailyRevenue,
                        'cumul_revenue' => $cumulRevenue,
                        'percentage' => $ccPercentage
                    ]);

                    $this->info("Created FC/CC records for {$day}/{$month}/{$year} - Restaurant {$restaurantId}");
                    $this->info("FC: {$fcAmount} (Cumul: {$fcCumul}) - {$fcPercentage}%");
                    $this->info("CC: {$ccAmount} (Cumul: {$ccCumul}) - {$ccPercentage}%");
                    $this->info("Revenue: {$dailyRevenue} (Cumul: {$cumulRevenue})");
                }

                // Move to next month
                $currentDate->addMonth();
            }
        }

        $this->info("FC and CC records generation completed!");
    }

    private function storeRecord($data)
    {
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
    }
}