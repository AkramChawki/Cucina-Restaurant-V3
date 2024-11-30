<?php

namespace App\Http\Controllers;

use App\Models\BL;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;

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
            "requiresRest" => true // Always true for BL
        ]);
    }

    public function store(Request $request)
    {
        set_time_limit(500);

        $validatedData = $request->validate([
            'name' => 'required|string',
            'restau' => 'required|string',
            'products' => 'required|array',
            'products.*.id' => 'required|integer',
            'products.*.qty' => 'required|numeric|min:0',
            'products.*.rest' => 'required|numeric|min:0',
        ]);
        $bl = $this->createBL($request);
        $pdfName = $this->generatePdfName($bl);
        $this->savePdf($bl, $pdfName);
        return Inertia::location($this->getPdfUrl($pdfName));
    }

    private function createBL(Request $request)
    {
        $qty = array_filter($request->products, function ($product) {
            return !empty($product['qty']) && $product['qty'] > 0;
        });

        $detail = array_map(function ($product) {
            return [
                "product_id" => $product['id'],
                "qty" => $product['qty'],
                "rest" => $product['rest']
            ];
        }, $qty);

        $bl = new BL();
        $bl->name = $request->name;
        $bl->restau = $request->restau;
        $bl->detail = $detail;
        $bl->save();

        return $bl;
    }

    private function generatePdfName($bl)
    {
        return $this->generatePdfFileName("BL", $bl);
    }

    private function savePdf($bl, $pdfName)
    {
        $this->generatePdfAndSave("pdf.bl", ["bl" => $bl], $pdfName, "bl");
        $bl->pdf = $pdfName;
        $bl->save();
    }

    private function getPdfUrl($pdfName)
    {
        return "https://restaurant.cucinanapoli.com/public/storage/bl/$pdfName";
    }
}