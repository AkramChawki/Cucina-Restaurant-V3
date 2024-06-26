<?php

namespace App\Http\Controllers;

use App\Mail\OrderSummary;
use App\Models\CuisinierOrder;
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
class CommandeCuisinierController extends Controller
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
        $order = new CuisinierOrder();
        $order->name = $request->name;
        $order->restau = $request->restau;
        $order->detail = $detail;
        $order->save();
        $pdf_name = "Commande-" . $order->name . "-" . ($order->restau ?: '') . "-" . $order->created_at->format("d-m-Y") . "-" . $order->id . ".pdf";

        generate_pdf_and_save("pdf.order-summary", ["order" => $order], $pdf_name, "documents");
        generate_pdf_and_save("pdf.receipt", ["order" => $order], $pdf_name, "receipt");
        Mail::to("admin@cucinanapoli.com")->send(new OrderSummary($order, $pdf_name));
        Mail::to("tayeb@cucinanapoli.com")->send(new OrderSummary($order, $pdf_name));

        $order->pdf = $pdf_name;
        $order->save();

        return redirect("/");
    }
}
