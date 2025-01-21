<?php

namespace App\Http\Controllers;

use App\Models\BML;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BMLController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::all(['id', 'name', 'slug']);

        return Inertia::render('FluxReel/bml/BMLRestau', [
            'restaurants' => $restaurants
        ]);
    }

    public function show(Request $request, $restaurantSlug)
{
    $restaurant = Restaurant::where('slug', $restaurantSlug)->firstOrFail();
    $currentMonth = $request->get('month', now()->month);
    $currentYear = $request->get('year', now()->year);

    // Get existing BML entries for the selected month/year
    $existingEntries = BML::where('restaurant_id', $restaurant->id)
        ->where('month', $currentMonth)
        ->where('year', $currentYear)
        ->get()
        ->map(function ($entry) {
            return [
                'id' => $entry->id,
                'fournisseur' => $entry->fournisseur,
                'designation' => $entry->designation,
                'quantity' => $entry->quantity,
                'price' => $entry->price
            ];
        });

    return Inertia::render('FluxReel/bml/BML', [
        'restaurant' => $restaurant,
        'currentMonth' => [
            'month' => (int)$currentMonth,
            'year' => (int)$currentYear
        ],
        'existingEntries' => $existingEntries
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'rows' => 'required|array',
            'rows.*.fournisseur' => 'required|string',
            'rows.*.designation' => 'required|string',
            'rows.*.quantity' => 'required|numeric|min:0',
            'rows.*.price' => 'required|numeric|min:0',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
        ]);

        foreach ($request->rows as $row) {
            BML::create([
                'restaurant_id' => $request->restaurant_id,
                'fournisseur' => $row['fournisseur'],
                'designation' => $row['designation'],
                'quantity' => $row['quantity'],
                'price' => $row['price'],
                'month' => $request->month,
                'year' => $request->year,
            ]);
        }

        return redirect()->back()->with('success', 'BML enregistré avec succès');
    }

    
}