<?php

use App\Http\Controllers\EmployeController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RubriqueController;
use App\Http\Controllers\CommandeCuisinierController;
use App\Http\Controllers\LaboController;
use App\Http\Controllers\MenageController;
use App\Http\Controllers\InventaireCuisinierController;
use App\Http\Controllers\NumberController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\LivraisonController;
use App\Http\Controllers\BLController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\BoissonController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'time.auth'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/detailles', [HomeController::class, 'detailles'])->name('detailles');
    Route::get('/livraisons', [LivraisonController::class, 'index'])->name('livraison.index');
    Route::get('/labo', [LaboController::class, 'index'])->name('labo.index');
    Route::get('/menage', [MenageController::class, 'index'])->name('menage.index');
    Route::get('/boisson', [BoissonController::class, 'index'])->name('boisson.index');

    Route::prefix('rubrique')->group(function () {
        Route::get('/{rubriqueTitle}', [RubriqueController::class, 'show'])->name('rubrique.show');
    });

    Route::prefix('commande-cuisinier')->middleware(['rest.validation'])->group(function () {
        Route::get('/', [CommandeCuisinierController::class, 'index'])->name('commande-cuisinier.index');
        Route::get('/commander', [CommandeCuisinierController::class, 'create'])->name('commande-cuisinier.create');
        Route::post('/commander', [CommandeCuisinierController::class, 'store'])->name('commande-cuisinier.store');
        Route::post('/labo', [LaboController::class, 'store'])->name('labo.store');
        Route::post('/menage', [MenageController::class, 'store'])->name('menage.store');
        Route::post('/boisson', [BoissonController::class, 'store'])->name('boisson.store');
    });


    Route::prefix('inventaire')->group(function () {
        Route::get('/', [InventaireCuisinierController::class, 'index'])->name('inventaire.index');
        Route::get('/stock', [InventaireCuisinierController::class, 'stock'])->name('inventaire.stock');
        Route::post('/inv', [InventaireCuisinierController::class, 'inventaire'])->name('inventaire.inv');
        Route::post('/cntrl', [InventaireCuisinierController::class, 'controle'])->name('inventaire.cntrl');
        Route::post('/fromage', [InventaireCuisinierController::class, 'fromage'])->name('inventaire.fromage');
    });

    Route::resource('numbers', NumberController::class);


    Route::get('/restaurants-rubriques', [RestaurantController::class, 'index'])->name('restaurants.index');
    Route::get('/restaurants', [RestaurantController::class, 'menu'])->name('restaurants.menu');
    Route::get('/restaurant', [RestaurantController::class, 'show'])->name('restaurants.show');
    Route::post('/restaurant/{id}/toggle-visibility', [RestaurantController::class, 'toggleVisibility'])->name('restaurants.toggleVisibility');
    Route::post('/product/{id}/toggle-restaurant', [ProductController::class, 'toggleRestaurant'])->name('products.toggleRestaurant');

    Route::get('/livraisons', [LivraisonController::class, 'index'])->name('livraisons.index');

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

    Route::prefix('audit')->group(callback: function () {
        Route::get('/', [AuditController::class, 'index'])->name('audit.index');
        Route::get('/form', [AuditController::class, 'showForm'])->name('audit.form');
        Route::post('/form', [AuditController::class, 'store'])->name('audit.store');
    });

    Route::get('/labo', [LaboController::class, 'index'])->name('labo.index');
    Route::get('/menage', [MenageController::class, 'index'])->name('menage.index');
});

require __DIR__ . '/auth.php';
