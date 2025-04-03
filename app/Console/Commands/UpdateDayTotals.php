<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CostCuisine;
use App\Models\CostPizza;
use App\Models\CostEconomat;
use App\Models\CostConsomable;
use App\Models\DayTotal;
use App\Models\CuisinierProduct;
use Illuminate\Support\Facades\DB;

class UpdateDayTotals extends Command
{
    protected $signature = 'day-totals:update {--type=all : Type of cost (cuisine, pizza, economat, consomable, all)}';
    protected $description = 'Update day totals with current product prices';

    protected $costModels = [
        'cuisine' => CostCuisine::class,
        'pizza' => CostPizza::class,
        'economat' => CostEconomat::class,
        'consomable' => CostConsomable::class,
    ];

    public function handle()
    {
        $type = $this->option('type');
        
        if ($type === 'all') {
            foreach (array_keys($this->costModels) as $costType) {
                $this->updateTotalsForType($costType);
            }
        } elseif (isset($this->costModels[$type])) {
            $this->updateTotalsForType($type);
        } else {
            $this->error("Invalid type: $type");
            return 1;
        }

        $this->info('Day totals updated successfully!');
        return 0;
    }

    protected function updateTotalsForType($type)
    {
        $modelClass = $this->costModels[$type];
        $records = $modelClass::all();
        $this->info("Updating {$records->count()} records for type: $type");

        $bar = $this->output->createProgressBar($records->count());
        $bar->start();

        DB::beginTransaction();
        try {
            foreach ($records as $record) {
                // Get the product with current price
                $product = CuisinierProduct::find($record->product_id);
                if (!$product) {
                    $this->warn("Product {$record->product_id} not found, skipping");
                    $bar->advance();
                    continue;
                }

                // Handle daily_data which is already an array due to Laravel's casting
                $dailyData = is_array($record->daily_data) 
                    ? $record->daily_data 
                    : json_decode($record->daily_data, true);
                
                if (empty($dailyData)) {
                    $bar->advance();
                    continue;
                }

                // Recalculate product daily totals with current price
                foreach ($dailyData as $day => $data) {
                    $morning = $data['morning'] ?? 0;
                    $afternoon = $data['afternoon'] ?? 0;
                    $newTotal = ($morning + $afternoon) * $product->prix;
                    
                    // Update the daily_data JSON
                    $dailyData[$day]['total'] = $newTotal;
                    
                    // Update or create the day total record
                    $this->updateDayTotal($record->restaurant_id, $day, $record->month, $record->year, $type);
                }

                // Save the updated daily_data (handle both array and string cases)
                $record->daily_data = $dailyData;
                $record->save();
                
                $bar->advance();
            }
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error updating records: " . $e->getMessage());
            throw $e;
        }

        $bar->finish();
        $this->newLine(2);
    }

    protected function updateDayTotal($restaurantId, $day, $month, $year, $type)
    {
        // Get all product records for this restaurant, day, month, year, and type
        $modelClass = $this->costModels[$type];
        $records = $modelClass::where('restaurant_id', $restaurantId)
            ->where('month', $month)
            ->where('year', $year)
            ->get();

        $total = 0;

        foreach ($records as $record) {
            // Handle daily_data which may already be an array
            $dailyData = is_array($record->daily_data)
                ? $record->daily_data
                : json_decode($record->daily_data, true);
                
            if (isset($dailyData[$day])) {
                $product = CuisinierProduct::find($record->product_id);
                $morning = $dailyData[$day]['morning'] ?? 0;
                $afternoon = $dailyData[$day]['afternoon'] ?? 0;
                $total += ($morning + $afternoon) * $product->prix;
            }
        }

        // Update the day total record
        DayTotal::updateOrCreate(
            [
                'restaurant_id' => $restaurantId,
                'day' => $day,
                'month' => $month,
                'year' => $year,
                'type' => $type
            ],
            ['total' => $total]
        );
    }
}