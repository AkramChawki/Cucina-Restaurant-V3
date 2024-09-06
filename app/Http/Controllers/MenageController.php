<?php

namespace App\Http\Controllers;

use App\Models\Menage;
use Inertia\Inertia;

class MenageController extends BaseOrderController
{

    public function index()
    {
        $menages = Menage::orderBy('created_at', 'desc')->get();
        return Inertia::render('Menage', ['menages' => $menages]);
    }
    protected function getModelClass()
    {
        return Menage::class;
    }

    protected function getPdfPrefix()
    {
        return "Commande-Menage";
    }

    protected function getPdfDirectory()
    {
        return "menage";
    }
}