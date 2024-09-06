<?php

namespace App\Http\Controllers;

use App\Models\DK;
use App\Models\Labo;
use App\Models\Livraison;
use App\Models\Menage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DetaillesController extends Controller
{
    public function index(Request $request)
    {
        $dks = DK::orderBy('created_at', 'desc')->get();
        $labos = Labo::orderBy('created_at', 'desc')->get();
        $livraisons = Livraison::orderBy('created_at', 'desc')->get();
        $menages = Menage::orderBy('created_at', 'desc')->get();

        return Inertia::render('Detaills', [
            'dks' => $dks,
            'labos' => $labos,
            'livraisons' => $livraisons,
            'menages' => $menages,
        ]);
    }
}