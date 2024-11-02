<?php

namespace App\Http\Controllers;

use App\Models\CuisinierOrder;
use App\Models\Restaurant;
use App\Models\Fiche;
use App\Models\CuisinierCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;
use Carbon\Carbon;

class CommandeCuisinierController extends Controller
{
    use PdfGeneratorTrait;

    private function isRestInputRequired()
    {
        $tz = 'Africa/Casablanca';
        $now = Carbon::now($tz);

        // From 5 AM to 4 PM
        $startTime = $now->copy()->setTime(5, 0, 0);
        $endTime = $now->copy()->setTime(17, 0, 0);

        $requiresRest = $now->between($startTime, $endTime);

        return $requiresRest;
    }

    public function index(Request $request)
    {
        $ficheId = $request->query('ficheId');
        $requiresRest = $this->isRestInputRequired();

        $exception = Fiche::with('rubrique')
            ->where('id', $ficheId)
            ->where(function ($query) {
                $query->where('name', 'like', '%Labo%');
            })
            ->first();

        if ($exception) {
            return $this->renderCommanderView($ficheId, null, $requiresRest);
        } else {
            $fiche = Fiche::find($ficheId);
            $ficheToRestaurantType = [
                1 => 'Cucina Napoli',
                5 => 'Cucina Napoli',
                19 => 'Cucina Napoli',
                20 => 'Cucina Napoli',
            ];
            $restaurantType = $ficheToRestaurantType[$ficheId] ?? null;
            $restaurants = $restaurantType
                ? Restaurant::where('type', $restaurantType)->get()
                : Restaurant::all();


            return Inertia::render('CommandeCuisinier/CommandeCuisinier', [
                "ficheId" => $ficheId,
                "restaurants" => $restaurants,
                "requiresRest" => $requiresRest
            ]);
        }
    }

    public function create(Request $request)
    {
        $ficheId = $request->query('ficheId');
        $restau = $request->query('restau');
        $requiresRest = $this->isRestInputRequired();


        return $this->renderCommanderView($ficheId, $restau, $requiresRest);
    }

    private function renderCommanderView($ficheId, $restau, $requiresRest)
    {
        $products = Fiche::find($ficheId)->cuisinier_products->groupBy('cuisinier_category_id');
        $categories = collect([]);

        foreach ($products as $categoryId => $products) {
            $category = CuisinierCategory::find($categoryId);
            $category->products = $products;
            $categories->push($category);
        }


        return Inertia::render('CommandeCuisinier/Commander', [
            "categories" => $categories,
            "ficheId" => $ficheId,
            "restau" => $restau,
            "requiresRest" => $requiresRest
        ]);
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
                    'qty' => $item['rest']
                ];
            })->toArray();
        }

        if (empty($detail)) {
            return null;
        }

        $order = new CuisinierOrder();
        $order->name = $validated['name'];
        $order->restau = $validated['restau'];
        $order->detail = $detail;
        $order->rest = $rest;
        $order->save();


        return $order;
    }

    private function generatePdfName($order)
    {
        return $this->generatePdfFileName("Commande", $order);
    }

    private function savePdf($order, $pdfName)
    {
        $requiresRest = $order->rest !== null;

        $pdfUrl = $this->generatePdfAndSave("pdf.order-summary", [
            "order" => $order,
            "showRest" => $requiresRest
        ], $pdfName, "orders");

        $order->pdf = $pdfName;
        $order->save();
    }
}
