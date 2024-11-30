<?php

namespace App\Http\Controllers;

use App\Models\BL;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;
use Illuminate\Support\Facades\Log;


class BLController extends Controller
{
    use PdfGeneratorTrait;

    public function index()
    {
        $restaurants = \App\Models\Restaurant::all();
        $ficheName = request('ficheName');
        return Inertia::render('BL/BL', [
            'ficheName' => $ficheName,
            'restaurants' => $restaurants,
        ]);
    }

    public function create()
    {
        $ficheName = request("ficheName");
        $restau = request("restau");
        $fiche = \App\Models\Fiche::where('name', 'like', '%' . $ficheName . '%')->first();
        $products = $fiche->cuisinier_products->groupBy('cuisinier_category_id');
        $categories = collect([]);
        foreach ($products as $categoryId => $products) {
            $category = \App\Models\CuisinierCategory::find($categoryId);
            $category->products = $products;
            $categories->push($category);
        }
        return Inertia::render('BL/Commander', [
            "categories" => $categories,
            "ficheName" => $ficheName,
            "restau" => $restau,
            "requiresRest" => true
        ]);
    }

    public function store(Request $request)
{
    set_time_limit(500);

    try {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'restau' => 'required|string',
            'products' => 'required|array',
            'products.*.id' => 'required|integer',
            'products.*.qty' => 'required|numeric|min:0',
            'products.*.rest' => 'required|numeric|min:0',
        ]);

        $qty = array_filter($request->products, function ($product) {
            return !empty($product['qty']) && $product['qty'] > 0;
        });

        $detail = array_map(function ($product) {
            return [
                "product_id" => $product['id'],
                "qty" => $product['qty']
            ];
        }, $qty);

        $rest = array_map(function ($product) {
            return [
                "product_id" => $product['id'],
                "qty" => $product['rest']
            ];
        }, $qty);

        $bl = new BL();
        $bl->name = $request->name;
        $bl->restau = $request->restau;
        $bl->detail = $detail;
        $bl->rest = $rest;
        $bl->save();

        $pdfName = $this->generatePdfFileName("BL", $bl);
        $this->generatePdfAndSave("pdf.bl", ["bl" => $bl], $pdfName, "bl");
        $bl->pdf = $pdfName;
        $bl->save();

        return redirect()->route('BL.index')->with('success', 'Commande créée avec succès');
    } catch (\Exception $e) {
        log::error('BL Store Error: ' . $e->getMessage());
        return back()->withErrors(['error' => 'Une erreur est survenue lors de la création de la commande']);
    }
}
}