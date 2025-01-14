<?php

namespace App\Http\Controllers;

use App\Models\CoastCuisine;
use App\Models\CuisinierCategory;
use App\Models\Restaurant;
use App\Models\CuisinierProduct;
use App\Models\Fiche;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CoastCuisineController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::all(['id', 'name', 'slug']);

        return Inertia::render('FluxReel/CoastCuisine/CoastCuisineRestau', [
            'restaurants' => $restaurants
        ]);
    }

    public function show(Request $request, $restaurantSlug)
    {
        $restaurant = Restaurant::where('slug', $restaurantSlug)->firstOrFail();
        $currentMonth = $request->get('month', now()->month);
        $currentYear = $request->get('year', now()->year);

        // Get products from fiche_id = 1
        $products = Fiche::find(1)->cuisinier_products;

        // Get existing coast cuisine data
        $coastData = CoastCuisine::where('restaurant_id', $restaurant->id)
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->get()
            ->groupBy('product_id');

        // Transform products to include their values
        $transformedProducts = $products->map(function ($product) use ($coastData) {
            return [
                'id' => $product->id,
                'designation' => $product->designation,
                'unite' => $product->unite,
                'image' => $product->image,
                'values' => isset($coastData[$product->id])
                    ? $coastData[$product->id]->pluck('value', 'day')->toArray()
                    : []
            ];
        });

        return Inertia::render('FluxReel/CoastCuisine/CoastCuisine', [
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

        CoastCuisine::updateOrCreate(
            [
                'restaurant_id' => $request->restaurant_id,
                'product_id' => $request->product_id,
                'day' => $request->day,
                'month' => $request->month,
                'year' => $request->year,
            ],
            ['value' => $request->value]
        );

        return response()->json(['status' => 'success']);
    }
}
