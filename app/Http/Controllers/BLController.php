<?php

namespace App\Http\Controllers;

use App\Models\BL;
use App\Traits\PdfGeneratorTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BLController extends Controller
{
    use PdfGeneratorTrait;

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

        $detail = collect($validated['products'])->map(function ($item) {
            return [
                'product_id' => $item['product_id'],
                'qty' => $item['qty']
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

        $order = new BL();  // or new Boisson() for BoissonController
        $order->name = $validated['name'];
        $order->restau = $validated['restau'];
        $order->detail = json_encode($detail);
        $order->rest = json_encode($rest);
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
