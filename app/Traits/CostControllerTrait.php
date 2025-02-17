<?php

namespace App\Traits;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

trait CostControllerTrait
{
    public function index()
    {
        $restaurants = Restaurant::all(['id', 'name', 'slug']);

        return Inertia::render($this->getViewPath('Restau'), [
            'restaurants' => $restaurants
        ]);
    }

    public function show(Request $request, $restaurantSlug)
    {
        $restaurant = Restaurant::where('slug', $restaurantSlug)->firstOrFail();
        $currentMonth = $request->get('month', now()->month);
        $currentYear = $request->get('year', now()->year);

        $products = $this->getProducts();
        
        $costData = $this->model::getMonthlyData($restaurant->id, $currentMonth, $currentYear);

        $transformedProducts = $products->map(function ($product) use ($costData) {
            return [
                'id' => $product->id,
                'designation' => $product->designation,
                'unite' => $product->unite,
                'image' => $product->image,
                'values' => $costData[$product->id] ?? []
            ];
        });

        return Inertia::render($this->getViewPath('Index'), [
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
            'period' => 'required|in:morning,afternoon',
            'value' => 'required|numeric|min:0'
        ]);

        $costEntry = $this->model::firstOrCreate(
            [
                'restaurant_id' => $request->restaurant_id,
                'product_id' => $request->product_id,
                'month' => $request->month,
                'year' => $request->year,
            ],
            ['daily_data' => []]
        );

        $dailyData = $costEntry->daily_data ?: [];
        
        if (!isset($dailyData[$request->day])) {
            $dailyData[$request->day] = [
                'morning' => 0,
                'afternoon' => 0
            ];
        }
        $dailyData[$request->day][$request->period] = (float)$request->value;

        $costEntry->update(['daily_data' => $dailyData]);

        return redirect()->back();
    }

    private function getViewPath($suffix)
    {
        return "FluxReel/{$this->viewPrefix}/{$this->viewPrefix}{$suffix}";
    }
}