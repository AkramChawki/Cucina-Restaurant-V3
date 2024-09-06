<?php

namespace App\Http\Controllers;

use App\Models\Number;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NumberController extends Controller
{
    public function index()
    {
        return Inertia::render('Numeros/Numeros');
    }

    public function create()
    {
        return Inertia::render('Numeros/Ajouter');
    }

    public function store(Request $request)
    {
        foreach ($request->numbers as $number) {
            Number::create([
                "number" => $number
            ]);
        }
        return redirect("/");
    }
}