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
        $restaurants = Restaurant::all();
        return Inertia::render('ClotureCaisse/ClotureCaisse', ["restaurants" => $restaurants]);
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

    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'restau' => 'required|string',
            'date' => 'required',
            'time' => 'required',
            'caissierE' => 'required',
            'caissierS' => 'required',
            'signature' => 'required'
        ]);

        $image = $request->signature;
        $Commision_glovo = ($request->glovoC - (0.28 * 1.2 * ($request->glovoE + $request->glovoC)));
        $Commision_livraison = ($request->LivC - (0.15 * 1.2 * ($request->LivE + $request->LivC)));

        // Process the signature image
        $image = str_replace('data:image/png;base64,', '', $image);
        $image = str_replace(' ', '+', $image);
        $imageName = Str::random(10) . '.jpeg';
        Storage::disk('public')->put("/signatures/$imageName", base64_decode($image));

        // Create the record with merged data
        ClotureCaisse::create(array_merge($request->all(), [
            "signature" => url("/") . "/storage/signatures/$imageName",
            "ComGlovo" => $Commision_glovo,
            "ComLivraison" => $Commision_livraison
        ]));

        return redirect("/");
    }
}