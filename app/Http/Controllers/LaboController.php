<?php

namespace App\Http\Controllers;

use App\Models\Labo;
use Inertia\Inertia;

class LaboController extends BaseOrderController
{

    public function index()
    {
        $labos = Labo::orderBy('created_at', 'desc')->get();
        return Inertia::render('Labo', ['labos' => $labos]);
    }
    protected function getModelClass()
    {
        return Labo::class;
    }

    protected function getPdfPrefix()
    {
        return "Commande-Labo";
    }

    protected function getPdfDirectory()
    {
        return "labo";
    }
}