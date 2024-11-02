<?php

namespace App\Http\Controllers;

use App\Models\Boisson;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BoissonController extends Controller
{
    public function index()
    {
        $boissons = Boisson::orderBy('created_at', 'desc')->get();
        return Inertia::render('Menage', ['boissons' => $boissons]);
    }
    protected function getModelClass()
    {
        return Boisson::class;
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
