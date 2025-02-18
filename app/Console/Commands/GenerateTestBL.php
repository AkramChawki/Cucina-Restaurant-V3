<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;

class GenerateTestBL extends Command
{
    protected $signature = 'bl:generate-test';
    protected $description = 'Generate test BL in both PDF and PNG formats';

    private $testData = [
        'restau' => 'Anoual',
        'products' => [
            [
                'product_id' => 1,
                'designation' => 'Pizza Margherita Base',
                'qty' => '50',
                'image' => 'products/pizza.jpg',
                'unite' => 'pcs'
            ],
            [
                'product_id' => 2,
                'designation' => 'Sauce Tomate',
                'qty' => '20',
                'image' => 'products/sauce.jpg',
                'unite' => 'L'
            ],
            [
                'product_id' => 3,
                'designation' => 'Mozzarella',
                'qty' => '15',
                'image' => 'products/cheese.jpg',
                'unite' => 'kg'
            ],
            [
                'product_id' => 4,
                'designation' => 'Basilic Frais',
                'qty' => '2',
                'image' => 'products/basil.jpg',
                'unite' => 'kg'
            ]
        ]
    ];

    public function handle()
    {
        $this->info('Starting test BL generation...');

        // Test data setup
        $type = 'BL Test';
        $data = [$this->testData];
        $timestamp = now()->format('Y-m-d_H-i');
        
        // Generate PDF version
        $this->info('Generating PDF version...');
        $pdfUrl = $this->generatePdfVersion($type, $data, $timestamp);
        if ($pdfUrl) {
            $this->info('PDF generated successfully: ' . $pdfUrl);
        }

        // Generate direct HTML version that can be printed
        $this->info('Generating HTML version...');
        $htmlUrl = $this->generateHtmlVersion($type, $data, $timestamp);
        if ($htmlUrl) {
            $this->info('HTML generated successfully: ' . $htmlUrl);
        }

        // Generate regular A4 version for comparison
        $this->info('Generating A4 version for comparison...');
        $a4Url = $this->generateA4Version($type, $data, $timestamp);
        if ($a4Url) {
            $this->info('A4 PDF generated successfully: ' . $a4Url);
        }
    }

    private function generatePdfVersion($type, $data, $timestamp)
    {
        $view = 'pdf.livraison-summary-receipt';
        $fileName = "receipt_test_{$timestamp}";
        $directory = 'receipts/test';

        return $this->generate_thermal_pdf($view, [
            'type' => $type,
            'data' => $data,
        ], $fileName, $directory);
    }

    private function generateHtmlVersion($type, $data, $timestamp)
    {
        $view = 'pdf.livraison-summary-receipt';
        $fileName = "receipt_test_{$timestamp}.html";
        $directory = 'receipts/test';

        try {
            // Ensure directory exists
            if (!file_exists(public_path("storage/$directory"))) {
                mkdir(public_path("storage/$directory"), 0755, true);
            }

            // Generate HTML content
            $html = view($view, [
                'type' => $type,
                'data' => $data,
                'directPrint' => true, // Add this flag to modify template behavior
            ])->render();

            // Add auto-print script
            $html .= "
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>";

            // Save HTML file
            file_put_contents(public_path("storage/$directory/$fileName"), $html);

            return asset("storage/$directory/$fileName");
        } catch (\Exception $e) {
            $this->error("HTML generation failed: " . $e->getMessage());
            return null;
        }
    }

    private function generateA4Version($type, $data, $timestamp)
    {
        $view = 'pdf.livraison-summary';
        $fileName = "receipt_test_a4_{$timestamp}";
        $directory = 'receipts/test';

        return $this->generate_a4_pdf($view, [
            'type' => $type,
            'data' => $data,
        ], $fileName, $directory);
    }

    private function generate_thermal_pdf($view, $data, $file_name, $directory)
    {
        $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
        $pdf->binary = base_path('vendor/silvertipsoftware/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');
        
        // Set options for thermal paper size
        $pdf->setOptions([
            'page-size' => 'A7',        // A7 is closest to thermal paper width
            'orientation' => 'Portrait', // Use portrait for narrow width
            'margin-top' => '0mm',
            'margin-bottom' => '0mm',
            'margin-left' => '0mm',
            'margin-right' => '0mm',
            'dpi' => '203',
            'disable-smart-shrinking' => true,
            'zoom' => '0.7',            // Adjust zoom to fit thermal paper width
            'print-media-type' => true  // Use print media type for better formatting
        ]);

        // Ensure directory exists
        if (!file_exists(public_path("storage/$directory"))) {
            mkdir(public_path("storage/$directory"), 0755, true);
        }

        if (!$pdf->saveAs(public_path("storage/$directory/$file_name.pdf"))) {
            $error = $pdf->getError();
            $this->error("PDF generation failed: $error");
            return null;
        }
        return asset("storage/$directory/$file_name.pdf");
    }

    private function generate_a4_pdf($view, $data, $file_name, $directory)
    {
        $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
        $pdf->binary = base_path('vendor/silvertipsoftware/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');

        // Ensure directory exists
        if (!file_exists(public_path("storage/$directory"))) {
            mkdir(public_path("storage/$directory"), 0755, true);
        }

        if (!$pdf->saveAs(public_path("storage/$directory/$file_name.pdf"))) {
            $error = $pdf->getError();
            $this->error("PDF generation failed: $error");
            return null;
        }
        return asset("storage/$directory/$file_name.pdf");
    }
}