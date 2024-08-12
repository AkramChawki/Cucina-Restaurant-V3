<?php

use App\Models\CuisinierCategory;
use App\Models\Fiche;
use App\Models\Livraison;
use App\Models\Number;
use App\Models\Product;
use App\Models\Restaurant;
use App\Models\Rubrique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::middleware(['auth', 'time.auth'])->group(function () {

    Route::get('/', function () {
        $rubriques = Rubrique::all();
        return Inertia::render('Home', ["rubriques" => $rubriques]);
    });

    Route::get('/rubrique/{rubriqueTitle}', function ($rubriqueTitle) {
        $rubrique = Rubrique::where('title', $rubriqueTitle)->first();
        $fiches = $rubrique->fiches;
        return Inertia::render('Rubrique', ["fiches" => $fiches]);
    });

    Route::get('/commande-cuisinier', function () {
        $restaurants = Restaurant::all();
        $ficheId = request("ficheId");
        $exception = Fiche::with('rubrique')
            ->where('id', $ficheId)
            ->where(function ($query) {
                $query->where('name', 'like', '%labo%')
                    ->orWhere('name', 'like', '%magasin%');
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
            return Inertia::render('CommandeCuisinier/Commander', [
                "categories" => $categories,
                "ficheId" => $ficheId,
                "restau" => null,
            ]);
        } else {
            return Inertia::render('CommandeCuisinier/CommandeCuisinier', [
                "ficheId" => request("ficheId"),
                "restaurants" => $restaurants
            ]);
        }
    });

    Route::get('/commande-cuisinier/commander', function () {
        $ficheId = request("ficheId");
        $restau = request("restau");
        $products = Fiche::find($ficheId)->cuisinier_products->groupBy('cuisinier_category_id');
        $categories = collect([]);
        foreach ($products as $categoryId => $products) {
            $category = CuisinierCategory::find($categoryId);
            $category->products = $products;
            $categories->push($category);
        }
        return Inertia::render('CommandeCuisinier/Commander', [
            "categories" => $categories,
            "ficheId" => $ficheId,
            "restau" => $restau,
        ]);
    });

    Route::post('/commande-cuisinier/commander', [App\Http\Controllers\CommandeCuisinierController::class, 'store']);

    Route::get('/inventaire', function () {
        $restaurants = Restaurant::all();
        $ficheId = request("ficheId");
        $exception = Fiche::with('rubrique')
            ->where('id', $ficheId)
            ->where(function ($query) {
                $query->where('name', 'like', '%labo%')
                    ->orWhere('name', 'like', '%magasin%');
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
    });

    Route::get('/inventaire/stock', function () {
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
    });

    Route::post('/inventaire/stock', [App\Http\Controllers\InventaireCuisinierController::class, 'store']);

    Route::get('/numeros', function () {
        return Inertia::render('Numeros/Numeros');
    });

    Route::get('/numeros/ajouter', function () {
        return Inertia::render('Numeros/Ajouter');
    });

    Route::post('/numeros', function (Request $request) {
        foreach ($request->numbers as $number) {
            Number::create([
                "number" => $number
            ]);
        }
        return redirect("/");
    });

    Route::get('/restaurants', function () {
        $restaurants = Restaurant::all();
        return Inertia::render('Restaurants/Restaurants', ["restaurants" => $restaurants]);
    });

    Route::get('/restaurant', function () {
        $restau = request("restau");
        $restaurant = Restaurant::where("name", "like", "%$restau%")->firstOrFail();
        $products = Product::all();
        return Inertia::render('Restaurants/Restaurant', ["restaurant" => $restaurant, "products" => $products]);
    });

    Route::post('/restaurant/{id}/toggle-visibility', function (Request $request, $id) {
        $restaurant = Restaurant::findOrFail($id);
        $restaurant->visible = $restaurant->visible == 1 ? 0 : 1;
        $restaurant->save();
        return back()->with('success', 'Visibility updated successfully.');
    })->name('restaurant.toggleVisibility');

    Route::post('/product/{id}/toggle-restaurant', function (Request $request, $id) {
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
    })->name('product.toggleRestaurant');

    Route::get('/livraisons', function () {
        $livraisons = Livraison::all();
        return Inertia::render('Livraison', ["livraisons" => $livraisons]);
    });
});

require __DIR__ . '/auth.php';
