<?php

namespace App\Http\Controllers;

use App\Models\Rubrique;
use App\Models\Fiche;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $rubriques = Rubrique::all();
        return Inertia::render('Home', ["rubriques" => $rubriques]);
    }

    public function detailles()
    {
        return Inertia::render('Detaills');
    }

}