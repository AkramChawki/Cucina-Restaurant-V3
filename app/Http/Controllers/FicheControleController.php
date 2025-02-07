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
        $existingFiche = null;
        if ($type === 'prestataires') {
            $existingFiche = FicheControle::where('restau', $restau)
                ->where('type', 'prestataires')
                ->latest()
                ->first();
        }
        return Inertia::render('FicheControle/Form', [
            "restau" => $restau,
            "type" => $type,
            "existingData" => $existingFiche ? $existingFiche->data : null
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Incoming request data:', $request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'restau' => 'required|string|max:255',
            'type' => 'required|in:hygiene,patrimoine,prestataires',
            'moyens' => 'required_if:type,hygiene,patrimoine|array',
            'controles' => 'required_if:type,hygiene|array',
            'prestataires' => 'required_if:type,prestataires|array'
        ]);

        try {
            $data = [];
            if ($validated['type'] === 'prestataires') {
                $data = ['prestataires' => $request->prestataires];
            } else {
                $data['moyens'] = $request->moyens;
                if ($validated['type'] === 'hygiene') {
                    $data['controles'] = $request->controles;
                }
            }
            $ficheControle = FicheControle::create([
                'name' => $validated['name'],
                'date' => $validated['date'],
                'restau' => $validated['restau'],
                'type' => $validated['type'],
                'data' => $data,
                'pdf' => null
            ]);

            if ($validated['type'] !== 'prestataires') {
                $pdfName = $this->generatePdfName($ficheControle);
                $this->savePdf($ficheControle, $pdfName);
            }

            return redirect("/")->with('success', 'Fiche de contrôle créée avec succès.');
        } catch (\Exception $e) {
            Log::error('Failed to create fiche', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Échec de l\'enregistrement.');
        }
    }

    private function generatePdfName($ficheControle)
    {
        $prefix = "FicheControle" . ucfirst($ficheControle->type);
        $restauPart = $ficheControle->restau ? "-{$ficheControle->restau}" : '';
        return "{$prefix}-{$ficheControle->name}{$restauPart}-{$ficheControle->created_at->format('d-m-Y')}-{$ficheControle->id}.pdf";
    }

    private function savePdf($ficheControle, $pdfName)
    {
        $view = "pdf/fiche-controle-{$ficheControle->type}"; // Changed from pdf.
        $pdfUrl = $this->generatePdfAndSave($view, ["fiche" => $ficheControle], $pdfName, "fiche-controles");
        $ficheControle->pdf = $pdfName;
        $ficheControle->save();
        return $pdfUrl;
    }
}
