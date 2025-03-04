<?php

namespace App\Http\Controllers;

use App\Models\CostRamadan;
use App\Models\Fiche;
use App\Traits\CostControllerTrait;
use Illuminate\Http\Request;

class CostRamadanController extends Controller
{
    use CostControllerTrait;

    protected $model = CostRamadan::class;
    protected $viewPrefix = 'CostRamadan';

    protected function getProducts()
    {
        $includedProductIds = [313, 314, 461, 466, 320, 462, 463, 464, 465, 467, 352, 468];

        // Get specific products from Fiche 6
        $fiche6Products = Fiche::find(6)->cuisinier_products()
            ->whereIn('cuisinier_products.id', $includedProductIds)
            ->get();

        // Get all products from Fiche 35
        $fiche35Products = Fiche::find(35)->cuisinier_products()->get();

        // Combine the collections
        return $fiche6Products->merge($fiche35Products);
    }
}
