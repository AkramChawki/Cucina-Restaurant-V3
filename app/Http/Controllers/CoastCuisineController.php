<?php

namespace App\Http\Controllers;

use App\Models\CoastCuisine;
use App\Models\CuisinierCategory;
use App\Models\Restaurant;
use App\Models\CuisinierProduct;
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

        // Get products for fiche_id = 1 and group them by category
        $products = CuisinierProduct::whereHas('fiches', function($query) {
            $query->where('fiche_id', 1);
        })->with('cuisinier_category')->get();

        // Group products by category
        $groupedProducts = $products->groupBy('category_id');
        
        // Get existing coast cuisine data
        $coastData = CoastCuisine::where('restaurant_id', $restaurant->id)
            ->where('month', $currentMonth)
            ->where('year', $currentYear)
            ->get()
            ->groupBy('product_id');

        // Prepare categories with their products
        $categories = collect();
        foreach($groupedProducts as $categoryId => $categoryProducts) {
            $category = CuisinierCategory::find($categoryId);
            if ($category) {
                // Transform products to include their values
                $transformedProducts = $categoryProducts->map(function($product) use ($coastData) {
                    $values = [];
                    if (isset($coastData[$product->id])) {
                        foreach($coastData[$product->id] as $data) {
                            $values[$data->day] = $data->value;
                        }
                    }
                    return [
                        'id' => $product->id,
                        'designation' => $product->designation,
                        'unite' => $product->unite,
                        'values' => $values,
                        'image' => $product->image
                    ];
                });
                
                $category->products = $transformedProducts;
                $categories->push($category);
            }
        }

        return Inertia::render('FluxReel/CoastCuisine/CoastCuisineRestau', [
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