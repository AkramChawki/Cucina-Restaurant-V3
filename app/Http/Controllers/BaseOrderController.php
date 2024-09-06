<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\PdfGeneratorTrait;
use Illuminate\Support\Facades\Log;

abstract class BaseOrderController extends Controller
{
    use PdfGeneratorTrait;

    abstract protected function getModelClass();
    abstract protected function getPdfPrefix();
    abstract protected function getPdfDirectory();

    public function store(Request $request)
    {
        set_time_limit(500);

        Log::info('Store method called in BaseOrderController');
        Log::info('Incoming request data:', $request->all());

        try {
            $order = $this->createOrder($request);
            
            if ($order) {
                $pdfName = $this->generatePdfName($order);
                $this->savePdf($order, $pdfName);

                Log::info('Order created successfully', ['order_id' => $order->id]);
                return redirect("/")->with('success', 'Order created successfully.');
            } else {
                Log::warning('Failed to create order');
                return redirect()->back()->with('error', 'Failed to create order.');
            }
        } catch (\Exception $e) {
            Log::error('Error in store method', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'An error occurred while processing your request.');
        }
    }

    protected function createOrder(Request $request)
    {
        Log::info('createOrder method called in BaseOrderController');

        $validated = $request->validate([
            'name' => 'required|string',
            'restau' => 'required|string',
            'products' => 'required|array',
            'products.*.product_id' => 'required|integer',
            'products.*.qty' => 'required|integer|min:1',
        ]);

        Log::info('Validated data:', $validated);

        $detail = $validated['products'];

        if (empty($detail)) {
            Log::warning('No products with quantity greater than 0');
            return null;
        }

        $modelClass = $this->getModelClass();
        $order = new $modelClass();
        $order->name = $validated['name'];
        $order->restau = $validated['restau'];
        $order->detail = $detail;
        $order->save();

        Log::info('Order created:', $order->toArray());

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