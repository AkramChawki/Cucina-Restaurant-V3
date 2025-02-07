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
        $rules = [
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:hygiene,patrimoine,prestataires,travaux',
        ];

        // Add type-specific validation rules
        if ($request->type === 'travaux') {
            $rules['data.rows'] = 'required|array|min:1';
        } elseif ($request->type !== 'prestataires') {
            $rules['restau'] = 'required|string|max:255';
            $rules['moyens'] = 'required|array';
            if ($request->type === 'hygiene') {
                $rules['controles'] = 'required|array';
            }
        } else {
            $rules['prestataires'] = 'required|array|min:1';
        }

        $validated = $request->validate($rules);

        try {
            $data = [];
            if ($request->type === 'prestataires') {
                $data = ['prestataires' => array_values($request->prestataires)];
            } elseif ($request->type === 'travaux') {
                $data = ['rows' => array_values($request->data['rows'])];
            } else {
                $data['moyens'] = $request->moyens;
                if ($request->type === 'hygiene') {
                    $data['controles'] = $request->controles;
                }
            }

            $ficheControle = FicheControle::create([
                'name' => $validated['name'],
                'date' => $validated['date'],
                'restau' => $request->restau ?? null,
                'type' => $validated['type'],
                'data' => $data,
                'pdf' => null
            ]);

            if ($validated['type'] !== 'prestataires' && $validated['type'] !== 'travaux') {
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
