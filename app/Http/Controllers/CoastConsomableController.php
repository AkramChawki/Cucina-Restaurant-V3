<?php

namespace App\Http\Controllers;

use App\Models\CoastConsomable;
use App\Models\Fiche;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CoastConsomableController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::all(['id', 'name', 'slug']);

        return Inertia::render('FluxReel/CoastConsomable/CoastConsomableRestau', [
            'restaurants' => $restaurants
        ]);
    }

    public function show(Request $request, $restaurantSlug)
    {
        $restaurant = Restaurant::where('slug', $restaurantSlug)->firstOrFail();
        $currentMonth = $request->get('month', now()->month);
        $currentYear = $request->get('year', now()->year);

        // Get products from fiche_id = 1
        $includedProductIds = [204,352,281,206,280,207,353,211,210,212,213,289,290,291,357,358,374,408,434,433,453,442,201,202,335,241,242,431,438,243,25,14,16,19,20,26,24,18,17,15,401,163,167]; // Add the IDs you want to exclude

        $products = Fiche::find(6)->cuisinier_products()
            ->whereIn('cuisinier_products.id', $includedProductIds)
            ->get();

        // Get existing coast cuisine data
        $coastData = CoastConsomable::where('restaurant_id', $restaurant->id)
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

        return Inertia::render('FluxReel/CoastConsomable/CoastConsomable', [
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

        CoastConsomable::updateOrCreate(
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
