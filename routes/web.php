<?php

use App\Http\Controllers\ClotureCaisseController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RubriqueController;
use App\Http\Controllers\CommandeCuisinierController;
use App\Http\Controllers\LaboController;
use App\Http\Controllers\InventaireCuisinierController;
use App\Http\Controllers\NumberController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\LivraisonController;
use App\Http\Controllers\BLController;
use App\Http\Controllers\CoastConsomableController;
use App\Http\Controllers\CoastCuisineController;
use App\Http\Controllers\CoastEconomatController;
use App\Http\Controllers\CoastPizzaController;
use App\Http\Controllers\FicheControleController;
use App\Http\Controllers\ProduitNonConformeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'time.auth'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/livraisons', [LivraisonController::class, 'index'])->name('livraison.index');

    Route::prefix('rubrique')->group(function () {
        Route::get('/{rubriqueTitle}', [RubriqueController::class, 'show'])->name('rubrique.show');
    });

    Route::prefix('commande-cuisinier')->middleware(['rest.validation'])->group(function () {
        Route::get('/', [CommandeCuisinierController::class, 'index'])->name('commande-cuisinier.index');
        Route::get('/commander', [CommandeCuisinierController::class, 'create'])->name('commande-cuisinier.create');
        Route::post('/commander', [CommandeCuisinierController::class, 'store'])->name('commande-cuisinier.store');
        Route::post('/labo', [LaboController::class, 'store'])->name('labo.store');
    });


    Route::prefix('inventaire')->group(function () {
        Route::get('/', [InventaireCuisinierController::class, 'index'])->name('inventaire.index');
        Route::get('/stock', [InventaireCuisinierController::class, 'stock'])->name('inventaire.stock');
        Route::post('/economat', [InventaireCuisinierController::class, 'economat'])->name('inventaire.economat');
        Route::post('/restaurant', [InventaireCuisinierController::class, 'restaurant'])->name('inventaire.restaurant');
        Route::post('/flash', [InventaireCuisinierController::class, 'flash'])->name('inventaire.flash');
        Route::post('/labo', [InventaireCuisinierController::class, 'labo'])->name('inventaire.labo');
    });

    Route::prefix('numeros')->group(function () {
        Route::get('/', [NumberController::class, 'index'])->name('numbers.index');
        Route::post('/', [NumberController::class, 'store'])->name('numbers.store');
    });


    Route::get('/restaurants-rubriques', [RestaurantController::class, 'index'])->name('restaurants.index');
    Route::get('/restaurants', [RestaurantController::class, 'menu'])->name('restaurants.menu');
    Route::get('/restaurant', [RestaurantController::class, 'show'])->name('restaurants.show');
    Route::post('/restaurant/{id}/toggle-visibility', [RestaurantController::class, 'toggleVisibility'])->name('restaurants.toggleVisibility');
    Route::post('/product/{id}/toggle-restaurant', [ProductController::class, 'toggleRestaurant'])->name('products.toggleRestaurant');

    Route::get('/employes', [EmployeController::class, 'index'])->name('employes.employe');

    Route::get('/ajouter-employe', [EmployeController::class, 'ajouteremploye'])->name('employes.ajouteremploye');
    Route::get('/add-employe', [EmployeController::class, 'employeAdd'])->name('employes.employeAdd');
    Route::post('/employees', [EmployeController::class, 'store'])->name('employes.store');

    Route::get('/modifier-employe', [EmployeController::class, 'modifieremploye'])->name('employes.modifieremploye');
    Route::get('/edit-employe', [EmployeController::class, 'employeEdit'])->name('employes.employeEdit');
    Route::get('//employe/{id}/edit', [EmployeController::class, 'employeUpdate'])->name('employes.employeUpdate');
    Route::put('/employes/{id}', [EmployeController::class, 'update'])->name('employes.update');

    Route::get('/attendance', [EmployeController::class, 'attendance'])->name('employes.attendance');
    Route::get('/manage-attendance', [EmployeController::class, 'manageAttendance'])->name('employes.manageAttendance');
    Route::post('/employes/update-attendance', [EmployeController::class, 'updateAttendance'])
    ->name('employes.updateAttendance');


    Route::prefix('BL')->group(function () {
        Route::post('/commander', [BLController::class, 'store'])->name('BL.store');
    });

    Route::prefix('produit-non-conforme')->group(function () {
        Route::get('/', [ProduitNonConformeController::class, 'index'])
            ->name('produit-non-conforme.index');
        Route::get('/form', [ProduitNonConformeController::class, 'showForm'])
            ->name('produit-non-conforme.form');
        Route::post('/form', [ProduitNonConformeController::class, 'store'])
            ->name('produit-non-conforme.store');
    });

    Route::prefix('fiche-controle')->middleware(['auth'])->group(function () {
        Route::get('/', [FicheControleController::class, 'index'])
            ->name('fiche-controle.index');
        Route::get('/form', [FicheControleController::class, 'showForm'])
            ->name('fiche-controle.form');
        Route::post('/form', [FicheControleController::class, 'store'])
            ->name('fiche-controle.store');
    });

    Route::controller(ClotureCaisseController::class)->group(function () {
        Route::get('/cloture-caisse', 'index');
        Route::get('/cloture-caisse/ajouter', 'create');
        Route::post('/cloture-caisse', 'store');
    });

    Route::get('/coast-cuisine', [CoastCuisineController::class, 'index'])
        ->name('coast-cuisine.index');

    // Show the form for a specific restaurant
    Route::get('/coast-cuisine/{restaurant:slug}', [CoastCuisineController::class, 'show'])
        ->name('coast-cuisine.show');

    // Update value endpoint
    Route::post('/coast-cuisine/update-value', [CoastCuisineController::class, 'updateValue'])
        ->name('coast-cuisine.update-value');

    Route::get('/coast-pizza', [CoastPizzaController::class, 'index'])
        ->name('coast-pizza.index');

    // Show the form for a specific restaurant
    Route::get('/coast-pizza/{restaurant:slug}', [CoastPizzaController::class, 'show'])
        ->name('coast-pizza.show');

    // Update value endpoint
    Route::post('/coast-pizza/update-value', [CoastPizzaController::class, 'updateValue'])
        ->name('coast-pizza.update-value');

    Route::get('/coast-economat', [CoastEconomatController::class, 'index'])
        ->name('coast-economat.index');

    // Show the form for a specific restaurant
    Route::get('/coast-economat/{restaurant:slug}', [CoastEconomatController::class, 'show'])
        ->name('coast-economat.show');

    // Update value endpoint
    Route::post('/coast-economat/update-value', [CoastEconomatController::class, 'updateValue'])
        ->name('coast-economat.update-value');

    Route::get('/coast-consomable', [CoastConsomableController::class, 'index'])
        ->name('coast-consomable.index');

    // Show the form for a specific restaurant
    Route::get('/coast-consomable/{restaurant:slug}', [CoastConsomableController::class, 'show'])
        ->name('coast-consomable.show');

    // Update value endpoint
    Route::post('/coast-consomable/update-value', [CoastConsomableController::class, 'updateValue'])
        ->name('coast-consomable.update-value');

});

require __DIR__ . '/auth.php';
