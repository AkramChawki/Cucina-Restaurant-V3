<?php

namespace App\Services;

use App\Models\Livraison;
use App\Models\ThermalReceipt;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
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
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate])
                    ->orWhereBetween('date', [$startDate, $endDate]);
            })
            ->get();

        Log::info("Restaurant: $restaurant, Found: {$livraisons->count()} livraisons");

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
                // Use strpos instead of exact matching - restaurant should be contained in restau string
                // OR restaurant could be exactly 'Labo' for special case
                if (($restaurant === 'Labo' && $restauData['restau'] === 'Labo') ||
                    (strpos($restauData['restau'], $restaurant) !== false)
                ) {

                    Log::info("Processing products for {$restauData['restau']} (matched with $restaurant)");

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
                } else {
                    Log::info("Skipping products for {$restauData['restau']} (does not match $restaurant)");
                }
            }
        }

        // Filter out empty thermal blocks
        $thermalBlocks = array_filter($thermalBlocks, function ($block) {
            return !empty($block['products']);
        });

        if (empty($thermalBlocks)) {
            Log::info("No thermal blocks generated for $restaurant");
            return null;
        }

        // Create the final receipt data
        $receiptData = [
            'id' => Str::uuid()->toString(),
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
        // Use a list of the actual restaurant names that match what's in your database
        $restaurantNames = [
            'Cucina Napoli - Anoual',
            'Cucina Napoli - Palmier',
            'Cucina Napoli - To Go',
            'Cucina Napoli - Ziraoui',
            'Labo'
        ];

        Log::info("Processing thermal receipts for restaurants: " . implode(', ', $restaurantNames));

        $receipts = [];

        foreach ($restaurantNames as $restaurant) {
            $receipt = $this->generateThermalReceiptData($restaurant, $startDate, $endDate);
            if ($receipt) {
                $receipts[] = $receipt;
                Log::info("Thermal receipt created for $restaurant");
            } else {
                Log::info("No thermal receipt created for $restaurant");
            }
        }

        return $receipts;
    }
}
