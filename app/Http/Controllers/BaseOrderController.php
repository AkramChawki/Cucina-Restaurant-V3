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
                Log::info('Order created', ['order' => $order->toArray()]);
                $pdfName = $this->generatePdfName($order);
                Log::info('PDF name generated', ['pdfName' => $pdfName]);
                $this->savePdf($order, $pdfName);
                Log::info('PDF saved');

                return response()->json([
                    'success' => true,
                    'message' => 'Order created successfully.',
                    'order' => $order,
                    'pdf' => $pdfName
                ]);
            } else {
                Log::warning('Failed to create order');
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create order.'
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Error in store method', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage()
            ], 500);
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
        
        try {
            $order->save();
            Log::info('Order saved successfully', ['order' => $order->toArray()]);
        } catch (\Exception $e) {
            Log::error('Error saving order', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
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