<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\ThermalReceipt;

class CheckThermalReceiptDatabase extends Command
{
    protected $signature = 'app:check-thermal-db';
    protected $description = 'Check for database issues with thermal receipts';

    public function handle()
    {
        // Check if the table exists
        if (!Schema::hasTable('thermal_receipts')) {
            $this->error("Table 'thermal_receipts' does not exist!");
            return 1;
        }
        
        $this->info("Table 'thermal_receipts' exists.");
        
        // Check the structure of the table
        $columns = Schema::getColumnListing('thermal_receipts');
        $this->info("Columns in thermal_receipts: " . implode(', ', $columns));
        
        // Check if there are any constraints
        $constraints = DB::select("
            SELECT COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'thermal_receipts'
        ");
        
        $this->info("Constraints:");
        foreach ($constraints as $constraint) {
            $this->info("  {$constraint->COLUMN_NAME} - {$constraint->CONSTRAINT_NAME}");
        }
        
        // Try to manually insert a test record for each restaurant
        $testRestaurants = [
            'Cucina Napoli - Anoual',
            'Cucina Napoli - Palmier',
            'Cucina Napoli - To Go',
            'Cucina Napoli - Ziraoui',
            'Labo'
        ];
        
        foreach ($testRestaurants as $restaurant) {
            $this->info("\nTesting insert for restaurant: {$restaurant}");
            
            try {
                // Create test data
                $testData = [
                    'id' => Str::uuid()->toString(),
                    'restaurant' => $restaurant,
                    'date' => now()->format('Y-m-d H:i:s'),
                    'thermal_blocks' => [
                        [
                            'type' => 'BL Test',
                            'products' => [
                                [
                                    'product_id' => 1,
                                    'designation' => 'Test Product',
                                    'qty' => '1',
                                    'unite' => 'pcs'
                                ]
                            ]
                        ]
                    ]
                ];
                
                // Try direct insertion with DB facade
                $result = DB::table('thermal_receipts')->insert([
                    'receipt_id' => Str::uuid()->toString(),
                    'restaurant' => $restaurant,
                    'data' => json_encode($testData),
                    'printed' => false,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                
                if ($result) {
                    $this->info("  Direct DB insertion successful!");
                } else {
                    $this->error("  Direct DB insertion failed without exception");
                }
                
                // Try with Eloquent model
                $receipt = new ThermalReceipt();
                $receipt->receipt_id = Str::uuid()->toString();
                $receipt->restaurant = $restaurant;
                $receipt->data = $testData;
                $receipt->printed = false;
                
                $saved = $receipt->save();
                
                if ($saved) {
                    $this->info("  Eloquent model save successful with ID: {$receipt->id}");
                } else {
                    $this->error("  Eloquent model save failed without exception");
                }
                
            } catch (\Exception $e) {
                $this->error("  Exception during test: " . $e->getMessage());
                $this->error("  Exception type: " . get_class($e));
            }
        }
        
        // Display the counts for each restaurant
        $this->info("\nCurrent counts in database:");
        foreach ($testRestaurants as $restaurant) {
            $count = ThermalReceipt::where('restaurant', $restaurant)->count();
            $this->info("  {$restaurant}: {$count} receipts");
        }
        
        return 0;
    }
}