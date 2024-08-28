<?php

namespace App\Http\Controllers;

use App\Models\DK;
use Illuminate\Http\Request;

class DKController extends Controller
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

        $order = $this->createOrder($request);
        $pdfName = $this->generatePdfName($order);
        $this->savePdf($order, $pdfName);

        return redirect("/");
    }

    private function createOrder(Request $request)
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

        $order = new DK();
        $order->name = $request->name;
        $order->restau = $request->restau;
        $order->detail = $detail;
        $order->save();

        return $order;
    }

    private function generatePdfName($order)
    {
        return "Commande-DK-{$order->name}-{$order->created_at->format('d-m-Y')}-{$order->id}.pdf";
    }

    private function savePdf($order, $pdfName)
    {
        $this->generatePdfAndSave("pdf.order-summary", ["order" => $order], $pdfName, "dk");
        $order->pdf = $pdfName;
        $order->save();
    }
}