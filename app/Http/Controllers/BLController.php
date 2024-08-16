<?php

namespace App\Http\Controllers;

use App\Models\BL;
use Illuminate\Http\Request;


function generate_pdf_and_save($view, $data, $file_name, $directory)
{
    $pdf = new \mikehaertl\wkhtmlto\Pdf(view($view, $data)->render());
    $pdf->binary = base_path('vendor/h4cc/wkhtmltopdf-amd64/bin/wkhtmltopdf-amd64');
    if (!$pdf->saveAs(public_path("storage/$directory/$file_name"))) {
        $error = $pdf->getError();
        dd($error);
    }
    return asset("storage/$directory/$file_name");
}
class BLController extends Controller
{
    public function store(Request $request)
    {
        set_time_limit(500);

        $qty = array_filter($request->products, function ($product) {
            return !empty($product['qty']) && $product['qty'] > 0;
        });
        $detail = [];
        foreach ($qty as $product) {
            $detail[] = [
                "product_id" => $product['id'],
                "qty" => $product['qty']
            ];
        }
        $bl = new BL();
        $bl->name = $request->name;
        $bl->restau = $request->restau;
        $bl->detail = $detail;
        $bl->save();
        $pdf_name = "BL-" . $bl->name . "-" . ($bl->restau ?: '') . "-" . $bl->created_at->format("d-m-Y") . "-" . $bl->id . ".pdf";
        generate_pdf_and_save("pdf.bl", ["bl" => $bl], $pdf_name, "documents");
        $bl->pdf = $pdf_name;
        $bl->save();
        return redirect("/");
    }
}
