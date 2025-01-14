<?php

namespace App\Http\Controllers;

use App\Models\ProduitNonConforme;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'restau' => 'required|string|max:255',
            'type' => 'required|string|in:cuisinier,pizzaiolo',
            'produit' => 'required|string|max:255',
            'date_production' => 'required|date',
            'probleme' => 'required|string|max:255',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        try {

            // Handle image uploads
            $imagesPaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('produit-non-conforme-images', 'public');
                    $imagesPaths[] = $path;
                }
            }
            // First, set a temporary PDF value
            $validated['pdf'] = 'temp.pdf';
            $validated['images'] = $imagesPaths;

            // Create the record
            $produit = ProduitNonConforme::create($validated);

            // Generate the PDF name and save it
            $pdfName = $this->generatePdfName($produit);
            $this->savePdf($produit, $pdfName);

            // Update the record with the correct PDF name
            $produit->pdf = $pdfName;
            $produit->save();

            return redirect("/")->with('success', 'Produit non conforme enregistré avec succès.');
        } catch (\Exception $e) {
            foreach ($imagesPaths as $path) {
                Storage::disk('public')->delete($path);
            }
            Log::error('Failed to create product record', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Échec de l\'enregistrement.');
        }
    }

    private function generatePdfName($produit)
    {
        // Using the same pattern as your audit system
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
        return $pdfUrl;
    }
}