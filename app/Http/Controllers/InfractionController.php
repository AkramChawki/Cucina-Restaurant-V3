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
        $infractions = Infraction::with('employe')
            ->orderBy('infraction_date', 'desc')
            ->orderBy('infraction_time', 'desc')
            ->get();

        return Inertia::render('Infraction/Index', [
            'employes' => $employes,
            'infractions' => $infractions,
            'restaurants' => ['Palmier', 'Anoual', 'Labo', 'Economat', 'Ziraoui'],
            'postes' => ['Pizza', 'cuisine', 'salle', 'caisse', '1.5']
        ]);
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
        $validated['infraction_date'] = date('Y-m-d', strtotime($request->infraction_date));
        $validated['infraction_time'] = date('H:i:s', strtotime($request->infraction_time));
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('infractions', 'public');
            $validated['photo_path'] = $path;
        }

        // Create the infraction
        $infraction = Infraction::create($validated);

        $pdfName = $this->generatePdfName($infraction);
        $this->savePdf($infraction, $pdfName);

        return redirect()->back()->with('success', 'Infraction enregistrée avec succès');
    }

    private function generatePdfName($infraction)
    {
        return $this->generatePdfFileName("Infraction", $infraction);
    }

    private function savePdf($infraction, $pdfName)
    {
        $pdfUrl = $this->generatePdfAndSave("pdf.infraction", [
            "infraction" => $infraction->load('employe'),
            "imageBasePath" => public_path(),
            "storagePath" => storage_path('app/public/')
        ], $pdfName, "infractions");

        $infraction->pdf = $pdfName;
        $infraction->save();
    }

    public function report(Request $request)
{
    $infractions = Infraction::with('employe')
        ->when($request->date_from, function ($query) use ($request) {
            return $query->whereDate('infraction_date', '>=', $request->date_from);
        })
        ->when($request->date_to, function ($query) use ($request) {
            return $query->whereDate('infraction_date', '<=', $request->date_to);
        })
        ->orderBy('infraction_date', 'desc')
        ->orderBy('infraction_time', 'desc')
        ->get();

    $pdfName = $this->generatePdfFileName("Rapport-Infractions", "CC");
    
    // Generate and get the PDF file path
    $pdfPath = $this->generatePdfAndSave("pdf.infractions-report", [
        'infractions' => $infractions,
        'date_from' => $request->date_from,
        'date_to' => $request->date_to
    ], $pdfName, "reports");

    // If the file exists, trigger download
    if (file_exists(storage_path('app/public/reports/' . $pdfName))) {
        return response()->download(
            storage_path('app/public/reports/' . $pdfName),
            $pdfName,
            ['Content-Type' => 'application/pdf']
        )->deleteFileAfterSend(true);  // Optional: delete file after download
    }

    // If file doesn't exist, redirect back with error
    return redirect()->back()->with('error', 'Le fichier PDF n\'a pas pu être généré');
}
}
