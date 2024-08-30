<?php

namespace App\Console\Commands;

use App\Models\Audit;
use Illuminate\Console\Command;

class GenerateMissingAuditPdfs extends Command
{
    protected $signature = 'audits:generate-missing-pdfs';
    protected $description = 'Generate PDFs for audits that don\'t have one';

    public function handle()
    {
        $audits = Audit::whereNull('pdf')->get();

        $this->info("Found {$audits->count()} audits without PDFs. Generating...");

        $bar = $this->output->createProgressBar($audits->count());

        foreach ($audits as $audit) {
            $pdfName = $this->generatePdfName($audit);
            $this->savePdf($audit, $pdfName);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('All missing PDFs have been generated.');
    }

    private function generatePdfAndSave($view, $data, $fileName, $directory)
    {
        // Prepare the image with static dimensions
        if (isset($data['audit']) && $data['audit']->image) {
            $imagePath = storage_path('app/public/' . $data['audit']->image);
            $imageInfo = getimagesize($imagePath);
            
            if ($imageInfo !== false) {
                $aspectRatio = $imageInfo[0] / $imageInfo[1];
                $newWidth = 400; // Increased width for better visibility
                $newHeight = intval($newWidth / $aspectRatio);
                
                $data['imageWidth'] = $newWidth;
                $data['imageHeight'] = $newHeight;
            }
        }

        $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
        $pdf->binary = base_path('vendor/silvertipsoftware/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');
        
        // Set page size to A4 and adjust margins
        $pdf->setOptions([
            'page-size' => 'A4',
            'margin-top' => '20',
            'margin-right' => '20',
            'margin-bottom' => '20',
            'margin-left' => '20',
            'encoding' => 'UTF-8',
        ]);
        
        $filePath = public_path("storage/$directory/$fileName");
        
        if (!$pdf->saveAs($filePath)) {
            throw new \Exception("Failed to generate PDF: " . $pdf->getError());
        }
        
        return asset("storage/$directory/$fileName");
    }

    private function generatePdfName($audit)
    {
        return "Audit-{$audit->name}-{$audit->restau}-{$audit->date->format('Y-m-d')}-{$audit->id}.pdf";
    }

    private function savePdf($audit, $pdfName)
    {
        $pdfUrl = $this->generatePdfAndSave("pdf.audit-summary", ["audit" => $audit], $pdfName, "audits");
        $audit->pdf = $pdfUrl;
        $audit->save();
    }
}