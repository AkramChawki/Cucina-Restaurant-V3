<?php

namespace App\Http\Controllers;

use App\Models\FicheControle;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;
use Illuminate\Support\Facades\Log;

class FicheControleController extends Controller
{
    use PdfGeneratorTrait;

    public function index()
    {
        $restaurants = Restaurant::all();
        return Inertia::render('FicheControle/Index', [
            "restaurants" => $restaurants
        ]);
    }

    public function showForm(Request $request)
    {
        $restau = $request->query('restau');
        $type = $request->query('type');
        return Inertia::render('FicheControle/Form', [
            "restau" => $restau,
            "type" => $type
        ]);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'date' => 'required|date',
        'restau' => 'required|string|max:255',
        'type' => 'required|in:laboratoire,restaurant',
    ]);

    try {
        // First create with temporary PDF
        $validated['pdf'] = 'temp.pdf';
        $data = $request->except(['name', 'date', 'restau', 'type']);
        
        $ficheControle = FicheControle::create([
            'name' => $validated['name'],
            'date' => $validated['date'],
            'restau' => $validated['restau'],
            'type' => $validated['type'],
            'data' => $data,
            'pdf' => 'temp.pdf', // Add temporary PDF value
        ]);

        // Generate and update PDF
        $pdfName = $this->generatePdfName($ficheControle);
        $this->savePdf($ficheControle, $pdfName);

        // Update with correct PDF name
        $ficheControle->pdf = $pdfName;
        $ficheControle->save();

        return redirect("/")->with('success', 'Fiche de contrôle créée avec succès.');
    } catch (\Exception $e) {
        Log::error('Failed to create fiche de controle', ['error' => $e->getMessage()]);
        return redirect()->back()->with('error', 'Échec de l\'enregistrement.');
    }
}

    private function generatePdfName($ficheControle)
    {
        return $this->generatePdfFileName(
            "FicheControle" . ucfirst($ficheControle->type), 
            $ficheControle
        );
    }

    private function savePdf($ficheControle, $pdfName)
    {
        $view = $ficheControle->type === 'laboratoire' 
            ? 'pdf.fiche-controle-laboratoire' 
            : 'pdf.fiche-controle-restaurant';

        $pdfUrl = $this->generatePdfAndSave(
            $view,
            ["fiche" => $ficheControle],
            $pdfName,
            "fiche-controles"
        );

        $ficheControle->pdf = $pdfName;
        $ficheControle->save();

        return $pdfUrl;
    }
}