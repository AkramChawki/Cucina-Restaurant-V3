<?php

namespace App\Services;

use App\Models\Livraison;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ThermalReceiptService
{
    /**
     * Generate all thermal receipts directly from livraisons
     */
    public function generateAllThermalReceipts($startDate, $endDate)
    {
        // Get all livraisons in the time period
        $livraisons = Livraison::where(function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate])
                  ->orWhereBetween('date', [$startDate, $endDate]);
        })->get();
        
        Log::info("Found total livraisons in time period: " . $livraisons->count());
        
        // Group livraisons by restaurant_group
        $restaurantGroups = $livraisons->groupBy('restaurant_group');
        
        Log::info("Found restaurant groups: " . implode(', ', $restaurantGroups->keys()->toArray()));
        
        $receipts = [];
        
        foreach ($restaurantGroups as $restaurant => $restaurantLivraisons) {
            Log::info("Processing restaurant: '$restaurant' with " . $restaurantLivraisons->count() . " livraisons");
            
            // Skip if restaurant is empty or null
            if (empty($restaurant)) {
                Log::info("Skipping empty restaurant name");
                continue;
            }
            
            // Group livraisons by thermal type
            $thermalBlocks = [];
            
            foreach ($restaurantLivraisons as $livraison) {
                $originalType = $livraison->type;
                $thermalType = BLTypeMappingService::getThermalType($originalType);
                
                // Initialize array for this thermal type if it doesn't exist
                if (!isset($thermalBlocks[$thermalType])) {
                    $thermalBlocks[$thermalType] = [
                        'type' => $thermalType,
                        'products' => []
                    ];
                }
                
                // Add products from this livraison
                foreach ($livraison->data as $restauData) {
                    // Only process products if restau matches restaurant_group
                    // This ensures we're only getting products for the current restaurant
                    if ($restauData['restau'] === $restaurant) {
                        Log::info("Processing products for {$restauData['restau']} (matches $restaurant)");
                        
                        foreach ($restauData['products'] as $product) {
                            // Check if product already exists in the thermal block
                            $existingProduct = $this->findExistingProduct($thermalBlocks[$thermalType]['products'], $product);
                            
                            if ($existingProduct) {
                                // Increase quantity of existing product
                                $existingProduct['qty'] = (string)((int)$existingProduct['qty'] + (int)$product['qty']);
                            } else {
                                // Add new product to thermal block
                                $thermalBlocks[$thermalType]['products'][] = $product;
                            }
                        }
                    }
                }
            }
            
            // Filter out empty thermal blocks
            $thermalBlocks = array_filter($thermalBlocks, function ($block) {
                return !empty($block['products']);
            });
            
            if (empty($thermalBlocks)) {
                Log::info("No products found for $restaurant after processing");
                continue;
            }
            
            // Create the receipt data
            $receiptData = [
                'id' => Str::uuid()->toString(),
                'restaurant' => $restaurant,
                'date' => Carbon::now()->format('Y-m-d H:i:s'),
                'thermal_blocks' => array_values($thermalBlocks),
            ];
            
            $receipts[] = $receiptData;
            Log::info("Created thermal receipt for $restaurant");
        }
        
        return $receipts;
    }

    /**
     * Find existing product in thermal block products array
     */
    private function findExistingProduct($products, $newProduct)
    {
        foreach ($products as &$product) {
            if ($product['product_id'] == $newProduct['product_id']) {
                return $product;
            }
        }

        return null;
    }
}