<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\PdfGeneratorTrait;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

abstract class BaseOrderController extends Controller
{
    use PdfGeneratorTrait;

    abstract protected function getModelClass();
    abstract protected function getPdfPrefix();
    abstract protected function getPdfDirectory();

    protected function isRestInputRequired()
    {
        $tz = 'Africa/Casablanca';
        $now = Carbon::now($tz);

        // Set start time to 8 PM (20:00) of current day
        $startTime = $now->copy()->setTime(20, 0, 0);

        // Set end time to 3 AM (03:00) of next day
        $endTime = $now->copy()->addDay()->setTime(3, 0, 0);

        // Check if current time is between start and end time
        $requiresRest = $now->between($startTime, $endTime);

        return $requiresRest;
    }

    public function store(Request $request)
    {
        set_time_limit(500);
        $requiresRest = $this->isRestInputRequired();

        try {
            $order = $this->createOrder($request, $requiresRest);
            
            if ($order) {
                try {
                    $pdfName = $this->generatePdfName($order);
                    $pdfPath = $this->savePdf($order, $pdfName);
                    dd($pdfPath);
                    Log::info('Order created successfully', [
                        'order_id' => $order->id,
                        'pdf_path' => $pdfPath
                    ]);
                    
                    return redirect()->route('home')->with('success', 'Order created successfully.');
                } catch (\Exception $e) {
                    Log::error('PDF Generation failed', [
                        'error' => $e->getMessage(),
                        'order_id' => $order->id ?? null
                    ]);
                    
                    return redirect()->route('home')->with('warning', 'Order created but PDF generation failed.');
                }
            }
            
            return redirect()->back()->with('error', 'Failed to create order.');
            
        } catch (\Exception $e) {
            Log::error('Order creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'An error occurred while processing your request.');
        }
    }

    protected function createOrder(Request $request, $requiresRest = false)
    {
        $validationRules = [
            'name' => 'required|string',
            'restau' => 'required|string',
            'products' => 'required|array',
            'products.*.product_id' => 'required|integer',
            'products.*.qty' => 'required|integer|min:1',
        ];

        if ($requiresRest) {
            $validationRules['products.*.rest'] = 'required|numeric|min:0';
        }

        $validated = $request->validate($validationRules);

        $detail = collect($validated['products'])->map(function ($item) {
            return [
                'product_id' => $item['product_id'],
                'qty' => $item['qty']
            ];
        })->toArray();

        $rest = null;
        if ($requiresRest) {
            $rest = collect($validated['products'])->map(function ($item) {
                return [
                    'product_id' => $item['product_id'],
                    'qty' => isset($item['rest']) ? $item['rest'] : 0
                ];
            })->toArray();
        }

        if (empty($detail)) {
            return null;
        }

        $modelClass = $this->getModelClass();
        $order = new $modelClass();
        $order->name = $validated['name'];
        $order->restau = $validated['restau'];
        $order->detail = $detail;
        $order->rest = $rest;
        
        $order->save();
        
        return $order;
    }

    protected function generatePdfName($order)
    {
        $prefix = $this->getPdfPrefix();
        return $this->generatePdfFileName($prefix, $order);
    }

    protected function savePdf($order, $pdfName)
    {
        $requiresRest = $order->rest !== null;
        $directory = $this->getPdfDirectory();

        try {
            // Ensure directory exists
            Storage::disk('public')->makeDirectory($directory);

            $pdfPath = $this->generatePdfAndSave(
                "pdf.order-summary", 
                [
                    "order" => $order,
                    "showRest" => $requiresRest
                ],
                $pdfName,
                $directory
            );
            
            $order->pdf = $pdfName;
            $order->save();
            
            return $pdfPath;
            
        } catch (\Exception $e) {
            Log::error('PDF Generation failed in savePdf', [
                'error' => $e->getMessage(),
                'order_id' => $order->id,
                'directory' => $directory
            ]);
            throw $e;
        }
    }
}