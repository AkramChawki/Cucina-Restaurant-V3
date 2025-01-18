<?php

namespace App\Http\Controllers;

use App\Models\Controle;
use App\Models\Inventaire;
use App\Models\InvLabo;
use App\Models\Restaurant;
use App\Models\Fiche;
use App\Models\CuisinierCategory;
use App\Models\Fromage;
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
                $query->where('name', 'like', '%Inventaire Interne%')
                    ->orWhereIn('id', [23, 24]);  // Added exception for fiche IDs 23 and 24
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

    public function economat(Request $request)
    {
        set_time_limit(500);

        try {
            $order = $this->createOrder(new Inventaire(), $request);
            $pdfName = $this->generatePdfName($order, "Inventaire-Economat");
            $this->savePdf($order, $pdfName, "inventaire");

            return redirect("/")->with('success', 'Order created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while processing your request.');
        }
    }

    public function restaurant(Request $request)
    {
        set_time_limit(500);

        try {
            $order = $this->createOrder(new Controle(), $request);
            $pdfName = $this->generatePdfName($order, "Inventaire-Restaurant");
            $this->savePdf($order, $pdfName, "inventaire");

            return redirect("/")->with('success', 'Order created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while processing your request.');
        }
    }
    public function flash(Request $request)
    {
        set_time_limit(500);

        try {
            $order = $this->createOrder(new Fromage(), $request);
            $pdfName = $this->generatePdfName($order, "Inventaire-Flash");
            $this->savePdf($order, $pdfName, "inventaire");

            return redirect("/")->with('success', 'Order created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while processing your request.');
        }
    }
    public function labo(Request $request)
    {
        set_time_limit(500);

        try {
            $order = $this->createOrder(new InvLabo(), $request);
            $pdfName = $this->generatePdfName($order, "Inventaire-Labo");
            $this->savePdf($order, $pdfName, "inventaire-labo");

            return redirect("/")->with('success', 'Order created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while processing your request.');
        }
    }

    private function createOrder($model, Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string',
            'restau' => 'nullable|string',
            'products' => 'required|array',
            'products.*.product_id' => 'required|integer',
            'products.*.qty' => 'required|numeric',
        ]);

        $detail = array_filter($validatedData['products'], function ($product) {
            return $product['qty'] >= 0;
        });

        $order = new $model();
        $order->name = $validatedData['name'];
        $order->restau = $validatedData['restau'] ?? null;
        $order->detail = $detail;
        $order->save();

        return $order;
    }

    private function generatePdfName($order, $prefix)
    {
        $restauPart = $order->restau ? "-{$order->restau}" : '';
        return "{$prefix}-{$order->name}{$restauPart}-{$order->created_at->format('d-m-Y')}-{$order->id}.pdf";
    }

    private function savePdf($order, $pdfName, $directory)
    {
        $pdfUrl = $this->generatePdfAndSave("pdf.inventaire-summary", ["order" => $order], $pdfName, $directory);
        $order->pdf = $pdfName;
        $order->save();
    }
}
