<?php

namespace App\Traits;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

trait PdfGeneratorTrait
{
    protected function generatePdfAndSave($view, $data, $fileName, $directory)
    {
        try {
            // Ensure directory exists
            Storage::disk('public')->makeDirectory($directory);
            
            $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
            $pdf->binary = base_path('vendor/silvertipsoftware/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');
            
            $filePath = storage_path("app/public/$directory/$fileName");
            
            Log::info('Attempting to save PDF', [
                'filePath' => $filePath,
                'directory' => $directory,
                'fileName' => $fileName
            ]);
            
            if (!$pdf->saveAs($filePath)) {
                $error = $pdf->getError();
                Log::error('PDF Generation Error', [
                    'error' => $error,
                    'filePath' => $filePath
                ]);
                throw new Exception("Failed to generate PDF: " . $error);
            }
            
            return "storage/$directory/$fileName";
            
        } catch (Exception $e) {
            Log::error('PDF Generation Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    protected function generatePdfFileName($prefix, $model)
    {
        $restauPart = $model->restau ? "-" . str_replace(' ', '_', $model->restau) : '';
        $date = $model->created_at->format('d-m-Y-His');
        return "{$prefix}{$restauPart}-{$date}-{$model->id}.pdf";
    }
}