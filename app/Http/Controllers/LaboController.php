<?php

namespace App\Http\Controllers;

use App\Models\Labo;

class LaboController extends BaseOrderController
{
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

    public function index()
    {
        $labos = Labo::orderBy('created_at', 'desc')->get();
        return inertia('Labo', ['labos' => $labos]);
    }
}