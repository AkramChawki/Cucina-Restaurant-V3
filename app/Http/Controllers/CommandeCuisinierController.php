<?php

namespace App\Http\Controllers;

use App\Mail\OrderSummary;
use App\Models\CuisinierOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class CommandeCuisinierController extends Controller
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

        $order = new CuisinierOrder();
        $order->name = $request->name;
        $order->restau = $request->restau;
        $order->detail = $detail;
        $order->save();

        return $order;
    }

    private function generatePdfName($order)
    {
        $restauPart = $order->restau ?: '';
        return "Commande-{$order->name}-{$restauPart}-{$order->created_at->format('d-m-Y')}-{$order->id}.pdf";
    }

    private function savePdf($order, $pdfName)
    {
        $this->generatePdfAndSave("pdf.order-summary", ["order" => $order], $pdfName, "orders");
        $order->pdf = $pdfName;
        $order->save();
    }
}