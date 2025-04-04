<?php

namespace App\Http\Controllers;

use App\Models\FicheControle;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;
use Carbon\Carbon;
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
            'type' => 'required|in:hygiene,patrimoine,prestataires,travaux,maintenance_preventive',
        ];

        if ($request->type === 'travaux' || $request->type === 'maintenance_preventive') {
            $rules['data.rows'] = 'required|array|min:1';
            if ($request->type === 'maintenance_preventive') {
                $rules['data.mois'] = 'required|string';
            }
        } elseif ($request->type === 'prestataires') {
            $rules['prestataires'] = 'required|array|min:1';

            $existingRecord = FicheControle::where('type', 'prestataires')
                ->latest()
                ->first();

            if ($existingRecord) {
                $existingRecord->update([
                    'name' => $request->name,
                    'date' => $request->date,
                    'data' => ['prestataires' => array_values($request->prestataires)]
                ]);

                return redirect("/")->with('success', 'Liste des prestataires mise à jour avec succès.');
            }
        } else {
            $rules['restau'] = 'required|string|max:255';
            $rules['moyens'] = 'required|array';
            if ($request->type === 'hygiene') {
                $rules['controles'] = 'required|array';
            }
        }

        $validated = $request->validate($rules);

        try {
            $data = [];
            if ($request->type === 'prestataires') {
                $data = ['prestataires' => array_values($request->prestataires)];
            } elseif ($request->type === 'travaux' || $request->type === 'maintenance_preventive') {
                $data = [
                    'rows' => array_values($request->data['rows'])
                ];
                if ($request->type === 'maintenance_preventive') {
                    $data['mois'] = $request->data['mois'];
                }
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
        $datePart = $ficheControle->date ? "-" . $ficheControle->date->format('d-m-Y') : '-' . now()->format('d-m-Y');
        return "{$prefix}{$restauPart}{$datePart}-{$ficheControle->id}.pdf";
    }

    private function savePdf($ficheControle, $pdfName)
    {
        $view = "pdf/fiche-controle-{$ficheControle->type}";
        $pdfUrl = $this->generatePdfAndSave($view, ["fiche" => $ficheControle], $pdfName, "fiche-controles");
        $ficheControle->pdf = $pdfName;
        $ficheControle->save();
        return $pdfUrl;
    }

    public function downloadPrestatairePdf(Request $request)
    {
        try {
            // Create a temporary record for PDF generation
            $ficheControle = FicheControle::create([
                'name' => $request->name,
                'date' => $request->date,
                'type' => 'prestataires',
                'data' => ['prestataires' => $request->prestataires],
                'pdf' => null
            ]);

            $pdfName = $this->generatePdfName($ficheControle);
            $pdfUrl = $this->savePdf($ficheControle, $pdfName);

            $filePath = public_path("storage/fiche-controles/$pdfName");

            $ficheControle->delete();

            return response()->download($filePath)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            Log::error('Failed to generate PDF', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to generate PDF'], 500);
        }
    }
}
