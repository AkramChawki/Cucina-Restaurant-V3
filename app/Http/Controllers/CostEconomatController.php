<?php

namespace App\Http\Controllers;

use App\Models\CostEconomat;
use App\Models\Fiche;
use App\Models\Restaurant;
use App\Traits\CostControllerTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CostEconomatController extends Controller
{
    use CostControllerTrait;

    protected $model = CostEconomat::class;
    protected $viewPrefix = 'CostEconomat';

    protected function getProducts()
    {
        $excludedProductIds = [204,352,281,206,280,207,353,211,210,212,213,289,290,291,357,358,374,408,434,433,453,442,201,202,335,241,242,431,438,243,25,14,16,19,20,26,24,18,17,15,401,163,167];
        
        return Fiche::find(6)->cuisinier_products()
            ->whereNotIn('cuisinier_products.id', $excludedProductIds)
            ->get();
    }
}
