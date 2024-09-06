<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function toggleRestaurant(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $restaurantName = $request->input('restaurant_name');
        $addRestaurant = $request->input('add_restaurant');

        if (is_array($product->restaurant)) {
            $currentRestaurants = $product->restaurant;
        } else {
            $currentRestaurants = json_decode($product->restaurant, true);
            if (!is_array($currentRestaurants)) {
                $currentRestaurants = [];
            }
        }

        if ($addRestaurant) {
            if (!in_array($restaurantName, $currentRestaurants)) {
                $currentRestaurants[] = $restaurantName;
            }
        } else {
            $currentRestaurants = array_values(array_diff($currentRestaurants, [$restaurantName]));
        }

        $product->restaurant = $currentRestaurants;
        $product->save();

        return back()->with('success', 'Product updated successfully.');
    }
}