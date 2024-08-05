<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CuisinierOrder;
use App\Models\CuisinierProduct;
use App\Models\Livraison;
use Carbon\Carbon;

class AggregateLivraisons extends Command
{
    protected $signature = 'livraisons:aggregate';
    protected $description = 'Aggregate yesterday\'s orders into livraisons';

    public function handle()
    {
        $startDate = Carbon::yesterday('Europe/Paris')->setTime(4, 0, 0);
        $endDate = Carbon::today('Europe/Paris')->setTime(4, 0, 0);

        $orders = CuisinierOrder::whereBetween('created_at', [$startDate, $endDate])->get();

        $aggregatedData = [
            1 => [], 2 => [], 3 => [], 4 => [], 5 => []
        ];

        foreach ($orders as $order) {
            $restau = $order->restau;
            
            if (is_null($restau)) {
                continue;
            }
            
            foreach ($order->detail as $item) {
                $productId = $item['product_id'];
                $qty = (int)$item['qty'];
                
                $product = CuisinierProduct::find($productId);
                
                if ($product) {
                    $type = $product->type;
                    
                    if (!isset($aggregatedData[$type][$restau][$productId])) {
                        $aggregatedData[$type][$restau][$productId] = [
                            'name' => $product->name,
                            'qty' => 0
                        ];
                    }
                    
                    $aggregatedData[$type][$restau][$productId]['qty'] += $qty;
                }
            }
        }

        foreach ($aggregatedData as $type => $restaus) {
            if (!empty($restaus)) {
                $formattedData = [];
                foreach ($restaus as $restau => $products) {
                    $restauProducts = [];
                    foreach ($products as $productId => $data) {
                        $restauProducts[] = [
                            'product_id' => $productId,
                            'name' => $data['name'],
                            'qty' => (string)$data['qty']
                        ];
                    }
                    $formattedData[] = [
                        'restau' => $restau,
                        'products' => $restauProducts
                    ];
                }

                $pdfUrl = $this->generatePdfForType($type, $formattedData);
                
                Livraison::create([
                    'date' => $startDate->toDateString(),
                    'type' => $type,
                    'data' => $formattedData,
                    'pdf_url' => $pdfUrl
                ]);

                $this->info("Livraison data for Type $type aggregated and stored successfully for " . $startDate->toDateString());
            }
        }
    }

    private function generatePdfForType($type, $data)
    {
        $view = 'pdf.livraison-summary';
        $fileName = 'livraison_type_' . $type . '_' . now()->format('Y-m-d') . '.pdf';
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