<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CuisinierOrder;
use App\Models\CuisinierProduct;
use App\Models\Livraison;
use App\Models\BL;
use App\Models\Labo;
use Carbon\Carbon;

class AggregateLivraisons extends Command
{
    protected $signature = 'livraisons:aggregate';
    protected $description = 'Aggregate orders into livraisons by restaurant and type';

    private $validTypes = [
        'BL Economat',
        'BL Poisson',
        'BL Labo',
        'BL Viande',
        'BL Sauces Cuisine',
        'BL Sauces Pizza',
        'BL Boite Pizza',
        'BL Arancini et Ravioli',
        'BL Dessert',
        'BL Charcuterie et frommage',
        'BL Legume et jus',
        'BL Pate a pizza',
        'BL Conserve et pates',
        "BL Ramadan"
    ];

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
        }

        // Get orders from all sources
        $cuisinierOrders = CuisinierOrder::whereBetween('created_at', [$startDate, $endDate])->get();
        $blOrders = BL::whereBetween('created_at', [$startDate, $endDate])->get();
        $laboOrders = Labo::whereBetween('created_at', [$startDate, $endDate])->get();

        // Initialize aggregated data per restaurant
        $restaurants = ['Anoual', 'Palmier', 'To Go', 'Ziraoui'];
        $aggregatedData = [];
        foreach ($restaurants as $restaurant) {
            $aggregatedData[$restaurant] = array_fill_keys($this->validTypes, []);
        }

        // Special handling for Labo (no restaurant)
        $aggregatedData['Labo'] = array_fill_keys($this->validTypes, []);

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

        // Generate livraisons for each restaurant
        foreach ($aggregatedData as $restaurant => $typeData) {
            if (!empty(array_filter($typeData))) {
                $this->processAggregatedData($typeData, $startDate, $restaurant);
            }
        }
    }

    private function processOrder($order, &$aggregatedData)
    {
        $isLaboOrder = $order instanceof Labo;

        foreach ($order->detail as $item) {
            $productId = $item['product_id'];
            $qty = (int)$item['qty'];

            $product = CuisinierProduct::find($productId);

            if ($product && in_array($product->type, $this->validTypes)) {
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

                if (!in_array($type, $this->validTypes)) {
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
}
