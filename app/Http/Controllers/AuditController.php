<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Traits\PdfGeneratorTrait;

class AuditController extends Controller
{
    use PdfGeneratorTrait;

    public function index()
    {
        $restaurants = Restaurant::all();
        return Inertia::render('Audit/Audit', ["restaurants" => $restaurants]);
    }

    public function showForm(Request $request)
    {
        $restau = $request->query('restau');
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

        try {
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('audit', 'public');
                $validated['image'] = $imagePath;
            }

            $audit = Audit::create($validated);

            $pdfName = $this->generatePdfName($audit);
            $this->savePdf($audit, $pdfName);

            return redirect("/")->with('success', 'Audit created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create order.');
        }
    }

    private function generatePdfName($audit)
    {
        return $this->generatePdfFileName("Audit", $audit);
    }

    private function savePdf($audit, $pdfName)
    {
        $pdfUrl = $this->generatePdfAndSave("pdf.audit-summary", ["audit" => $audit], $pdfName, "audits");
        $audit->pdf = $pdfName;
        $audit->save();
    }
}
