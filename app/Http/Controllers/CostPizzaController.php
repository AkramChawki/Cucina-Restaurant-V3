<?php

namespace App\Http\Controllers;

use App\Models\CostPizza;
use App\Models\Fiche;
use App\Models\Restaurant;
use App\Traits\CostControllerTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CostPizzaController extends Controller
{
    use CostControllerTrait;

    protected $model = CostPizza::class;
    protected $viewPrefix = 'CostPizza';

    protected function getProducts()
    {
        return Fiche::find(5)->cuisinier_products;
    }
}
