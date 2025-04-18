<?php

namespace App\Services;

use App\Models\Livraison;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ThermalReceiptService
{
    /**
     * Generate thermal receipt data for a restaurant within a date range
     */
    public function generateThermalReceiptData($restaurant, $startDate, $endDate)
    {
        // Find all livraisons for this restaurant within the date range
        $livraisons = Livraison::where('restaurant_group', $restaurant)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();
            
        if ($livraisons->isEmpty()) {
            return null;
        }
        
        // Group livraisons by thermal type
        $thermalBlocks = [];
        
        foreach ($livraisons as $livraison) {
            $originalType = $livraison->type;
            $thermalType = BLTypeMappingService::getThermalType($originalType);
            
            // Initialize array for this thermal type if it doesn't exist
            if (!isset($thermalBlocks[$thermalType])) {
                $thermalBlocks[$thermalType] = [
                    'type' => $thermalType,
                    'products' => []
                ];
            }
            
            // Add products from this livraison to the thermal type
            foreach ($livraison->data as $restauData) {
                if ($restauData['restau'] === $restaurant) {
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
        $thermalBlocks = array_filter($thermalBlocks, function($block) {
            return !empty($block['products']);
        });
        
        // Create the final receipt data
        $receiptData = [
            'id' => Str::uuid(),
            'restaurant' => $restaurant,
            'date' => Carbon::now()->format('Y-m-d H:i:s'),
            'thermal_blocks' => array_values($thermalBlocks), // Reset array keys
        ];
        
        return $receiptData;
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
    
    /**
     * Generate thermal receipts for all restaurants in a date range
     */
    public function generateAllThermalReceipts($startDate, $endDate)
    {
        $restaurants = ['Anoual', 'Palmier', 'To Go', 'Ziraoui', 'Labo'];
        $receipts = [];
        
        foreach ($restaurants as $restaurant) {
            $receipt = $this->generateThermalReceiptData($restaurant, $startDate, $endDate);
            if ($receipt) {
                $receipts[] = $receipt;
            }
        }
        
        return $receipts;
    }
}