<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\RubriqueController;
use App\Http\Controllers\CommandeCuisinierController;
use App\Http\Controllers\LaboController;
use App\Http\Controllers\DKController;
use App\Http\Controllers\MenageController;
use App\Http\Controllers\InventaireCuisinierController;
use App\Http\Controllers\NumberController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\LivraisonController;
use App\Http\Controllers\BLController;
use App\Http\Controllers\AuditController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'time.auth'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/detailles', [HomeController::class, 'detailles'])->name('detailles');
    Route::get('/napoli-gang', [DKController::class, 'index'])->name('dk.index');
    Route::get('/labo', [LaboController::class, 'index'])->name('labo.index');
    Route::get('/livraisons', [LivraisonController::class, 'index'])->name('livraison.index');
    Route::get('/menage', [MenageController::class, 'index'])->name('menage.index');

    Route::prefix('rubrique')->group(function () {
        Route::get('/{rubriqueTitle}', [RubriqueController::class, 'show'])->name('rubrique.show');
    });

    Route::prefix('commande-cuisinier')->group(function () {
        Route::get('/', [CommandeCuisinierController::class, 'index'])->name('commande-cuisinier.index');
        Route::get('/commander', [CommandeCuisinierController::class, 'create'])->name('commande-cuisinier.create');
        Route::post('/commander', [CommandeCuisinierController::class, 'store'])->name('commande-cuisinier.store');
    });

    Route::post('/commande-cuisinier/labo', [LaboController::class, 'store'])->name('labo.store');
    Route::post('/commande-cuisinier/dk', [DKController::class, 'store'])->name('dk.store');
    Route::post('/commande-cuisinier/menage', [MenageController::class, 'store'])->name('menage.store');

    Route::prefix('inventaire')->group(function () {
        Route::get('/', [InventaireCuisinierController::class, 'index'])->name('inventaire.index');
        Route::get('/stock', [InventaireCuisinierController::class, 'stock'])->name('inventaire.stock');
        Route::post('/inv', [InventaireCuisinierController::class, 'inventaire'])->name('inventaire.inv');
        Route::post('/cntrl', [InventaireCuisinierController::class, 'controle'])->name('inventaire.cntrl');
    });

    Route::resource('numbers', NumberController::class);


    Route::get('/restaurants', [RestaurantController::class, 'index'])->name('restaurants.index');
    Route::get('/restaurant', [RestaurantController::class, 'show'])->name('restaurants.show');
    Route::post('/restaurant/{id}/toggle-visibility', [RestaurantController::class, 'toggleVisibility'])->name('restaurants.toggleVisibility');
    Route::post('/product/{id}/toggle-restaurant', [ProductController::class, 'toggleRestaurant'])->name('products.toggleRestaurant');

    Route::get('/livraisons', [LivraisonController::class, 'index'])->name('livraisons.index');


    Route::prefix('BL')->group(function () {
        Route::get('/', [BLController::class, 'index'])->name('BL.index');
        Route::get('/commander', [BLController::class, 'create'])->name('BL.create');
        Route::post('/commander', [BLController::class, 'store'])->name('BL.store');
    });

    Route::prefix('audit')->group(function () {
        Route::get('/', [AuditController::class, 'index'])->name('audit.index');
        Route::get('/form', [AuditController::class, 'showForm'])->name('audit.form');
        Route::post('/form', [AuditController::class, 'store'])->name('audit.store');
    });

    Route::get('/labo', [LaboController::class, 'index'])->name('labo.index');
    Route::get('/napoli-gang', [DKController::class, 'index'])->name('dk.index');
    Route::get('/menage', [MenageController::class, 'index'])->name('menage.index');
});

require __DIR__ . '/auth.php';
