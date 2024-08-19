<?php

namespace App\Http\Controllers;

use App\Mail\InventaireSummary;
use App\Models\Controle;
use App\Models\CuisinierInventaire;
use App\Models\Inventaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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
class InventaireCuisinierController extends Controller
{
    public function Inventaire(Request $request)
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
        $order = new Inventaire();
        $order->name = $request->name;
        $order->restau = $request->restau;
        $order->detail = $detail;
        $order->save();
        if ($order->restau == "/") {
            $pdf_name = "Inventaire-Interne-" . $order->name . "-" . $order->created_at->format("d-m-Y") . "-" . $order->id . ".pdf";
        } else {
            $pdf_name = "Inventaire-Interne-" . $order->name . "-" . $order->restau . "-" . $order->created_at->format("d-m-Y") . "-" . $order->id . ".pdf";
        }
        generate_pdf_and_save("pdf.inventaire-summary", ["order" => $order], $pdf_name, "documents");
        $order->pdf = $pdf_name;
        $order->save();
        return redirect("/");
    }

    public function Controle(Request $request)
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
        $order = new Controle();
        $order->name = $request->name;
        $order->restau = $request->restau;
        $order->detail = $detail;
        $order->save();
        if ($order->restau == "/") {
            $pdf_name = "Controle-Interne-" . $order->name . "-" . $order->created_at->format("d-m-Y") . "-" . $order->id . ".pdf";
        } else {
            $pdf_name = "Controle-Interne-" . $order->name . "-" . $order->restau . "-" . $order->created_at->format("d-m-Y") . "-" . $order->id . ".pdf";
        }
        generate_pdf_and_save("pdf.inventaire-summary", ["order" => $order], $pdf_name, "inventaire");
        $order->pdf = $pdf_name;
        $order->save();
        return redirect("/");
    }
}
