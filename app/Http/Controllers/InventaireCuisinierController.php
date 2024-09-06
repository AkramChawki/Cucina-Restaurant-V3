<?php

namespace App\Http\Controllers;

use App\Models\Controle;
use App\Models\Inventaire;
use App\Models\Restaurant;
use App\Models\Fiche;
use App\Models\CuisinierCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;

class InventaireCuisinierController extends Controller
{
    use PdfGeneratorTrait;

    public function index()
    {
        $restaurants = Restaurant::all();
        $ficheId = request("ficheId");
        $exception = Fiche::with('rubrique')
            ->where('id', $ficheId)
            ->where(function ($query) {
                $query->where('name', 'like', '%Inventaire Interne%');
            })
            ->first();
        if ($exception) {
            $products = Fiche::find($ficheId)->cuisinier_products->groupBy('cuisinier_category_id');
            $categories = collect([]);
            foreach ($products as $categoryId => $products) {
                $category = CuisinierCategory::find($categoryId);
                $category->products = $products;
                $categories->push($category);
            }
            return Inertia::render('Inventaire/Stock', [
                "categories" => $categories,
                "ficheId" => $ficheId,
                "restau" => null,
            ]);
        } else {
            return Inertia::render('Inventaire/Inventaire', [
                "ficheId" => $ficheId,
                "restaurants" => $restaurants
            ]);
        }
    }

    public function stock()
    {
        $ficheId = request("ficheId");
        $restau = request("restau");
        $products = Fiche::find($ficheId)->cuisinier_products->groupBy('cuisinier_category_id');
        $categories = collect([]);
        foreach ($products as $categoryId => $products) {
            $category = CuisinierCategory::find($categoryId);
            $category->products = $products;
            $categories->push($category);
        }
        return Inertia::render('Inventaire/Stock', [
            "categories" => $categories,
            "ficheId" => $ficheId,
            "restau" => $restau,
        ]);
    }

    public function inventaire(Request $request)
    {
        set_time_limit(500);

        $order = $this->createOrder(new Inventaire(), $request);
        $pdfName = $this->generatePdfName($order, "Inventaire-Interne");
        $this->savePdf($order, $pdfName, "inventaire");

        return redirect("/");
    }

    public function controle(Request $request)
    {
        set_time_limit(500);

        $order = $this->createOrder(new Controle(), $request);
        $pdfName = $this->generatePdfName($order, "Controle-Interne");
        $this->savePdf($order, $pdfName, "inventaire");

        return redirect("/");
    }

    private function createOrder($model, Request $request)
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

        $order = new $model();
        $order->name = $request->name;
        $order->restau = $request->restau;
        $order->detail = $detail;
        $order->save();

        return $order;
    }

    private function generatePdfName($order, $prefix)
    {
        return $this->generatePdfName($prefix, $order);
    }

    private function savePdf($order, $pdfName, $directory)
    {
        $this->generatePdfAndSave("pdf.inventaire-summary", ["order" => $order], $pdfName, $directory);
        $order->pdf = $pdfName;
        $order->save();
    }
}