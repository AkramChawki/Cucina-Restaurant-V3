<?php

namespace App\Http\Controllers;

use App\Models\Labo;
use App\Traits\PdfGeneratorTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LaboController extends Controller
{
    use PdfGeneratorTrait;

    public function index()
    {
        $labos = Labo::orderBy('created_at', 'desc')->get();
        return inertia('Labo', ['labos' => $labos]);
    }

    private function isRestInputRequired()
    {
        $tz = 'Africa/Casablanca';
        $now = Carbon::now($tz);

        // For products that always require rest
        if (request()->query('ficheId') == 20 || request()->query('ficheId') == 6) {
            return true;
        }

        // If current time is after midnight but before 3 AM
        if ($now->hour < 3) {
            $startTime = $now->copy()->subDay()->setTime(20, 0, 0);
            $endTime = $now->copy()->setTime(3, 0, 0);
        } else {
            // If current time is between 20:00 and 23:59
            $startTime = $now->copy()->setTime(20, 0, 0);
            $endTime = $now->copy()->addDay()->setTime(3, 0, 0);
        }

        // Check if current time is between start and end time
        return $now->between($startTime, $endTime);
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

                return redirect("/")->with('success', 'Order created successfully.');
            } else {
                return redirect()->back()->with('error', 'Failed to create order.');
            }
        } catch (\Exception $e) {
            Log::error('Labo order creation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'An error occurred while processing your request.');
        }
    }

    private function createOrder(Request $request, $requiresRest)
    {
        $validationRules = [
            'name' => 'required|string',
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
                    'qty' => $item['rest']
                ];
            })->toArray();
        }

        if (empty($detail)) {
            return null;
        }

        $order = new Labo();
        $order->name = $validated['name'];
        $order->restau = $request->input('restau', null); // Get restau from request, default to null if not present
        $order->detail = $detail;
        $order->rest = $rest;
        $order->save();

        return $order;
    }

    private function generatePdfName($order)
    {
        return $this->generatePdfFileName("Commande-Labo", $order);
    }

    private function savePdf($order, $pdfName)
    {
        $requiresRest = $order->rest !== null;

        $pdfUrl = $this->generatePdfAndSave("pdf.order-summary", [
            "order" => $order,
            "showRest" => $requiresRest
        ], $pdfName, "labo");

        $order->pdf = $pdfName;
        $order->save();
    }
}
