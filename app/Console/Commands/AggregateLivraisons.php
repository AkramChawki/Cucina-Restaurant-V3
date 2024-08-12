<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CuisinierOrder;
use App\Models\CuisinierProduct;
use App\Models\Livraison;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class AggregateLivraisons extends Command
{
    protected $signature = 'livraisons:aggregate';
    protected $description = 'Aggregate yesterday\'s orders into livraisons and send summary email';

    private $validTypes = ["MALAK", "SALAH", "HIBA", "SABAH", "NAJIB"];
    private $summaryData = [];

    public function handle()
    {
        $now = Carbon::now('Europe/Paris');
        $startDate = $this->getStartDate($now);
        $endDate = $this->getEndDate($now);

        $query = CuisinierOrder::whereBetween('created_at', [$startDate, $endDate])
            ->with('detail.product');

        $orders = $query->get();

        $aggregatedData = $this->aggregateData($orders);

        $this->processAggregatedData($startDate, $aggregatedData);
    }

    private function getStartDate(Carbon $now)
    {
        if ($now->hour < 17) {
            return $now->yesterday('Europe/Paris')->setTime(18, 0, 0);
        }

        return $now->today('Europe/Paris')->setTime(4, 0, 0);
    }

    private function getEndDate(Carbon $now)
    {
        if ($now->hour < 17) {
            return $now->today('Europe/Paris')->setTime(3, 0, 0);
        }

        return $now->today('Europe/Paris')->setTime(17, 0, 0);
    }

    private function aggregateData($orders)
    {
        $aggregatedData = [];

        foreach ($orders as $order) {
            $restau = $order->restau;

            if (is_null($restau)) {
                continue;
            }

            foreach ($order->detail as $item) {
                $this->processItem($aggregatedData, $item, $restau);
            }
        }

        return $aggregatedData;
    }

    private function processItem(&$aggregatedData, $item, $restau)
    {
        $product = $item->product;

        if ($product && in_array($product->type, $this->validTypes)) {
            $type = $product->type;

            if (!isset($aggregatedData[$type][$restau][$product->id])) {
                $aggregatedData[$type][$restau][$product->id] = [
                    'designation' => $product->designation,
                    'qty' => 0,
                    'image' => $product->image,
                    'unite' => $product->unite
                ];
            }

            $aggregatedData[$type][$restau][$product->id]['qty'] += $item->qty;
        }
    }

    private function processAggregatedData(Carbon $startDate, $aggregatedData)
    {
        foreach ($aggregatedData as $type => $restaus) {
            if (!empty($restaus)) {
                $formattedData = $this->formatData($restaus);

                if (!in_array($type, $this->validTypes)) {
                    $this->error("Invalid type: $type. Skipping this entry.");
                    continue;
                }

                $pdfUrl = $this->generatePdfForType($type, $formattedData);

                try {
                    $livraison = Livraison::create([
                        'date' => $startDate->toDateString(),
                        'type' => $type,
                        'data' => $formattedData,
                        'pdf_url' => $pdfUrl
                    ]);

                    $this->summaryData[] = [
                        'type' => $type,
                        'pdf_url' => $pdfUrl,
                        'data' => $formattedData
                    ];

                    $this->info("Livraison data for Type $type aggregated and stored successfully for " . $startDate->toDateString());
                } catch (\Exception $e) {
                    $this->error("Failed to create Livraison for Type $type: " . $e->getMessage());
                    $this->error("Data: " . json_encode([
                        'date' => $startDate->toDateString(),
                        'type' => $type,
                        'data' => $formattedData,
                        'pdf_url' => $pdfUrl
                    ]));
                }
            }
        }
    }

    private function formatData($restaus)
    {
        $formattedData = [];

        foreach ($restaus as $restau => $products) {
            $restauProducts = array_map(function ($product) {
                return [
                    'product_id' => $product['id'],
                    'designation' => $product['designation'],
                    'qty' => (string)$product['qty'],
                    'image' => $product['image'],
                    'unite' => $product['unite']
                ];
            }, $products);

            $formattedData[] = [
                'restau' => $restau,
                'products' => $restauProducts
            ];
        }

        return $formattedData;
    }

    private function generatePdfForType($type, $data)
    {
        $view = 'pdf.livraison-summary';
        $fileName = 'livraison_summary_' . $type . '_' . now()->format('Y-m-d H:i') . '.pdf';
        $directory = 'livraisons';

        return $this->generate_pdf_and_save($view, ['type' => $type, 'data' => $data], $fileName, $directory);
    }

    private function generate_pdf_and_save($view, $data, $file_name, $directory)
    {
        $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
        $pdf->binary = base_path('vendor/h4cc/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');
        if (!$pdf->saveAs(public_path("storage/$directory/$file_name"))) {
            $error = $pdf->getError();
            $this->error("PDF generation failed: $error");
            return null;
        }
        return asset("storage/$directory/$file_name");
    }
}
