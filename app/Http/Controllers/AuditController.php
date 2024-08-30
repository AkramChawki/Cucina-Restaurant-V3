<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::all();
        return Inertia::render('Audit/Audit', ["restaurants" => $restaurants]);
    }

    public function showForm()
    {
        $restau = request("restau");
        return Inertia::render('Audit/Auditform', ["restau" => $restau]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'restau' => 'required|string|max:255',
            'defeillance' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('audit', 'public');
            $validated['image'] = $imagePath;
        }

        $audit = Audit::create($validated);

        $pdfName = $this->generatePdfName($audit);
        $this->savePdf($audit, $pdfName);

        return redirect("/");
    }

    private function generatePdfAndSave($view, $data, $fileName, $directory)
    {
        $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
        $pdf->binary = base_path('vendor/silvertipsoftware/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');
        
        $filePath = public_path("storage/$directory/$fileName");
        
        if (!$pdf->saveAs($filePath)) {
            throw new \Exception("Failed to generate PDF: " . $pdf->getError());
        }
        
        return asset("storage/$directory/$fileName");
    }

    private function generatePdfName($audit)
    {
        return "Audit-{$audit->name}-{$audit->restau}-{$audit->date}-{$audit->id}.pdf";
    }

    private function savePdf($audit, $pdfName)
    {
        $pdfUrl = $this->generatePdfAndSave("pdf.audit-summary", ["audit" => $audit], $pdfName, "audits");
        $audit->pdf = $pdfUrl;
        $audit->save();
    }
}
