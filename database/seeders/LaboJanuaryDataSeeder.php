<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CostCuisine;
use App\Models\CostPizza;
use App\Models\DayTotal;
use PhpOffice\PhpSpreadsheet\IOFactory;

class LaboJanuaryDataSeeder extends Seeder
{
    private $productMapping = [
        'Cuisine' => [
            'PARMESAN RAPPEE  POUR CUISINE' => 419,
            'COUPEUX PARMESAN CUISINE' => 416,
            'ARANCINI GAMBAS' => 68,
            'ARANCINI EPINARDS' => 367,
            'ARANCINI TRUFFE' => 70,
            'RAVIOLI BOLOGNAISE' => 55,
            'RAVIOLI EPINARDS' => 59,
            'RAVIOLI POLLO' => 57,
            'SAUCE TOMATE RAVIOLI BOLOGNAISE' => 54,
            'SAUCE PESTO RAVIOLI EPINARDS' => 58,
            'SAUCE CHAMPIGNONS RAVIOLI POLLO' => 361,
            'SAUCE TOMATE PASTA' => 43,
            'SAUCE BOLOGNAISE' => 46,
            'SAUCE POUR TAGLIATELLE ALFREDO' => 44,
            'CREME PESTO POUR VERDURA' => 45,
            'SUCE RISOTO TERRE ET MER ET PASTA PESTO GAMBAS' => 362,
            'SAUCE RISOTTO TRUFFE ET PASTA TRUFFE' => 49,
            'SAUCE CARBONARA' => 354,
            'SAUCE SALMON' => 356,
            'SAUCE MARE ROSA' => 51,
            'SAUCE CHAMPIGNONS' => 71,
            'SAUCE RISOTO FROMAGE ET PASTA 5 FROMAGES' => 40,
            'LASAGNE' => 67,
            'SAUCE RISOTO FRUIT DE MER' => 39,
            'RISOTO' => 38,
            'BAC SALAD' => 37,
            'SAUCE CESAR' => 28,
            'RATION JUS ANANAS POMME' => 35,
            'RATION JUS BETTRAVE' => 32,
            'DETOX' => 355,
            'SAUCE PESTO POUR CUISINE' => 414,
            'POULET POUR SALADE CESAR' => 33,
            'POULET POUR POLO PARMIGIANO ET MILANAISE' => 72,
            'EMINCE DE POUET' => 310,
            'EMINCE DE BŒUF' => 330,
            'POLLO CESAR' => 77,
            'PAVE SAUMON' => 407,
            'RIZ BLANC' => 332,
            'SACHET BROCOLLI DECOUPES' => 94,
            'SACHET CAROTTES DECOUPES' => 95,
            'SACHET COURGETTES DECOUPES' => 96,
            'PANNA COTTA EMPORTE' => 121,
            'PANNA COTTA SUR PLACE' => 373,
            'TIRAMISU EN CERCLE' => 122,
            'TIRAMISU A EMPORTER' => 299,
            'TIRAMISU SUR PLACE' => 372,
            'COULIS FRUITS ROUGE' => 295,
            'COULIS CARAMEL' => 128,
            'COULIS NOISETTE' => 363,
            'COULIS PISTACHE' => 157,
            'COULIS NUTELLA' => 364,
            'COULIS CHOCOLAT NOIR' => 156,
            'BOITE SPECULOS' => 158,
            'BOITE PISTACHE' => 368,
            'BOITE CACAO' => 369,
            'TAGLIATELLE' => 179,
            'PENNE' => 180,
            'SPAGHETTI' => 181,
            'OLIVE NOIRES POUR CUISINE' => 413,
            'THON POUR CUISINE' => 412,
        ],
        'Pizza' => [
            'BAC PATE A PIZZA' => 8,
            'CREME TRUFFE POUR PIZZA' => 365,
            'CREME PARMESAN POUR PIZZA' => 176,
            'CREME COURGETTE POUR PIZZA' => 175,
            'SAUCE BLANCHE GINGEMBRE' => 177,
            'SAUCE PESTO POUR PIZZA' => 173,
            'CREME BASILIC' => 406,
            'POULET POUR PIZZA' => 262,
            'VIANDE HACHEE POUR PIZZA' => 422,
            'SACHET GAMBAS' => 271,
            'SACHET CALAMARS' => 272,
            'SAUMON POUR PIZZA' => 265,
            'BROCHETTE DE SAUMON POUR PIZZA' => 405,
            'POMME DE TERRE' => 266,
            'Boite Jalapenos' => 190,
            'BOITE DE PETALES DE PISTACHES' => 370,
            'RATION EPINARDS POUR PIZZA' => 371,
            'CREME PISTACHE PIZZA' => 360,
            'TOMATE CONFITE' => 420,
            '4 FROMAGES' => 454,
            'GORGONZOLA' => 226,
            'PARMESAN RAPPEE POUR PIZZA' => 418,
            'COPEAUX DE PARMESAN POUR PIZZA' => 417,
            'SCAMORZA FUMEE' => 424,
            'DINDE FUMEE' => 217,
            'PEPPERONI' => 218,
            'BACON DE BŒUF' => 216,
            'JAMBON DE BŒUF' => 219,
            'SAUCE TOMATE PASTA' => 167,
            'OLIVE NOIRES POUR PIZZA' => 411,
            'THON POUR PIZZA' => 410,
        ]
    ];

    public function run()
    {
        $inputFileName = storage_path('app/seeds/LABO ZIRAOUI 012025.xlsx');
        $spreadsheet = IOFactory::load($inputFileName);

        // Process Pizza Sheet
        $pizzaSheet = $spreadsheet->getSheetByName('PIZZIRIAT');
        $this->processPizzaData($pizzaSheet);
        // Process Cuisine Sheet
        $cuisineSheet = $spreadsheet->getSheetByName('CUISINE');
        $this->processCuisineData($cuisineSheet);
    }

    private function processPizzaData($sheet)
    {
        $restaurantId = 5;
        $month = 1;
        $year = 2025;

        // First, let's get all day totals from row 1
        for ($day = 1; $day <= 31; $day++) {
            $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($day + 2); // Start from column C
            $value = $sheet->getCell($col . '1')->getValue();
            $dayTotal = is_numeric($value) ? floatval(trim(str_replace(' ', '', $value))) : 0;

            if ($dayTotal > 0) {
                DayTotal::updateOrCreate([
                    'restaurant_id' => $restaurantId,
                    'day' => $day,
                    'month' => $month,
                    'year' => $year,
                    'type' => 'pizza'
                ], [
                    'total' => $dayTotal
                ]);
            }
        }

        // Start from row 3 (first product after dates)
        $row = 3;
        while ($sheet->getCell('A' . $row)->getValue() !== null) {
            $productName = trim($sheet->getCell('A' . $row)->getValue());
            $productId = $this->getProductIdByName($productName, 'Pizza');

            if ($productId) {
                $dailyData = [];
                // Get price from column B, clean it up
                $priceValue = trim(str_replace(' ', '', $sheet->getCell('B' . $row)->getValue()));
                $price = floatval($priceValue);

                // Data starts from column C for quantities
                for ($day = 1; $day <= 31; $day++) {
                    $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($day + 2); // Start from column C
                    $value = $sheet->getCell($col . $row)->getValue();

                    // Convert to float and check if it's a valid number
                    $quantity = is_numeric($value) ? floatval($value) : 0;

                    // Include the day in daily_data if quantity exists
                    if ($quantity > 0) {
                        $halfQuantity = $quantity / 2;
                        $totalValue = $quantity * $price;

                        $dailyData[$day] = [
                            'morning' => $halfQuantity,
                            'afternoon' => $halfQuantity,
                            'total' => $totalValue
                        ];
                    }
                }

                if (!empty($dailyData)) {
                    CostPizza::updateOrCreate([
                        'restaurant_id' => $restaurantId,
                        'product_id' => $productId,
                        'month' => $month,
                        'year' => $year,
                    ], [
                        'daily_data' => $dailyData
                    ]);
                }
            }
            $row++;
        }
    }

    private function processCuisineData($sheet)
    {
        $restaurantId = 5;
        $month = 1;
        $year = 2025;

        // First, let's get all day totals from row 1
        for ($day = 1; $day <= 31; $day++) {
            $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($day + 2);
            $value = $sheet->getCell($col . '1')->getValue();
            $dayTotal = is_numeric($value) ? floatval(trim(str_replace(' ', '', $value))) : 0;

            if ($dayTotal > 0) {
                DayTotal::updateOrCreate([
                    'restaurant_id' => $restaurantId,
                    'day' => $day,
                    'month' => $month,
                    'year' => $year,
                    'type' => 'cuisine'
                ], [
                    'total' => $dayTotal
                ]);
            }
        }

        $row = 3;
        while ($sheet->getCell('A' . $row)->getValue() !== null) {
            $rawProductName = $sheet->getCell('A' . $row)->getValue();
            $productName = trim($rawProductName);
            $productId = $this->getProductIdByName($productName, 'Cuisine');

            if ($productId) {
                $dailyData = [];
                // Get price and clean it properly
                $priceValue = $sheet->getCell('B' . $row)->getValue();
                $price = is_numeric($priceValue) ? floatval($priceValue) :
                    floatval(trim(str_replace([' ', ','], ['', '.'], $priceValue)));

                // Debug logging for product 419
                if ($productId === 419) {
                    echo "Processing product 419:\n";
                    echo "Raw name: " . $rawProductName . "\n";
                    echo "Cleaned name: " . $productName . "\n";
                    echo "Price: " . $price . "\n";
                }

                for ($day = 1; $day <= 31; $day++) {
                    $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($day + 2);
                    $value = $sheet->getCell($col . $row)->getValue();
                    $quantity = is_numeric($value) ? floatval($value) : 0;

                    // Debug logging for product 419
                    if ($productId === 419 && $quantity > 0) {
                        echo "Day {$day}: Quantity = {$quantity}\n";
                    }

                    if ($quantity > 0) {
                        $halfQuantity = $quantity / 2;
                        $totalValue = $quantity * $price;

                        $dailyData[$day] = [
                            'morning' => $halfQuantity,
                            'afternoon' => $halfQuantity,
                            'total' => $totalValue
                        ];
                    }
                }

                if (!empty($dailyData)) {
                    // Debug logging for product 419
                    if ($productId === 419) {
                        echo "Daily data for 419: " . json_encode($dailyData) . "\n";
                    }

                    CostCuisine::updateOrCreate([
                        'restaurant_id' => $restaurantId,
                        'product_id' => $productId,
                        'month' => $month,
                        'year' => $year,
                    ], [
                        'daily_data' => $dailyData
                    ]);
                }
            }
            $row++;
        }
    }

    private function getProductIdByName($name, $type)
    {
        return $this->productMapping[$type][$name] ?? null;
    }
}
