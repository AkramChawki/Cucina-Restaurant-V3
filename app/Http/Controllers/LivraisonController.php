<?php

namespace App\Http\Controllers;

use App\Models\Livraison;
use Inertia\Inertia;

class LivraisonController extends Controller
{
    public function index()
    {
        $livraisons = Livraison::orderBy('created_at', 'desc')->get();
        return Inertia::render('Livraison', ['livraisons' => $livraisons]);
    }
}