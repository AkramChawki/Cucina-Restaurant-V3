<?php

namespace App\Http\Controllers;

use App\Models\BL;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BLController extends Controller
{
    private function generatePdfAndSave($view, $data, $fileName, $directory)
    {
        $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
        $pdf->binary = base_path('vendor/silvertipsoftware/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');
        
        $filePath = public_path("storage/$directory/$fileName");
        
        if (!$pdf->saveAs($filePath)) {
            throw new \Exception("Failed to generate PDF: " . $pdf->getError());
        }
        
        return asset("storage/$directory/$fileName");
    }

    public function store(Request $request)
    {
        set_time_limit(500);

        $bl = $this->createBL($request);
        $pdfName = $this->generatePdfName($bl);
        $this->savePdf($bl, $pdfName);

        return Inertia::location($this->getPdfUrl($pdfName));
    }

    private function createBL(Request $request)
    {
        $qty = array_filter($request->products, function ($product) {
            return !empty($product['qty']) && $product['qty'] > 0;
        });

        $detail = array_map(function ($product) {
            return [
                "product_id" => $product['id'],
                "qty" => $product['qty']
            ];
        }, $qty);

        $bl = new BL();
        $bl->name = $request->name;
        $bl->restau = $request->restau;
        $bl->detail = $detail;
        $bl->save();

        return $bl;
    }

    private function generatePdfName($bl)
    {
        $restauPart = $bl->restau ?: '';
        return "BL-{$bl->name}-{$restauPart}-{$bl->created_at->format('d-m-Y')}-{$bl->id}.pdf";
    }

    private function savePdf($bl, $pdfName)
    {
        $this->generatePdfAndSave("pdf.bl", ["bl" => $bl], $pdfName, "bl");
        $bl->pdf = $pdfName;
        $bl->save();
    }

    private function getPdfUrl($pdfName)
    {
        return "https://restaurant.cucinanapoli.com/public/storage/bl/$pdfName";
    }
}