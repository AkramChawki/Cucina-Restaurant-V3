<?php

namespace Database\Seeders;

use App\Models\BML;
use App\Models\DayTotal;
use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class BMLJanuaryDataSeeder extends Seeder
{
    private const TYPES = [
        'GIADA' => 'giada',
        'GASTRO' => 'gastro',
        'LEGUME' => 'legume',
        'BOISSON' => 'boisson'
    ];

    public function run()
    {
        $inputFileName = storage_path('app/seeds/FACTURATION ZIRAOUI 022025.xlsx');
        $spreadsheet = IOFactory::load($inputFileName);

        foreach (self::TYPES as $sheetName => $type) {
            $sheet = $spreadsheet->getSheetByName($sheetName);
            if ($sheet) {
                $this->processSheet($sheet, $type);
            }
        }
    }

    private function processSheet($sheet, $type)
    {
        $restaurantId = 5;
        $row = 2;
        $currentDayEntries = [];
        $dailyTotals = [];

        while ($sheet->getCell('A' . $row)->getValue() !== null) {
            try {
                $dateCell = $sheet->getCell('A' . $row);
                
                // Skip header row
                if ($dateCell->getValue() === 'DATE' || !$dateCell->getValue()) {
                    $row++;
                    continue;
                }

                // Get the date value and ensure it's in the correct format
                $dateStr = $dateCell->getFormattedValue();
                if (empty($dateStr)) {
                    $row++;
                    continue;
                }

                // Parse the date string, assuming it's in MM/DD/YYYY format and convert to DD/MM/YYYY
                $dateParts = explode('/', $dateStr);
                if (count($dateParts) === 3) {
                    $month = $dateParts[0];
                    $day = $dateParts[1];
                    // Force year to be 2025
                    $year = '2025';
                    
                    // Create date in correct format (DD/MM/YYYY)
                    $correctDateStr = sprintf('%02d/%02d/%s', $day, $month, $year);
                    $currentDate = Carbon::createFromFormat('d/m/Y', $correctDateStr);
                } else {
                    throw new \Exception("Invalid date format: $dateStr");
                }

                // Get entry data
                $fournisseur = trim($sheet->getCell('B' . $row)->getValue() ?? '');
                $designation = trim($sheet->getCell('C' . $row)->getValue() ?? '');
                $unite = trim($sheet->getCell('D' . $row)->getValue() ?? '');
                $quantity = $this->parseNumber($sheet->getCell('E' . $row)->getValue());
                $price = $this->parseNumber($sheet->getCell('F' . $row)->getValue());
                $totalTTC = $this->parseNumber($sheet->getCell('G' . $row)->getValue());

                // Get daily total
                $dayTotal = $this->parseNumber($sheet->getCell('H' . $row)->getValue());
                
                // Store daily total if we have one
                if ($dayTotal > 0) {
                    $dateKey = $currentDate->format('Y-m-d');
                    $dailyTotals[$dateKey] = $dayTotal;
                }

                // Store entry data if we have valid data
                if ($fournisseur && $designation && $quantity > 0) {
                    $dateKey = $currentDate->format('Y-m-d');
                    if (!isset($currentDayEntries[$dateKey])) {
                        $currentDayEntries[$dateKey] = [];
                    }
                    
                    $currentDayEntries[$dateKey][] = [
                        'fournisseur' => $fournisseur,
                        'designation' => $designation,
                        'unite' => $unite,
                        'quantity' => $quantity,
                        'price' => $price,
                        'total_ttc' => $totalTTC,
                        'date' => $currentDate->copy(),
                    ];
                }

            } catch (\Exception $e) {
                Log::error("Error processing row {$row}: " . $e->getMessage());
            }

            $row++;
        }

        // Save all entries and daily totals
        foreach ($currentDayEntries as $dateKey => $entries) {
            $date = Carbon::parse($dateKey);
            
            // Save BML entries
            foreach ($entries as $entry) {
                BML::create([
                    'restaurant_id' => $restaurantId,
                    'fournisseur' => $entry['fournisseur'],
                    'designation' => $entry['designation'],
                    'quantity' => $entry['quantity'],
                    'price' => $entry['price'],
                    'unite' => $entry['unite'],
                    'date' => $entry['date']->format('Y-m-d'), // Ensure date is in YYYY-MM-DD format
                    'type' => $type,
                    'total_ttc' => $entry['total_ttc'],
                    'month' => $entry['date']->month,
                    'year' => 2025, // Force year to 2025
                ]);
            }

            // Save daily total
            $dayTotal = $dailyTotals[$dateKey] ?? array_sum(array_column($entries, 'total_ttc'));
            if ($dayTotal > 0) {
                DayTotal::updateOrCreate([
                    'restaurant_id' => $restaurantId,
                    'day' => $date->day,
                    'month' => $date->month,
                    'year' => 2025, // Force year to 2025
                    'type' => 'bml_' . $type
                ], [
                    'total' => $dayTotal
                ]);
            }
        }
    }

    private function parseNumber($value)
    {
        if (empty($value)) {
            return 0;
        }

        if (is_numeric($value)) {
            return floatval($value);
        }
        
        if (is_string($value)) {
            // Remove spaces and replace comma with dot
            $value = str_replace([' ', ','], ['', '.'], $value);
            if (is_numeric($value)) {
                return floatval($value);
            }
        }
        
        return 0;
    }
}