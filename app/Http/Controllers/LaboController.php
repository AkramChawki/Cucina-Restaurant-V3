<?php

namespace App\Http\Controllers;

use App\Models\Labo;
use App\Traits\PdfGeneratorTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;

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
                $pdfName = $this->generatePdfName($order);
                $this->savePdf($order, $pdfName);

                return redirect("/")->with('success', 'Order created successfully.');
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
            'restau' => 'string',
            'products' => 'required|array',
            'products.*.product_id' => 'required|integer',
            'products.*.qty' => 'required|integer|min:1',
        ];

        if ($requiresRest) {
            $validationRules['products.*.rest'] = 'required|numeric|min:0';
        }

        $validated = $request->validate($validationRules);
        dd($validated);
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
        $order->restau = Null;
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