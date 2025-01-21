<?php

namespace App\Http\Controllers;

use App\Models\CostPizza;
use App\Models\Fiche;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CostPizzaController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::all(['id', 'name', 'slug']);

        return Inertia::render('FluxReel/CostPizza/CostPizzaRestau', [
            'restaurants' => $restaurants
        ]);
    }

    public function show(Request $request, $restaurantSlug)
    {
        $restaurant = Restaurant::where('slug', $restaurantSlug)->firstOrFail();
        $currentMonth = $request->get('month', now()->month);
        $currentYear = $request->get('year', now()->year);

        $products = Fiche::find(5)->cuisinier_products;

        $costData = CostPizza::where('restaurant_id', $restaurant->id)
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->get()
            ->groupBy('product_id');

        $transformedProducts = $products->map(function ($product) use ($costData) {
            return [
                'id' => $product->id,
                'designation' => $product->designation,
                'unite' => $product->unite,
                'image' => $product->image,
                'values' => isset($costData[$product->id])
                    ? $costData[$product->id]->pluck('value', 'day')->toArray()
                    : []
            ];
        });

        return Inertia::render('FluxReel/CostPizza/CostPizza', [
            'restaurant' => $restaurant,
            'products' => $transformedProducts,
            'currentMonth' => [
                'month' => (int)$currentMonth,
                'year' => (int)$currentYear
            ]
        ]);
    }
    public function updateValue(Request $request)
    {
        $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'product_id' => 'required|exists:cuisinier_products,id',
            'day' => 'required|integer|min:1|max:31',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
            'value' => 'required|numeric|min:0'
        ]);

        CostPizza::updateOrCreate(
            [
                'restaurant_id' => $request->restaurant_id,
                'product_id' => $request->product_id,
                'day' => $request->day,
                'month' => $request->month,
                'year' => $request->year,
            ],
            ['value' => $request->value]
        );

        return redirect()->back()->with('success', 'Employee added successfully.');

    }
}
