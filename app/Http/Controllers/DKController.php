<?php

namespace App\Http\Controllers;

use App\Models\DK;
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

class DKController extends Controller
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
        $order = new DK();
        $order->name = $request->name;
        $order->restau = $request->restau;
        $order->detail = $detail;
        $order->save();
        $pdf_name = "Commande-DK-" . $order->name . "-" . $order->created_at->format("d-m-Y") . "-" . $order->id . ".pdf";

        generate_pdf_and_save("pdf.order-summary", ["order" => $order], $pdf_name, "documents");
        $order->pdf = $pdf_name;
        $order->save();

        return redirect("/");
    }
}
