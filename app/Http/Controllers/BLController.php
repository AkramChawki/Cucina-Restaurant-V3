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
        Log::info('Raw request data:', $request->all());

        // Validate the basic structure first
        $validated = $request->validate([
            'name' => 'required|string',
            'restau' => 'required|string',
            'products' => 'required|array|min:1',
        ]);

        // Process and validate products
        $validProducts = collect($request->input('products'))
            ->filter(function ($product) {
                return isset($product['product_id']) && 
                       isset($product['qty']) && 
                       isset($product['rest']);
            })
            ->map(function ($product) {
                return [
                    'product_id' => $product['product_id'],
                    'qty' => $product['qty'],
                    'rest' => $product['rest']
                ];
            })
            ->toArray();

        if (empty($validProducts)) {
            throw new \Exception('No valid products found in request');
        }

        $bl = new BL();
        $bl->name = $validated['name'];
        $bl->restau = $validated['restau'];
        
        // Format arrays for storage
        $bl->detail = array_map(function ($product) {
            return [
                'product_id' => $product['product_id'],
                'qty' => $product['qty']
            ];
        }, $validProducts);

        $bl->rest = array_map(function ($product) {
            return [
                'product_id' => $product['product_id'],
                'qty' => $product['rest']
            ];
        }, $validProducts);

        $bl->save();

        $pdfName = $this->generatePdfFileName("BL", $bl);
        $this->generatePdfAndSave("pdf.bl", ["bl" => $bl], $pdfName, "bl");
        $bl->pdf = $pdfName;
        $bl->save();

        return Inertia::location("https://restaurant.cucinanapoli.com/public/storage/bl/$pdfName");

    } catch (\Exception $e) {
        Log::error('BL Store Error: ' . $e->getMessage());
        return back()->withErrors(['error' => 'Une erreur est survenue lors de la création de la commande']);
    }
}
}
