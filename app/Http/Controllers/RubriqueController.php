<?php

namespace App\Http\Controllers;

use App\Models\Rubrique;
use Inertia\Inertia;

class RubriqueController extends Controller
{
    public function show($rubriqueTitle)
    {
        $rubrique = Rubrique::where('title', $rubriqueTitle)->firstOrFail();
        $fiches = $rubrique->fiches;
        return Inertia::render('Rubrique', [
            "fiches" => $fiches,
            "rubriqueTitle" => $rubriqueTitle
        ]);
    }
}