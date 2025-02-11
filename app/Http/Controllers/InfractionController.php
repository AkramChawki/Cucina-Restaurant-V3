<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use App\Models\Infraction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;

class InfractionController extends Controller
{
    use PdfGeneratorTrait;

    public function index()
    {
        $employes = Employe::select('id', 'first_name', 'last_name', 'profile_photo')->get();
        return $employes;
        // $infractions = Infraction::with('employe')
        //     ->orderBy('infraction_date', 'desc')
        //     ->orderBy('infraction_time', 'desc')
        //     ->get();

        // return Inertia::render('Infraction/Index', [
        //     'employes' => $employes,
        //     'infractions' => $infractions,
        //     'restaurants' => ['Palmier', 'Anoual', 'Labo', 'Economat', 'Ziraoui'],
        //     'postes' => ['Pizza', 'cuisine', 'salle', 'caisse', '1.5']
        // ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant' => 'required|string',
            'infraction_constatee' => 'required|string',
            'poste' => 'required|string',
            'employe_id' => 'required|exists:employes,id',
            'photo' => 'required|image|max:2048',
            'infraction_date' => 'required|date',
            'infraction_time' => 'required'
        ]);

        // Store the photo
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('infractions', 'public');
            $validated['photo_path'] = $path;
        }

        // Create the infraction
        $infraction = Infraction::create($validated);

        // Generate and store PDF
        $pdfName = $this->generatePdfFileName("Infraction", $infraction);
        $this->generatePdfAndSave("pdf.infraction", [
            "infraction" => $infraction->load('employe')
        ], $pdfName, "infractions");

        $infraction->pdf = $pdfName;
        $infraction->save();

        return redirect()->back()->with('success', 'Infraction enregistrée avec succès');
    }

    public function report(Request $request)
    {
        $infractions = Infraction::with('employe')
            ->when($request->date_from, function($query) use ($request) {
                return $query->whereDate('infraction_date', '>=', $request->date_from);
            })
            ->when($request->date_to, function($query) use ($request) {
                return $query->whereDate('infraction_date', '<=', $request->date_to);
            })
            ->orderBy('infraction_date', 'desc')
            ->orderBy('infraction_time', 'desc')
            ->get();

        $pdfName = $this->generatePdfFileName("Rapport-Infractions", null);
        $this->generatePdfAndSave("pdf.infractions-report", [
            'infractions' => $infractions,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to
        ], $pdfName, "reports");

        return redirect()->back()->with('success', 'Rapport généré avec succès');
    }
}