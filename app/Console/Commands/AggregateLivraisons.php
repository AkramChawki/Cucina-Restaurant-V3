<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CuisinierOrder;
use App\Models\CuisinierProduct;
use App\Models\Livraison;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\LivraisonSummary;

class AggregateLivraisons extends Command
{
    protected $signature = 'livraisons:aggregate';
    protected $description = 'Aggregate yesterday\'s orders into livraisons and send summary email';

    private $validTypes = ["MALAK", "SALAH", "HIBA", "SABAH", "NAJIB"];
    private $summaryData = [];

    public function handle()
    {
        $startDate = Carbon::yesterday('Europe/Paris')->setTime(4, 0, 0);
        $endDate = Carbon::today('Europe/Paris')->setTime(4, 0, 0);

        $orders = CuisinierOrder::whereBetween('created_at', [$startDate, $endDate])->get();

        $aggregatedData = array_fill_keys($this->validTypes, []);

        foreach ($orders as $order) {
            $restau = $order->restau;
            
            if (is_null($restau)) {
                continue;
            }
            
            foreach ($order->detail as $item) {
                $productId = $item['product_id'];
                $qty = (int)$item['qty'];
                
                $product = CuisinierProduct::find($productId);
                
                if ($product && in_array($product->type, $this->validTypes)) {
                    $type = $product->type;
                    
                    if (!isset($aggregatedData[$type][$restau][$productId])) {
                        $aggregatedData[$type][$restau][$productId] = [
                            'designation' => $product->designation,
                            'qty' => 0,
                            'image' => $product->image,
                            'unite' => $product->unite
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
                            'designation' => $data['designation'] ?? 'Unknown Product',
                            'qty' => (string)$data['qty'],
                            'image' => $data['image'] ?? null,
                            'unite' => $data['unite'] ?? null
                        ];
                    }
                    $formattedData[] = [
                        'restau' => $restau,
                        'products' => $restauProducts
                    ];
                }

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

        // $this->sendSummaryEmail();
    }

    private function generatePdfForType($type, $data)
    {
        $view = 'pdfs.livraison-type';
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

    private function sendSummaryEmail()
    {
        $recipientEmails = ['admin@cucinanapoli.com', 'akramchawki01@gmail.com'];

        foreach ($recipientEmails as $email) {
            Mail::to($email)->send(new LivraisonSummary($this->summaryData));
        }

        $this->info("Summary email sent to " . implode(', ', $recipientEmails));
    }
}