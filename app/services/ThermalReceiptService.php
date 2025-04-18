<?php

namespace App\Services;

use App\Models\Livraison;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ThermalReceiptService
{
    /**
     * Generate all thermal receipts directly using a simple approach
     */
    public function generateAllThermalReceipts($startDate, $endDate)
    {
        // Bypass all the complex logic and get unique restaurant names directly from database
        $restaurants = Livraison::distinct('restaurant_group')
            ->whereNotNull('restaurant_group')
            ->pluck('restaurant_group')
            ->toArray();
            
        Log::info("Found restaurants from DB: " . implode(', ', $restaurants));
        
        // Initialize receipts array
        $receipts = [];
        
        // Process each restaurant separately
        foreach ($restaurants as $restaurant) {
            // Skip empty restaurant names
            if (empty($restaurant)) continue;
            
            Log::info("Processing restaurant: " . $restaurant);
            
            // Get all livraisons for this restaurant
            $livraisons = Livraison::where('restaurant_group', $restaurant)->get();
            
            if ($livraisons->isEmpty()) {
                Log::info("No livraisons found for: " . $restaurant);
                continue;
            }
            
            // Group by thermal type
            $thermalBlocks = [];
            
            foreach ($livraisons as $livraison) {
                $originalType = $livraison->type;
                $thermalType = BLTypeMappingService::getThermalType($originalType);
                
                // Create the thermal block if it doesn't exist
                if (!isset($thermalBlocks[$thermalType])) {
                    $thermalBlocks[$thermalType] = [
                        'type' => $thermalType,
                        'products' => []
                    ];
                }
                
                // Add all products from this livraison's data
                if (!empty($livraison->data)) {
                    foreach ($livraison->data as $dataItem) {
                        if (isset($dataItem['products']) && !empty($dataItem['products'])) {
                            foreach ($dataItem['products'] as $product) {
                                // See if we already have this product
                                $found = false;
                                foreach ($thermalBlocks[$thermalType]['products'] as &$existingProduct) {
                                    if ($existingProduct['product_id'] == $product['product_id']) {
                                        // Update quantity
                                        $existingProduct['qty'] = (string)((int)$existingProduct['qty'] + (int)$product['qty']);
                                        $found = true;
                                        break;
                                    }
                                }
                                
                                // Add new product if not found
                                if (!$found) {
                                    $thermalBlocks[$thermalType]['products'][] = $product;
                                }
                            }
                        }
                    }
                }
            }
            
            // Filter out empty blocks
            $thermalBlocks = array_filter($thermalBlocks, function($block) {
                return !empty($block['products']);
            });
            
            if (empty($thermalBlocks)) {
                Log::info("No products found for restaurant: " . $restaurant);
                continue;
            }
            
            // Create the receipt
            $receipt = [
                'id' => Str::uuid()->toString(),
                'restaurant' => $restaurant,
                'date' => Carbon::now()->format('Y-m-d H:i:s'),
                'thermal_blocks' => array_values($thermalBlocks)
            ];
            
            $receipts[] = $receipt;
            Log::info("Created thermal receipt for: " . $restaurant);
        }
        
        return $receipts;
    }
}