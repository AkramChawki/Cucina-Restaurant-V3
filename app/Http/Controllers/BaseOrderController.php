<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\PdfGeneratorTrait;

abstract class BaseOrderController extends Controller
{
    use PdfGeneratorTrait;

    abstract protected function getModelClass();
    abstract protected function getPdfPrefix();
    abstract protected function getPdfDirectory();

    public function store(Request $request)
    {
        set_time_limit(500);


        try {
            $order = $this->createOrder($request);
            
            if ($order) {
                $pdfName = $this->generatePdfName($order);
                $this->savePdf($order, $pdfName);
                return redirect("/");
            } else {
                return "error";
            }
        } catch (\Exception $e) {
            return "error";
        }
    }

    protected function createOrder(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'restau' => 'nullable|string',  // Changed to nullable
            'products' => 'required|array',
            'products.*.product_id' => 'required|integer',
            'products.*.qty' => 'required|integer|min:1',
        ]);


        $detail = $validated['products'];

        if (empty($detail)) {
            return null;
        }

        $modelClass = $this->getModelClass();
        $order = new $modelClass();
        $order->name = $validated['name'];
        $order->restau = $validated['restau'] ?? null;  // Use null if restau is not provided
        $order->detail = $detail;
        
        try {
            $order->save();
        } catch (\Exception $e) {
            throw $e;
        }
        return $order;
    }

    protected function generatePdfName($order)
    {
        $prefix = $this->getPdfPrefix();
        return $this->generatePdfFileName($prefix, $order);
    }

    protected function savePdf($order, $pdfName)
    {
        $pdfUrl = $this->generatePdfAndSave("pdf.order-summary", ["order" => $order], $pdfName, $this->getPdfDirectory());
        $order->pdf = $pdfName;
        $order->save();
    }
}