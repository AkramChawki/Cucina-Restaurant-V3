<?php

namespace App\Http\Controllers;

use App\Models\BL;
use App\Models\CuisinierProduct;
use App\Traits\PdfGeneratorTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BLController extends Controller
{
    use PdfGeneratorTrait;

    private function calculateCRQuantity($qty, $cr) 
    {
        if (!$cr) return $qty;
        
        if ($qty <= $cr) {
            return $cr;
        }
        
        $multiplier = ceil($qty / $cr);
        return $cr * $multiplier;
    }

    private function isRestInputRequired()
    {
        // Always require rest input for BL
        return true;
    }

    public function store(Request $request)
    {
        set_time_limit(500);
        $requiresRest = $this->isRestInputRequired();
        try {
            $order = $this->createOrder($request, $requiresRest);
            if ($order) {
                $pdfName = $this->generatePdfName($order);
                $this->savePdf($order, $pdfName);

                return Inertia::location("https://restaurant.cucinanapoli.com/public/storage/bl/$pdfName");
            } else {
                return redirect()->back()->with('error', 'Failed to create order.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while processing your request.');
        }
    }

    private function createOrder(Request $request, $requiresRest)
    {
        $validationRules = [
            'name' => 'required|string',
            'restau' => 'required|string',
            'products' => 'required|array',
            'products.*.product_id' => 'required|integer',
            'products.*.qty' => 'required|integer|min:1',
            'products.*.rest' => 'required|numeric|min:0'  // Always require rest
        ];

        $validated = $request->validate($validationRules);

        // Fetch all products with their CR values
        $products = CuisinierProduct::whereIn('id', collect($validated['products'])->pluck('product_id'))
                                   ->get()
                                   ->keyBy('id');

        $detail = collect($validated['products'])->map(function ($item) use ($products) {
            $product = $products[$item['product_id']] ?? null;
            $qty = $item['qty'];
            if ($product && $product->cr) {
                $qty = $this->calculateCRQuantity($qty, $product->cr);
            }
            return [
                'product_id' => $item['product_id'],
                'qty' => $qty
            ];
        })->toArray();

        $rest = collect($validated['products'])->map(function ($item) {
            return [
                'product_id' => $item['product_id'],
                'qty' => floatval($item['rest'])
            ];
        })->toArray();

        if (empty($detail)) {
            return null;
        }

        $order = new BL();
        $order->name = $validated['name'];
        $order->restau = $validated['restau'];
        $order->detail = $detail;
        $order->rest = $rest;
        $order->save();

        return $order;
    }

    private function generatePdfName($order)
    {
        return $this->generatePdfFileName("Commande-BL", $order);
    }

    private function savePdf($order, $pdfName)
    {
        $requiresRest = $order->rest !== null;
        $pdfUrl = $this->generatePdfAndSave("pdf.order-summary", [
            "order" => $order,
            "showRest" => $requiresRest
        ], $pdfName, "bl");
        $order->pdf = $pdfName;
        $order->save();
    }
}
