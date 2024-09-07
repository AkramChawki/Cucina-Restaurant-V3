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
use Illuminate\Support\Facades\Log;

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

        Log::info('Inventaire method called', $request->all());

        try {
            $order = $this->createOrder(new Inventaire(), $request);
            $pdfName = $this->generatePdfName($order, "Inventaire-Interne");
            $this->savePdf($order, $pdfName, "inventaire");

            return response()->json([
                'success' => true,
                'message' => 'Inventaire created successfully',
                'order' => $order,
                'pdfName' => $pdfName,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in inventaire method', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function controle(Request $request)
    {
        set_time_limit(500);

        Log::info('Controle method called', $request->all());

        try {
            $order = $this->createOrder(new Controle(), $request);
            $pdfName = $this->generatePdfName($order, "Controle-Interne");
            $this->savePdf($order, $pdfName, "inventaire");

            return response()->json([
                'success' => true,
                'message' => 'Controle created successfully',
                'order' => $order,
                'pdfName' => $pdfName,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in controle method', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function createOrder($model, Request $request)
    {
        Log::info('Received data:', $request->all());

        $validated = $request->validate([
            'name' => 'required|string',
            'restau' => 'nullable|string',  // Changed to nullable
            'products' => 'required|array',
            'products.*.product_id' => 'required|integer',
            'products.*.qty' => 'required|integer|min:1',
        ]);

        $detail = array_filter($validated['products'], function ($product) {
            return $product['qty'] > 0;
        });

        $order = new $model();
        $order->name = $validated['name'];
        $order->restau = $validated['restau'] ?? null;
        $order->detail = $detail;
        $order->save();

        return $order;
    }

    private function generatePdfName($order, $prefix)
    {
        return $this->generatePdfFileName($prefix, $order);
    }

    private function savePdf($order, $pdfName, $directory)
    {
        $pdfUrl = $this->generatePdfAndSave("pdf.inventaire-summary", ["order" => $order], $pdfName, $directory);
        $order->pdf = $pdfName;
        $order->save();
    }
}