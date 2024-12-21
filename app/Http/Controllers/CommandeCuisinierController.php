<?php

namespace App\Http\Controllers;

use App\Models\CuisinierOrder;
use App\Models\Restaurant;
use App\Models\Fiche;
use App\Models\CuisinierCategory;
use App\Models\CuisinierProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;
use Carbon\Carbon;

class CommandeCuisinierController extends Controller
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
                1 => ['Cucina Napoli', 'To Go'],
                5 => ['Cucina Napoli', 'To Go'],
                19 => ['Cucina Napoli', 'To Go'],
                20 => ['Cucina Napoli', 'To Go']
            ];
            $restaurantType = $ficheToRestaurantType[$ficheId] ?? null;
            $restaurants = $restaurantType
                ? Restaurant::whereIn('type', $restaurantType)->get()
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

        // Fetch all products with their CR values
        $products = CuisinierProduct::whereIn('id', collect($validated['products'])->pluck('product_id'))
                                   ->get()
                                   ->keyBy('id');

        $detail = collect($validated['products'])->map(function ($item) use ($products) {
            $product = $products[$item['product_id']];
            return [
                'product_id' => $item['product_id'],
                'qty' => $this->calculateCRQuantity($item['qty'], $product->cr)
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
