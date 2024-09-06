<?php

namespace App\Http\Controllers;

use App\Models\CuisinierOrder;
use App\Models\Restaurant;
use App\Models\Fiche;
use App\Models\CuisinierCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;

class CommandeCuisinierController extends Controller
{
    use PdfGeneratorTrait;

    public function index(Request $request)
    {
        $restaurants = Restaurant::all();
        $ficheId = $request->query('ficheId');
        $exception = Fiche::with('rubrique')
            ->where('id', $ficheId)
            ->where(function ($query) {
                $query->where('name', 'like', '%Labo%')
                    ->orWhere('name', 'like', '%Napoli Gang%');
            })
            ->first();

        if ($exception) {
            return $this->renderCommanderView($ficheId, null);
        } else {
            return Inertia::render('CommandeCuisinier/CommandeCuisinier', [
                "ficheId" => $ficheId,
                "restaurants" => $restaurants
            ]);
        }
    }

    public function create(Request $request)
    {
        $ficheId = $request->query('ficheId');
        $restau = $request->query('restau');
        
        return $this->renderCommanderView($ficheId, $restau);
    }

    private function renderCommanderView($ficheId, $restau)
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
        ]);
    }

    public function store(Request $request)
    {
        set_time_limit(500);

        $order = $this->createOrder($request);
        $pdfName = $this->generatePdfName($order);
        $this->savePdf($order, $pdfName);

        return redirect("/");
    }

    private function createOrder(Request $request)
    {
        $qty = array_filter($request->products, function ($product) {
            return !empty($product['qty']) && $product['qty'] > 0;
        });

        $detail = array_map(function ($product) {
            return [
                "product_id" => $product['id'],
                "qty" => $product['qty']
            ];
        }, $qty);

        $order = new CuisinierOrder();
        $order->name = $request->name;
        $order->restau = $request->restau;
        $order->detail = $detail;
        $order->save();

        return $order;
    }

    private function generatePdfName($order)
    {
        return $this->generatePdfFileName("Commande", $order);
    }

    private function savePdf($order, $pdfName)
    {
        $pdfUrl = $this->generatePdfAndSave("pdf.order-summary", ["order" => $order], $pdfName, "orders");
        $order->pdf = $pdfName;
        $order->save();
    }
}