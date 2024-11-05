<?php

namespace App\Http\Controllers;

use App\Models\Boisson;
use Inertia\Inertia;

class BoissonController extends BaseOrderController
{
    public function index()
    {
        $boissons = Boisson::orderBy('created_at', 'desc')->get();
        return Inertia::render('Boisson', ['boissons' => $boissons]);
    }
    protected function getModelClass()
    {
        return Boisson::class;
    }

    protected function getPdfPrefix()
    {
        return "Commande-Boisson";
    }

    protected function getPdfDirectory()
    {
        return "boisson";
    }
}
