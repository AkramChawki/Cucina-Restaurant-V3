<?php

namespace App\Http\Controllers;

use App\Models\Labo;
use Illuminate\Support\Facades\Log;

class LaboController extends BaseOrderController
{
    protected function getModelClass()
    {
        Log::info('getModelClass called in LaboController');
        return Labo::class;
    }

    protected function getPdfPrefix()
    {
        Log::info('getPdfPrefix called in LaboController');
        return "Commande-Labo";
    }

    protected function getPdfDirectory()
    {
        Log::info('getPdfDirectory called in LaboController');
        return "labo";
    }

    public function index()
    {
        $labos = Labo::orderBy('created_at', 'desc')->get();
        return inertia('Labo', ['labos' => $labos]);
    }
}