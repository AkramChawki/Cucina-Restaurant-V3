<?php

namespace Database\Seeders;

use App\Models\CostConsomable;
use App\Models\CostEconomat;
use Illuminate\Database\Seeder;
use App\Models\DayTotal;
use PhpOffice\PhpSpreadsheet\IOFactory;

class EconomatJanuaryDataSeeder extends Seeder
{
    private $productMapping = [
        'Economat' => [
            'Poivre Blanc' => 132,
            'Origan' => 135,
            'Piment rouge' => 337,
            'Creme Balsamique' => 159,
            'Sirop Mojito' => 170,
            'cafe' => 245,
            'vinaigre Blanc' => 436,
            'vinaigre Normal' => 340,
            'Chapelure' => 450,
            'Farine' => 451,
            'sucre' => 452,
            'Boisson fer' => 351,
            'Sauce Barbecue' => 169,
            'La anchois sales' => 443,
            'Les anchois marines' => 189,
            'Huile de truffe' => 194,
            'Capres' => 437,
            'Olives noires' => 413,
            'Huile olive andalucia' => 439,
            'Huile d olive Atlas' => 440,
            'Huile friture' => 441,
            'Tabasco rouge' => 257,
            'Tabasco vert' => 259,
            'huile piquante' => 260,
            'SEL Pour Cuisine' => 456,
            'BEURRE' => 449,
            'GANT JETABLE' => 343,
        ],
        'Consomable' => [
            'Barquette Salade' => 204,
            'Barquette Ravioli et Rsotto et Arancini' => 281,
            'Barquette PASTA' => 206,
            'Macedoine dessert' => 280,
            'Barquette plat deux compartiments' => 207,
            'Pot Legumes' => 353,
            'Pot de sauce' => 211,
            'Carton Pizza' => 210,
            'Paille' => 212,
            'Sac Kraft' => 213,
            'Couvert a emporter dessert' => 289,
            'Couvert a emporter Plat' => 290,
            'Couvert a emporter Pasta' => 291,
            'Set de Table' => 357,
            'barquettes aluminium' => 374,
            'BARQUETTE POLLO CESAR' => 408,
            'Film alimentaire' => 434,
            'Papier aluminium' => 433,
            'Papier cuisson' => 453,
            'Charlotte' => 442,
            'Rouleau de caisse' => 201,
            'Rouleau de TPE' => 202,
            'CURDENT' => 335,
            'serviette' => 241,
            'Papier hygienique' => 242,
            'Sac Poubelle' => 431,
            'Papier essuie main' => 240,
            'Papier Zig Zag' => 243,
            'Barquette Mini Salade' => 352,
            'GOBLET JUS' => 205,
            'JAVEL' => 15,
            'DRAX' => 18,
            'VITABAC' => 25,
            'JX' => 401,
            'SANICROIX' => 17,
            'VITAHAND' => 14,
            'SUPERVIX' => 16,
            'MISTER GLASS' => 19,
            'NETCAL' => 20,
            'DEOBACT' => 26,
            'CLEAN PLAC' => 24,
        ]
    ];

    public function run()
    {
        $inputFileName = storage_path('app/seeds/ECONOMAT ZIRAOUI 022025.xlsx');
        $spreadsheet = IOFactory::load($inputFileName);

        $pizzaSheet = $spreadsheet->getSheetByName('ECONOMAT');
        $this->processPizzaData($pizzaSheet);
        $cuisineSheet = $spreadsheet->getSheetByName('CONSOMABLE');
        $this->processCuisineData($cuisineSheet);
    }

    private function processPizzaData($sheet)
    {
        $restaurantId = 5;
        $month = 2;
        $year = 2025;

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
                    'type' => 'economat'
                ], [
                    'total' => $dayTotal
                ]);
            }
        }

        $row = 3;
        while ($sheet->getCell('A' . $row)->getValue() !== null) {
            $productName = trim($sheet->getCell('A' . $row)->getValue());
            $productId = $this->getProductIdByName($productName, 'Economat');

            if ($productId) {
                $dailyData = [];
                $priceValue = trim(str_replace(' ', '', $sheet->getCell('B' . $row)->getValue()));
                $price = floatval($priceValue);

                for ($day = 1; $day <= 31; $day++) {
                    $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($day + 2);
                    $value = $sheet->getCell($col . $row)->getValue();

                    $quantity = is_numeric($value) ? floatval($value) : 0;

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
                    CostEconomat::updateOrCreate([
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
        $month = 2;
        $year = 2025;

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
                    'type' => 'consomable'
                ], [
                    'total' => $dayTotal
                ]);
            }
        }

        $row = 3;
        while ($sheet->getCell('A' . $row)->getValue() !== null) {
            $rawProductName = $sheet->getCell('A' . $row)->getValue();
            $productName = trim($rawProductName);
            $productId = $this->getProductIdByName($productName, 'Consomable');

            if ($productId) {
                $dailyData = [];
                $priceValue = $sheet->getCell('B' . $row)->getValue();
                $price = is_numeric($priceValue) ? floatval($priceValue) :
                    floatval(trim(str_replace([' ', ','], ['', '.'], $priceValue)));

                for ($day = 1; $day <= 31; $day++) {
                    $col = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($day + 2);
                    $value = $sheet->getCell($col . $row)->getValue();
                    $quantity = is_numeric($value) ? floatval($value) : 0;


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

                    CostConsomable::updateOrCreate([
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
