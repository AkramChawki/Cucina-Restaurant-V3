<?php

namespace App\Http\Controllers;

use App\Models\CuisinierOrder;
use App\Models\Restaurant;
use App\Models\Fiche;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommandeCuisinierController extends BaseOrderController
{
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
            $products = Fiche::find($ficheId)->cuisinier_products->groupBy('cuisinier_category_id');
            $categories = collect([]);
            foreach ($products as $categoryId => $products) {
                $category = \App\Models\CuisinierCategory::find($categoryId);
                $category->products = $products;
                $categories->push($category);
            }
            return Inertia::render('CommandeCuisinier/Commander', [
                "categories" => $categories,
                "ficheId" => $ficheId,
                "restau" => null,
            ]);
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
        $products = Fiche::find($ficheId)->cuisinier_products->groupBy('cuisinier_category_id');
        $categories = collect([]);
        foreach ($products as $categoryId => $products) {
            $category = \App\Models\CuisinierCategory::find($categoryId);
            $category->products = $products;
            $categories->push($category);
        }
        return Inertia::render('CommandeCuisinier/Commander', [
            "categories" => $categories,
            "ficheId" => $ficheId,
            "restau" => $restau,
        ]);
    }

    protected function getModelClass()
    {
        return CuisinierOrder::class;
    }

    protected function getPdfPrefix()
    {
        return "Commande";
    }

    protected function getPdfDirectory()
    {
        return "orders";
    }
}