<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;

class GenerateTestBL extends Command
{
    protected $signature = 'bl:generate-test {restaurant?} {type?}';
    protected $description = 'Generate test BL PDF with random data';

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
        'BL Conserve et pates'
    ];

    private $restaurants = ['Anoual', 'Palmier', 'To Go', 'Ziraoui', 'Labo'];

    private $sampleProducts = [
        'BL Economat' => [
            ['designation' => 'Huile Olive', 'unite' => 'L'],
            ['designation' => 'Sel', 'unite' => 'Kg'],
            ['designation' => 'Poivre', 'unite' => 'Kg']
        ],
        'BL Poisson' => [
            ['designation' => 'Saumon', 'unite' => 'Kg'],
            ['designation' => 'Thon', 'unite' => 'Kg'],
            ['designation' => 'Crevettes', 'unite' => 'Kg']
        ],
        'BL Viande' => [
            ['designation' => 'Boeuf Haché', 'unite' => 'Kg'],
            ['designation' => 'Poulet', 'unite' => 'Kg'],
            ['designation' => 'Agneau', 'unite' => 'Kg']
        ]
    ];

    public function handle()
    {
        $restaurant = $this->argument('restaurant') ?? $this->choice(
            'Select restaurant:',
            $this->restaurants,
            0
        );

        $type = $this->argument('type') ?? $this->choice(
            'Select BL type:',
            $this->validTypes,
            0
        );

        $data = $this->generateRandomData($restaurant, $type);
        $pdfUrl = $this->generatePdfForType($type, $data, $restaurant);

        $this->info("Test PDF generated successfully: $pdfUrl");
    }

    private function generateRandomData($restaurant, $type)
    {
        $products = $this->sampleProducts[$type] ?? $this->sampleProducts['BL Economat'];
        $productList = [];

        foreach ($products as $index => $product) {
            $productList[] = [
                'product_id' => $index + 1,
                'designation' => $product['designation'],
                'qty' => (string)rand(1, 20),
                'image' => 'products/default.jpg',
                'unite' => $product['unite'],
                'has_rest' => (bool)rand(0, 1),
                'rest' => (string)rand(0, 5)
            ];
        }

        return [[
            'restau' => $restaurant,
            'products' => $productList
        ]];
    }

    private function generatePdfForType($type, $data, $restaurant)
    {
        $view = 'pdf.livraison-summary-receipt';
        $fileName = 'test_livraison_' . str_slug($type) . '_' . str_slug($restaurant) . '_' . now()->format('Y-m-d_H-i') . '.pdf';
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
        
        if (!file_exists(public_path("storage/$directory"))) {
            mkdir(public_path("storage/$directory"), 0755, true);
        }

        if (!$pdf->saveAs(public_path("storage/$directory/$file_name"))) {
            $error = $pdf->getError();
            $this->error("PDF generation failed: $error");
            return null;
        }
        return asset("storage/$directory/$file_name");
    }
}