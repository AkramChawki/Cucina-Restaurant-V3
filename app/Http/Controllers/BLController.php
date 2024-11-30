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
        Log::info('Received request data:', $request->all()); // Debug log

        $validatedData = $request->validate([
            'name' => 'required|string',
            'restau' => 'required|string',
            'products' => 'required|array',
            'products.*.product_id' => 'required|integer',
            'products.*.qty' => 'required|numeric|min:0',
            'products.*.rest' => 'required|numeric|min:0',
        ]);

        // Create BL with validated data
        $bl = new BL();
        $bl->name = $validatedData['name'];
        $bl->restau = $validatedData['restau'];
        
        // Store product details
        $bl->detail = array_map(function ($product) {
            return [
                'product_id' => $product['product_id'],
                'qty' => $product['qty']
            ];
        }, $validatedData['products']);

        // Store rest values
        $bl->rest = array_map(function ($product) {
            return [
                'product_id' => $product['product_id'],
                'qty' => $product['rest']
            ];
        }, $validatedData['products']);

        $bl->save();

        // Generate and save PDF
        $pdfName = $this->generatePdfFileName("BL", $bl);
        $this->generatePdfAndSave("pdf.bl", ["bl" => $bl], $pdfName, "bl");
        $bl->pdf = $pdfName;
        $bl->save();

        return Inertia::location("https://restaurant.cucinanapoli.com/public/storage/bl/$pdfName");

    } catch (\Exception $e) {
        Log::error('BL Store Error: ' . $e->getMessage());
        Log::error('Validation errors:', $e instanceof \Illuminate\Validation\ValidationException ? $e->errors() : []);
        return back()->withErrors(['error' => 'Une erreur est survenue lors de la création de la commande']);
    }
}
}
