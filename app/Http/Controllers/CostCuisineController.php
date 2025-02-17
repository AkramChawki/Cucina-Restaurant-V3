<?php

namespace App\Http\Controllers;

use App\Models\CostCuisine;
use App\Models\Fiche;
use App\Models\Restaurant;
use App\Traits\CostControllerTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CostCuisineController extends Controller
{
    use CostControllerTrait;

    protected $model = CostCuisine::class;
    protected $viewPrefix = 'CostCuisine';

    protected function getProducts()
    {
        return Fiche::find(1)->cuisinier_products;
    }
}