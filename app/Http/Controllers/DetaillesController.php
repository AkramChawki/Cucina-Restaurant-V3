<?php

namespace App\Http\Controllers;

use App\Models\Labo;
use App\Models\Livraison;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DetaillesController extends Controller
{
    public function index(Request $request)
    {
        $labos = Labo::orderBy('created_at', 'desc')->get();
        $livraisons = Livraison::orderBy('created_at', 'desc')
            ->get()
            ->map(function ($livraison) {
                // Add a display name that combines type and restaurant group
                $livraison->display_name = $livraison->type . 
                    ($livraison->restaurant_group === 'Ziraoui' ? ' (Ziraoui)' : '');
                return $livraison;
            });

        return Inertia::render('Detaills', [
            'labos' => $labos,
            'livraisons' => $livraisons,
        ]);
    }
}