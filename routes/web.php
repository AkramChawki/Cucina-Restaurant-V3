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
use App\Http\Controllers\BMLController;
use App\Http\Controllers\CostAnalyticsController;
use App\Http\Controllers\CostConsomableController;
use App\Http\Controllers\CostCuisineController;
use App\Http\Controllers\CostEconomatController;
use App\Http\Controllers\CostPizzaController;
use App\Http\Controllers\CostRamadanController;
use App\Http\Controllers\FicheControleController;
use App\Http\Controllers\InfractionController;
use App\Http\Controllers\ProduitNonConformeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'time.auth', 'password.change'])->group(function () {
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
        Route::post('/download-prestataire-pdf', [FicheControleController::class, 'downloadPrestatairePdf']);
    });

    Route::controller(ClotureCaisseController::class)->group(function () {
        Route::get('/cloture-caisse', 'index');
        Route::get('/cloture-caisse/ajouter', 'create');
        Route::post('/cloture-caisse', 'store');
    });

    Route::get('/flux-reel', [HomeController::class, 'FluxReel'])->name('FluxReel');

    Route::get('/cost-cuisine', [CostCuisineController::class, 'index'])
        ->name('cost-cuisine.index');

    // Show the form for a specific restaurant
    Route::get('/cost-cuisine/{restaurant:slug}', [CostCuisineController::class, 'show'])
        ->name('cost-cuisine.show');

    // Update value endpoint
    Route::post('/cost-cuisine/update-value', [CostCuisineController::class, 'updateValue'])
        ->name('cost-cuisine.update-value');

    Route::get('/cost-pizza', [CostPizzaController::class, 'index'])
        ->name('cost-pizza.index');

    // Show the form for a specific restaurant
    Route::get('/cost-pizza/{restaurant:slug}', [CostPizzaController::class, 'show'])
        ->name('cost-pizza.show');

    // Update value endpoint
    Route::post('/cost-pizza/update-value', [CostPizzaController::class, 'updateValue'])
        ->name('cost-pizza.update-value');

    Route::get('/cost-economat', [CostEconomatController::class, 'index'])
        ->name('cost-economat.index');

    // Show the form for a specific restaurant
    Route::get('/cost-economat/{restaurant:slug}', [CostEconomatController::class, 'show'])
        ->name('cost-economat.show');

    // Update value endpoint
    Route::post('/cost-economat/update-value', [CostEconomatController::class, 'updateValue'])
        ->name('cost-economat.update-value');

    Route::get('/cost-consomable', [CostConsomableController::class, 'index'])
        ->name('cost-consomable.index');

    // Show the form for a specific restaurant
    Route::get('/cost-consomable/{restaurant:slug}', [CostConsomableController::class, 'show'])
        ->name('cost-consomable.show');

    // Update value endpoint
    Route::post('/cost-consomable/update-value', [CostConsomableController::class, 'updateValue'])
        ->name('cost-consomable.update-value');

        Route::get('/bml', [BMLController::class, 'index'])
        ->name('bml.index');
    
    // Show the form for a specific restaurant
    Route::get('/bml/{restaurant:slug}', [BMLController::class, 'show'])
        ->name('bml.show');
    
    // Store multiple entries - this should have a different URL path
    Route::post('/bml/store', [BMLController::class, 'store'])
        ->name('bml.store');
    
    // Update or create a single entry
    Route::post('/bml/update-value', [BMLController::class, 'updateValue'])
        ->name('bml.update-value');
    
    // Delete an entry
    Route::post('/bml/delete', [BMLController::class, 'delete'])
        ->name('bml.delete');

    Route::get('/infraction', [InfractionController::class, 'index']);

    // Update value endpoint
    Route::post('/infraction/store', [InfractionController::class, 'store'])
        ->name('infractions.store');

    Route::get('/infractions/report', [InfractionController::class, 'report'])
        ->name('infractions.report');

    Route::get('/cost-analytics', [CostAnalyticsController::class, 'index'])->name('cost-analytics.index');
    Route::post('/cost-analytics/generate-daily', [CostAnalyticsController::class, 'generateDaily'])->name('cost-analytics.generate-daily');

    Route::get('/cost-ramadan', [CostRamadanController::class, 'index'])
        ->name('cost-ramadan.index');

    // Show the form for a specific restaurant
    Route::get('/cost-ramadan/{restaurant:slug}', [CostRamadanController::class, 'show'])
        ->name('cost-ramadan.show');

    // Update value endpoint
    Route::post('/cost-ramadan/update-value', [CostRamadanController::class, 'updateValue'])
        ->name('cost-ramadan.update-value');
});

require __DIR__ . '/auth.php';
