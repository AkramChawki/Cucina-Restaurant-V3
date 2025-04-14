<?php

namespace App\Http\Controllers;

use App\Models\ClotureCaisse;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClotureCaisseController extends Controller
{
    public function index()
    {
        return Inertia::render('ClotureCaisse/Home',);
    }

    public function create(Request $request)
    {
        if (!$request->has('restau')) {
            return redirect('/cloture-caisse');
        }
        
        return Inertia::render('ClotureCaisse/Ajouter', [
            'restau' => $request->query('restau')
        ]);
    }

    public function show(Request $request, $restaurant = null)
    {
        if (!$restaurant) {
            $restaurants = Restaurant::all();
            return Inertia::render('ClotureCaisse/SelectRestaurant', [
                "restaurants" => $restaurants,
                "action" => "show"
            ]);
        }
        
        // Get all cloture caisse records for the specified restaurant
        $records = ClotureCaisse::where('restau', $restaurant)
            ->orderBy('date', 'desc')
            ->get();
            
        return Inertia::render('ClotureCaisse/Show', [
            'records' => $records,
            'restaurant' => $restaurant
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string',
            'restau' => 'required|string',
            'date' => 'required',
            'time' => 'required',
            'responsable' => 'required|string',
            'montant' => 'required|numeric',
            'montantE' => 'nullable|numeric',
            'cartebancaire' => 'nullable|numeric',
            'cartebancaireLivraison' => 'nullable|numeric',
            'virement' => 'nullable|numeric',
            'cheque' => 'nullable|numeric',
            'compensation' => 'nullable|numeric',
            'familleAcc' => 'nullable|numeric',
            'erreurPizza' => 'nullable|numeric',
            'erreurCuisine' => 'nullable|numeric',
            'erreurServeur' => 'nullable|numeric',
            'erreurCaisse' => 'nullable|numeric',
            'perteEmporte' => 'nullable|numeric',
            'giveawayPizza' => 'nullable|numeric',
            'giveawayPasta' => 'nullable|numeric',
            'glovoC' => 'nullable|numeric',
            'glovoE' => 'nullable|numeric',
            'appE' => 'nullable|numeric',
            'appC' => 'nullable|numeric',
            'shooting' => 'nullable|numeric',
            'charge' => 'nullable|numeric',
            'signature' => 'required'
        ]);

        $image = $request->signature;
        
        $Commision_glovo = 0;
        if ($request->glovoC > 0 || $request->glovoE > 0) {
            $Commision_glovo = ($request->glovoC - (0.26 * 1.2 * ($request->glovoE + $request->glovoC)));
        }

        $image = str_replace('data:image/png;base64,', '', $image);
        $image = str_replace(' ', '+', $image);
        $imageName = Str::random(10) . '.jpeg';
        Storage::disk('public')->put("/signatures/$imageName", base64_decode($image));

        try {
            ClotureCaisse::create(array_merge(
                $request->all(),
                [
                    "signature" => url("/") . "/storage/signatures/$imageName",
                    "ComGlovo" => $Commision_glovo
                ]
            ));

            return redirect("/")->with('success', 'Clôture de caisse enregistrée avec succès');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Une erreur est survenue lors de l\'enregistrement');
        }
    }
}