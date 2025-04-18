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
        // First, dump the parameters to see if they're correct
        Log::info("START DATE: " . $startDate->toDateTimeString());
        Log::info("END DATE: " . $endDate->toDateTimeString());
        
        // Get all livraisons in the time period without filters first
        $allLivraisons = Livraison::all();
        Log::info("TOTAL LIVRAISONS IN DATABASE (UNFILTERED): " . $allLivraisons->count());
        
        // Now get livraisons with date filters
        $livraisons = Livraison::where(function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        })->get();
        
        Log::info("FILTERED LIVRAISONS BY CREATED_AT: " . $livraisons->count());
        
        // Log each livraison's details
        foreach ($livraisons as $index => $livraison) {
            Log::info("LIVRAISON #{$index}: ID={$livraison->id}, Type={$livraison->type}, Restaurant={$livraison->restaurant_group}, Created={$livraison->created_at}");
            
            if ($livraison->data) {
                foreach ($livraison->data as $dataIndex => $dataItem) {
                    Log::info("  DATA ITEM #{$dataIndex}: Restau=" . ($dataItem['restau'] ?? 'NOT SET'));
                    
                    // Check if products exist and how many
                    if (isset($dataItem['products'])) {
                        Log::info("    PRODUCTS COUNT: " . count($dataItem['products']));
                    } else {
                        Log::info("    NO PRODUCTS FOUND");
                    }
                }
            } else {
                Log::info("  NO DATA FOUND");
            }
        }
        
        // MANUALLY CREATE THERMAL RECEIPTS FOR EACH RESTAURANT
        $receipts = [];
        $processedRestaurants = [];
        
        // First, gather all unique restaurant names 
        $restaurantNames = [];
        foreach ($livraisons as $livraison) {
            if (!empty($livraison->restaurant_group) && !in_array($livraison->restaurant_group, $restaurantNames)) {
                $restaurantNames[] = $livraison->restaurant_group;
            }
        }
        
        Log::info("UNIQUE RESTAURANT NAMES FOUND: " . implode(", ", $restaurantNames));
        
        // Process each restaurant
        foreach ($restaurantNames as $restaurant) {
            Log::info("PROCESSING RESTAURANT: {$restaurant}");
            
            // Group livraisons by thermal type
            $thermalBlocks = [];
            
            foreach ($livraisons as $livraison) {
                // Only process livraisons for this restaurant
                if ($livraison->restaurant_group !== $restaurant) {
                    Log::info("SKIPPING LIVRAISON #{$livraison->id} - Restaurant mismatch: '{$livraison->restaurant_group}' vs '{$restaurant}'");
                    continue;
                }
                
                Log::info("PROCESSING LIVRAISON #{$livraison->id} FOR {$restaurant}");
                
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
                foreach ($livraison->data as $dataItem) {
                    $restauInData = $dataItem['restau'] ?? 'UNKNOWN';
                    Log::info("CHECKING DATA ITEM - Restau in data: '{$restauInData}', Looking for: '{$restaurant}'");
                    
                    // Check if we should process this data item
                    if ($restauInData === $restaurant) {
                        Log::info("MATCHES! Processing products for {$restauInData}");
                        
                        if (isset($dataItem['products']) && !empty($dataItem['products'])) {
                            Log::info("FOUND " . count($dataItem['products']) . " PRODUCTS");
                            
                            foreach ($dataItem['products'] as $productIndex => $product) {
                                Log::info("  PRODUCT #{$productIndex}: ID={$product['product_id']}, Name={$product['designation']}, Qty={$product['qty']}");
                                
                                // Check if product already exists in the thermal block
                                $existingProduct = $this->findExistingProduct($thermalBlocks[$thermalType]['products'], $product);
                                
                                if ($existingProduct) {
                                    // Increase quantity of existing product
                                    $existingProduct['qty'] = (string)((int)$existingProduct['qty'] + (int)$product['qty']);
                                    Log::info("    UPDATED EXISTING PRODUCT, New Qty: {$existingProduct['qty']}");
                                } else {
                                    // Add new product to thermal block
                                    $thermalBlocks[$thermalType]['products'][] = $product;
                                    Log::info("    ADDED NEW PRODUCT");
                                }
                            }
                        } else {
                            Log::info("NO PRODUCTS FOUND IN DATA ITEM");
                        }
                    } else {
                        Log::info("NO MATCH - SKIPPING");
                    }
                }
            }
            
            // Filter out empty thermal blocks
            $thermalBlocks = array_filter($thermalBlocks, function ($block) {
                return !empty($block['products']);
            });
            
            if (empty($thermalBlocks)) {
                Log::info("NO THERMAL BLOCKS CREATED FOR {$restaurant}");
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
            $processedRestaurants[] = $restaurant;
            Log::info("CREATED THERMAL RECEIPT FOR {$restaurant}");
        }
        
        Log::info("TOTAL THERMAL RECEIPTS CREATED: " . count($receipts));
        Log::info("RESTAURANTS WITH RECEIPTS: " . implode(", ", $processedRestaurants));
        
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