<?php

use App\Models\CuisinierCategory;
use App\Models\CuisinierOrder;
use App\Models\CuisinierProduct;
use App\Models\Fiche;
use App\Models\Livraison;
use App\Models\Number;
use App\Models\Product;
use App\Models\Restaurant;
use App\Models\Rubrique;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Carbon\Carbon;

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

$validTypes = ["MALAK", "SALAH", "HIBA", "SABAH", "NAJIB"];
$summaryData = [];

Route::middleware('auth')->group(function () {
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
            // Add restaurant if not already in the list
            if (!in_array($restaurantName, $currentRestaurants)) {
                $currentRestaurants[] = $restaurantName;
            }
        } else {
            // Remove restaurant if it exists in the list
            $currentRestaurants = array_values(array_diff($currentRestaurants, [$restaurantName]));
        }

        // Assign the array directly
        $product->restaurant = $currentRestaurants;
        $product->save();

        return back()->with('success', 'Product updated successfully.');
    })->name('product.toggleRestaurant');
});

Route::get('/livraisons/aggregate', function () use ($validTypes, &$summaryData) {
    $startDate = Carbon::yesterday('Europe/Paris')->setTime(4, 0, 0);
    $endDate = Carbon::today('Europe/Paris')->setTime(4, 0, 0);

    $orders = CuisinierOrder::whereBetween('created_at', [$startDate, $endDate])->get();

    $aggregatedData = array_fill_keys($validTypes, []);

    foreach ($orders as $order) {
        $restau = $order->restau;

        if (is_null($restau)) {
            continue;
        }

        foreach ($order->detail as $item) {
            $productId = $item['product_id'];
            $qty = (int)$item['qty'];

            $product = CuisinierProduct::find($productId);

            if ($product && in_array($product->type, $validTypes)) {
                $type = $product->type;

                if (!isset($aggregatedData[$type][$restau][$productId])) {
                    $aggregatedData[$type][$restau][$productId] = [
                        'designation' => $product->designation,
                        'qty' => 0,
                        'image' => $product->image,
                        'unite' => $product->unite
                    ];
                }

                $aggregatedData[$type][$restau][$productId]['qty'] += $qty;
            }
        }
    }

    foreach ($aggregatedData as $type => $restaus) {
        if (!empty($restaus)) {
            $formattedData = [];
            foreach ($restaus as $restau => $products) {
                $restauProducts = [];
                foreach ($products as $productId => $data) {
                    $restauProducts[] = [
                        'product_id' => $productId,
                        'designation' => $data['designation'] ?? 'Unknown Product',
                        'qty' => (string)$data['qty'],
                        'image' => $data['image'] ?? null,
                        'unite' => $data['unite'] ?? null
                    ];
                }
                $formattedData[] = [
                    'restau' => $restau,
                    'products' => $restauProducts
                ];
            }

            if (!in_array($type, $validTypes)) {
                return response()->json(['error' => "Invalid type: $type. Skipping this entry."], 400);
            }

            $pdfUrl = generatePdfForType($type, $formattedData);

            try {
                $livraison = Livraison::create([
                    'date' => $startDate->toDateString(),
                    'type' => $type,
                    'data' => $formattedData,
                    'pdf_url' => $pdfUrl
                ]);

                $summaryData[] = [
                    'type' => $type,
                    'pdf_url' => $pdfUrl,
                    'data' => $formattedData
                ];

                return response()->json(['message' => "Livraison data for Type $type aggregated and stored successfully for " . $startDate->toDateString()]);
            } catch (\Exception $e) {
                return response()->json(['error' => "Failed to create Livraison for Type $type: " . $e->getMessage()], 500);
            }
        }
    }

    // $this->sendSummaryEmail();
});

function generatePdfForType($type, $data)
{
    $view = 'pdfs.livraison-type';
    $fileName = 'livraison_type_' . $type . '_' . now()->format('Y-m-d') . '.pdf';
    $directory = 'livraisons';

    return generate_pdf_and_save($view, ['type' => $type, 'data' => $data], $fileName, $directory);
}

function generate_pdf_and_save($view, $data, $file_name, $directory)
{
    $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
    $pdf->binary = base_path('vendor/h4cc/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');
    if (!$pdf->saveAs(public_path("storage/$directory/$file_name"))) {
        $error = $pdf->getError();
        return response()->json(['error' => "PDF generation failed: $error"], 500);
    }
    return asset("storage/$directory/$file_name");
}

require __DIR__ . '/auth.php';
