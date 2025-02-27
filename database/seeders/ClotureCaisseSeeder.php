<?php

namespace Database\Seeders;

use App\Models\ClotureCaisse;
use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ClotureCaisseSeeder extends Seeder
{
    /**
     * Map sheet names to proper restaurant names.
     */
    private $restaurantMapping = [
        'anoual' => 'Cucina Napoli - Anoual',
        'palmier' => 'Cucina Napoli - Palmier',
        'To Go' => 'Cucina Napoli - To Go'
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Path to the Excel file
        $inputFileName = storage_path('app/seeds/CA 0125.xlsx');
        
        try {
            // Load the spreadsheet
            $spreadsheet = IOFactory::load($inputFileName);
            
            // Process each sheet
            foreach ($spreadsheet->getSheetNames() as $sheetName) {
                $this->processSheet($spreadsheet->getSheetByName($sheetName), $sheetName);
            }
            
        } catch (\Exception $e) {
            Log::error("Error loading spreadsheet: " . $e->getMessage());
        }
    }
    
    /**
     * Process a single sheet from the Excel file.
     *
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @param string $sheetName
     * @return void
     */
    private function processSheet($sheet, $sheetName)
    {
        // Get the restaurant name based on sheet name
        $restaurantName = $this->restaurantMapping[$sheetName] ?? $sheetName;
        
        // Start from row 2 (assuming row 1 has headers)
        $row = 2;
        
        // Keep processing until we hit an empty row
        while ($sheet->getCell('A' . $row)->getValue() !== null) {
            try {
                // Extract date from column B (Date)
                $dateValue = $sheet->getCell('B' . $row)->getValue();
                if (!$dateValue) {
                    $row++;
                    continue;
                }
                
                // Parse date
                try {
                    if (is_numeric($dateValue)) {
                        $date = Carbon::instance(\PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($dateValue));
                        $dateStr = $date->format('Y-m-d');
                    } else {
                        // Try to parse as a string date (like "1/1/25")
                        $dateStr = Carbon::createFromFormat('n/j/y', $dateValue)->format('Y-m-d');
                    }
                } catch (\Exception $e) {
                    // Fallback to original value if parsing fails
                    $dateStr = $dateValue;
                }
                
                // Create the ClotureCaisse record
                ClotureCaisse::create([
                    'name' => $sheet->getCell('A' . $row)->getValue() ?? 'Unknown', // NOM
                    'restau' => $restaurantName, // Use mapped restaurant name
                    'date' => $dateStr,
                    'time' => date('H:i'), // Current time as we don't have time in the sheet
                    'responsable' => $sheet->getCell('E' . $row)->getValue() ?? 'Unknown', // RESPONSABLE
                    'montant' => $this->parseNumber($sheet->getCell('C' . $row)->getValue()), // Chiffre affaire
                    'montantE' => $this->parseNumber($sheet->getCell('D' . $row)->getValue()), // Espece
                    'cartebancaire' => $this->parseNumber($sheet->getCell('F' . $row)->getValue()), // TPE resto
                    'cartebancaireLivraison' => $this->parseNumber($sheet->getCell('G' . $row)->getValue()), // TPE Livraison
                    'virement' => $this->parseNumber($sheet->getCell('P' . $row)->getValue()), // Virement
                    'cheque' => 0, // Not present in sheet
                    'compensation' => $this->parseNumber($sheet->getCell('M' . $row)->getValue()), // COMPENSATION
                    'familleAcc' => $this->parseNumber($sheet->getCell('Q' . $row)->getValue()), // famille acc
                    'erreurPizza' => 0, // Set to 0 as specific error types aren't separated
                    'erreurCuisine' => 0, // Set to 0 as specific error types aren't separated
                    'erreurServeur' => 0, // Set to 0 as specific error types aren't separated
                    'erreurCaisse' => $this->parseNumber($sheet->getCell('O' . $row)->getValue()), // erreur
                    'perteEmporte' => $this->parseNumber($sheet->getCell('N' . $row)->getValue()), // perte
                    'giveawayPizza' => $this->parseNumber($sheet->getCell('R' . $row)->getValue()), // give way pizza
                    'giveawayPasta' => 0, // Not present in sheet
                    'glovoC' => $this->parseNumber($sheet->getCell('J' . $row)->getValue()), // GLOVO NP
                    'glovoE' => $this->parseNumber($sheet->getCell('I' . $row)->getValue()), // GLOVO ESPECE
                    'appE' => $this->parseNumber($sheet->getCell('K' . $row)->getValue()), // CUCINA APP ESP
                    'appC' => $this->parseNumber($sheet->getCell('L' . $row)->getValue()), // CUCINA APP NP
                    'shooting' => $this->parseNumber($sheet->getCell('S' . $row)->getValue()), // SHOOTING MARKETING
                    'ComGlovo' => 0, // Not present in sheet
                    'signature' => 'Imported', // Placeholder for signature
                ]);
                
            } catch (\Exception $e) {
                Log::error("Error processing sheet {$sheetName} row {$row}: " . $e->getMessage());
            }
            
            $row++;
        }
    }
    
    /**
     * Parse a number from various formats.
     *
     * @param mixed $value
     * @return float
     */
    private function parseNumber($value)
    {
        if (empty($value)) {
            return 0;
        }

        if (is_numeric($value)) {
            return floatval($value);
        }
        
        if (is_string($value)) {
            // Remove spaces, commas, and special characters
            $value = trim($value);
            
            // Handle values with whitespace like " 21,986.00    "
            $value = preg_replace('/\s+/', '', $value);
            
            // Replace comma with dot for decimal
            $value = str_replace(',', '.', $value);
            
            // Remove any non-numeric characters except decimal point
            $value = preg_replace('/[^0-9.]/', '', $value);
            
            if (is_numeric($value)) {
                return floatval($value);
            }
        }
        
        return 0;
    }
}