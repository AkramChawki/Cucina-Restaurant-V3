<?php

namespace App\Traits;

use Exception;

trait PdfGeneratorTrait
{
    protected function generatePdfAndSave($view, $data, $fileName, $directory)
    {
        $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
        $pdf->binary = base_path('vendor/silvertipsoftware/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');
        
        $filePath = public_path("storage/$directory/$fileName");
        
        if (!$pdf->saveAs($filePath)) {
            throw new Exception("Failed to generate PDF: " . $pdf->getError());
        }
        
        return asset("storage/$directory/$fileName");
    }

    protected function generatePdfFileName($prefix, $model)
    {
        $restauPart = $model->restau ? "-{$model->restau}" : '';
        return "{$prefix}-{$model->name}{$restauPart}-{$model->created_at->format('d-m-Y')}-{$model->id}.pdf";
    }
}