<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RestaurantController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::all();
        return Inertia::render('Restaurants/Restaurants', ["restaurants" => $restaurants]);
    }

    public function show(Request $request)
    {
        $restau = $request->query('restau');
        $restaurant = Restaurant::where("name", $restau)->firstOrFail();
        $products = Product::all();
        return Inertia::render('Restaurants/Restaurant', [
            "restaurant" => $restaurant,
            "products" => $products
        ]);
    }

    public function toggleVisibility($id)
    {
        $restaurant = Restaurant::findOrFail($id);
        $restaurant->visible = $restaurant->visible == 1 ? 0 : 1;
        $restaurant->save();
        
        return back()->with('success', 'Visibility updated successfully.');
    }
}