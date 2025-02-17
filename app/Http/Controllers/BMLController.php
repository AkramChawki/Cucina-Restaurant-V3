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
        $type = $request->get('type');

        $query = BML::where('restaurant_id', $restaurant->id)
            ->where('month', $currentMonth)
            ->where('year', $currentYear);

        if ($type) {
            $query->where('type', $type);
        }

        $existingEntries = $query->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'fournisseur' => $entry->fournisseur,
                    'designation' => $entry->designation,
                    'quantity' => $entry->quantity,
                    'price' => $entry->price,
                    'unite' => $entry->unite,
                    'date' => $entry->date,
                    'type' => $entry->type,
                    'total_ttc' => $entry->total_ttc
                ];
            });

        return Inertia::render('FluxReel/bml/BML', [
            'restaurant' => $restaurant,
            'currentMonth' => [
                'month' => (int)$currentMonth,
                'year' => (int)$currentYear
            ],
            'existingEntries' => $existingEntries,
            'types' => BML::TYPES,
            'currentType' => $type
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
            'rows.*.unite' => 'required|string',
            'rows.*.date' => 'required|date',
            'rows.*.type' => 'required|string',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
        ]);

        // First, delete existing entries for this month/year/type if any
        BML::where('restaurant_id', $request->restaurant_id)
            ->where('month', $request->month)
            ->where('year', $request->year)
            ->where('type', $request->rows[0]['type']) // Assuming all rows have same type
            ->delete();

        // Then create new entries
        foreach ($request->rows as $row) {
            BML::create([
                'restaurant_id' => $request->restaurant_id,
                'fournisseur' => $row['fournisseur'],
                'designation' => $row['designation'],
                'quantity' => $row['quantity'],
                'price' => $row['price'],
                'unite' => $row['unite'],
                'date' => $row['date'],
                'type' => $row['type'],
                'total_ttc' => $row['quantity'] * $row['price'],
                'month' => $request->month,
                'year' => $request->year,
            ]);
        }

        return redirect()->back()->with('success', 'BML enregistré avec succès');
    }
}
