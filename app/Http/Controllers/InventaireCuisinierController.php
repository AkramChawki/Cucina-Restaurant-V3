<?php

namespace App\Http\Controllers;

use App\Models\Controle;
use App\Models\Inventaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InventaireCuisinierController extends Controller
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

    public function inventaire(Request $request)
    {
        set_time_limit(500);

        $order = $this->createOrder(new Inventaire(), $request);
        $pdfName = $this->generatePdfName($order, "Inventaire-Interne");
        $this->savePdf($order, $pdfName, "inventaire");

        return redirect("/");
    }

    public function controle(Request $request)
    {
        set_time_limit(500);

        $order = $this->createOrder(new Controle(), $request);
        $pdfName = $this->generatePdfName($order, "Controle-Interne");
        $this->savePdf($order, $pdfName, "inventaire");

        return redirect("/");
    }

    private function createOrder($model, Request $request)
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

        $order = new $model();
        $order->name = $request->name;
        $order->restau = $request->restau;
        $order->detail = $detail;
        $order->save();

        return $order;
    }

    private function generatePdfName($order, $prefix)
    {
        $restauPart = $order->restau == "/" ? "" : "-" . $order->restau;
        return "{$prefix}-{$order->name}{$restauPart}-{$order->created_at->format('d-m-Y')}-{$order->id}.pdf";
    }

    private function savePdf($order, $pdfName, $directory)
    {
        $this->generatePdfAndSave("pdf.inventaire-summary", ["order" => $order], $pdfName, $directory);
        $order->pdf = $pdfName;
        $order->save();
    }
}