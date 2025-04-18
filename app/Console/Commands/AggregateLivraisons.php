<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CuisinierOrder;
use App\Models\CuisinierProduct;
use App\Models\Livraison;
use App\Models\BL;
use App\Models\Labo;
use App\Models\ThermalReceipt;
use App\Services\BLTypeMappingService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AggregateLivraisons extends Command
{
    protected $signature = 'livraisons:aggregate';
    protected $description = 'Aggregate orders into livraisons by restaurant and type';

    private $summaryData = [];

    public function handle()
    {
        $now = Carbon::now('Africa/Casablanca');

        if ($now->hour == 3 && $now->minute == 00) {
            $startDate = Carbon::yesterday('Africa/Casablanca')->setTime(16, 30, 0);
            $endDate = Carbon::today('Africa/Casablanca')->setTime(4, 0, 0);
        } elseif ($now->hour == 16 && $now->minute == 00) {
            $startDate = Carbon::today('Africa/Casablanca')->setTime(4, 0, 0);
            $endDate = Carbon::today('Africa/Casablanca')->setTime(16, 30, 0);
        } else {
            // For testing
            $startDate = Carbon::now('Africa/Casablanca')->subHours(12);
            $endDate = Carbon::now('Africa/Casablanca');
        }

        // Get orders from all sources
        $cuisinierOrders = CuisinierOrder::whereBetween('created_at', [$startDate, $endDate])->get();
        $blOrders = BL::whereBetween('created_at', [$startDate, $endDate])->get();
        $laboOrders = Labo::whereBetween('created_at', [$startDate, $endDate])->get();

        // Initialize aggregated data per restaurant
        $restaurants = ['Cucina Napoli - Anoual', 'Cucina Napoli - Palmier', 'Cucina Napoli - To Go', 'Cucina Napoli - Ziraoui'];
        $aggregatedData = [];
        foreach ($restaurants as $restaurant) {
            $aggregatedData[$restaurant] = array_fill_keys(BLTypeMappingService::$validTypes, []);
        }

        // Special handling for Labo (no restaurant)
        $aggregatedData['Labo'] = array_fill_keys(BLTypeMappingService::$validTypes, []);

        // Process each type of order
        foreach ($cuisinierOrders as $order) {
            if ($order->restau) {
                $this->processOrder($order, $aggregatedData[$order->restau]);
            }
        }

        foreach ($blOrders as $order) {
            if ($order->restau) {
                $this->processOrder($order, $aggregatedData[$order->restau]);
            }
        }

        foreach ($laboOrders as $order) {
            $this->processOrder($order, $aggregatedData['Labo']);
        }

        // Generate livraisons for each restaurant (A4 PDFs)
        foreach ($aggregatedData as $restaurant => $typeData) {
            if (!empty(array_filter($typeData))) {
                $this->processAggregatedData($typeData, $startDate, $restaurant);
            }
        }

        // Generate thermal receipts
        $this->generateThermalReceipts($startDate, $endDate);
    }

    private function processOrder($order, &$aggregatedData)
    {
        $isLaboOrder = $order instanceof Labo;

        foreach ($order->detail as $item) {
            $productId = $item['product_id'];
            $qty = (int)$item['qty'];

            $product = CuisinierProduct::find($productId);

            if ($product && in_array($product->type, BLTypeMappingService::$validTypes)) {
                $type = $product->type;

                if ($isLaboOrder) {
                    $type = 'BL Labo';
                }

                if (!isset($aggregatedData[$type][$productId])) {
                    $aggregatedData[$type][$productId] = [
                        'designation' => $product->designation,
                        'qty' => 0,
                        'image' => $product->image,
                        'unite' => $product->unite
                    ];
                }

                $aggregatedData[$type][$productId]['qty'] += $qty;
            }
        }
    }

    private function processAggregatedData($aggregatedData, $startDate, $restaurant)
    {
        foreach ($aggregatedData as $type => $products) {
            if (!empty($products)) {
                $formattedData = [];
                $productList = [];

                foreach ($products as $productId => $data) {
                    $productList[] = [
                        'product_id' => $productId,
                        'designation' => $data['designation'],
                        'qty' => (string)$data['qty'],
                        'image' => $data['image'],
                        'unite' => $data['unite']
                    ];
                }

                $formattedData[] = [
                    'restau' => $restaurant,
                    'products' => $productList
                ];

                if (!in_array($type, BLTypeMappingService::$validTypes)) {
                    $this->error("Invalid type: $type. Skipping this entry.");
                    continue;
                }

                $pdfUrl = $this->generatePdfForType($type, $formattedData, $restaurant);

                try {
                    $livraison = Livraison::create([
                        'date' => $startDate->toDateString(),
                        'type' => $type,
                        'data' => $formattedData,
                        'pdf_url' => $pdfUrl,
                        'restaurant_group' => $restaurant
                    ]);

                    $this->info("Livraison data for Type $type ($restaurant) aggregated and stored successfully");
                } catch (\Exception $e) {
                    $this->error("Failed to create Livraison for Type $type ($restaurant): " . $e->getMessage());
                }
            }
        }
    }

    private function generatePdfForType($type, $data, $restaurant)
    {
        $view = 'pdf.livraison-summary';
        $fileName = 'livraison_summary_' . str_slug($type) . '_' . str_slug($restaurant) . '_' . now()->format('Y-m-d_H-i') . '.pdf';
        $directory = 'livraisons';

        return $this->generate_pdf_and_save($view, [
            'type' => $type,
            'data' => $data,
        ], $fileName, $directory);
    }

    private function generate_pdf_and_save($view, $data, $file_name, $directory)
    {
        $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
        $pdf->binary = base_path('vendor/silvertipsoftware/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');
        if (!$pdf->saveAs(public_path("storage/$directory/$file_name"))) {
            $error = $pdf->getError();
            $this->error("PDF generation failed: $error");
            return null;
        }
        return asset("storage/$directory/$file_name");
    }

    private function generateThermalReceipts($startDate, $endDate)
    {
        // Force-create thermal receipts for each restaurant type
        $restaurants = ['Cucina Napoli - Anoual', 'Cucina Napoli - Palmier', 'Cucina Napoli - To Go', 'Cucina Napoli - Ziraoui', 'Labo'];
        
        $this->info("Generating thermal receipts directly for each restaurant");
        $createdCount = 0;
        
        foreach ($restaurants as $restaurant) {
            $this->info("Processing $restaurant...");
            
            // Get livraisons for this restaurant
            $livraisons = \App\Models\Livraison::where('restaurant_group', $restaurant)->get();
            
            if ($livraisons->isEmpty()) {
                $this->info("No livraisons found for $restaurant, skipping");
                continue;
            }
            
            $this->info("Found " . $livraisons->count() . " livraisons for $restaurant");
            
            // Group products by thermal type
            $thermalBlocks = [];
            
            foreach ($livraisons as $livraison) {
                $originalType = $livraison->type;
                $thermalType = BLTypeMappingService::getThermalType($originalType);
                
                if (!isset($thermalBlocks[$thermalType])) {
                    $thermalBlocks[$thermalType] = [
                        'type' => $thermalType,
                        'products' => []
                    ];
                }
                
                // Get products
                if (!empty($livraison->data)) {
                    foreach ($livraison->data as $dataItem) {
                        if (isset($dataItem['products']) && !empty($dataItem['products'])) {
                            foreach ($dataItem['products'] as $product) {
                                // Check if product already exists
                                $exists = false;
                                foreach ($thermalBlocks[$thermalType]['products'] as &$existingProduct) {
                                    if ($existingProduct['product_id'] == $product['product_id']) {
                                        $existingProduct['qty'] = (string)((int)$existingProduct['qty'] + (int)$product['qty']);
                                        $exists = true;
                                        break;
                                    }
                                }
                                
                                // Add if doesn't exist
                                if (!$exists) {
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
                $this->info("No products found for $restaurant, skipping");
                continue;
            }
            
            // Create receipt data
            $receiptData = [
                'id' => Str::uuid()->toString(),
                'restaurant' => $restaurant,
                'date' => Carbon::now()->format('Y-m-d H:i:s'),
                'thermal_blocks' => array_values($thermalBlocks)
            ];
            
            // Try to create the receipt with error handling for each step
            try {
                $this->info("Creating thermal receipt for $restaurant...");
                
                $receipt = new ThermalReceipt();
                $receipt->receipt_id = $receiptData['id'];
                $receipt->restaurant = $restaurant;
                $receipt->data = $receiptData;
                $receipt->printed = false;
                $saved = $receipt->save();
                
                if ($saved) {
                    $this->info("SUCCESS: Created thermal receipt for $restaurant with ID $receipt->id");
                    $createdCount++;
                } else {
                    $this->error("FAILED: Could not create thermal receipt for $restaurant");
                }
            } catch (\Exception $e) {
                $this->error("EXCEPTION creating thermal receipt for $restaurant: " . $e->getMessage());
            }
        }
        
        $this->info("Generated $createdCount thermal receipts");
    }
}