<?php

namespace App\Http\Controllers;

use App\Models\ProduitNonConforme;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;
use Illuminate\Support\Facades\Log;


class ProduitNonConformeController extends Controller
{
    use PdfGeneratorTrait;

    public function index()
    {
        $restaurants = Restaurant::all();
        return Inertia::render('PNC/PNC', ["restaurants" => $restaurants]);
    }

    public function showForm(Request $request)
    {
        $restau = $request->query('restau');
        return Inertia::render('PNC/PNCform', ["restau" => $restau]);
    }

    public function store(Request $request)
{
    Log::info('Received form submission', $request->all());

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'date' => 'required|date',
        'restau' => 'required|string|max:255',
        'type' => 'required|string|in:cuisinier,pizzaiolo',
        'produit' => 'required|string|max:255',
        'date_production' => 'required|date',
        'probleme' => 'required|string|max:255',
    ]);

    try {
        $produit = ProduitNonConforme::create($validated);
        
        Log::info('Created product record', ['id' => $produit->id]);

        $pdfName = $this->generatePdfName($produit);
        $this->savePdf($produit, $pdfName);

        return redirect("/")->with('success', 'Produit non conforme enregistré avec succès.');
    } catch (\Exception $e) {
        Log::error('Failed to create product record', ['error' => $e->getMessage()]);
        return redirect()->back()->with('error', 'Échec de l\'enregistrement.');
    }
}

    private function generatePdfName($produit)
    {
        return $this->generatePdfFileName("ProduitNonConforme", $produit);
    }

    private function savePdf($produit, $pdfName)
    {
        $pdfUrl = $this->generatePdfAndSave(
            "pdf.produit-non-conforme", 
            ["produit" => $produit], 
            $pdfName, 
            "produits-non-conformes"
        );
        $produit->pdf = $pdfName;
        $produit->save();
    }
}