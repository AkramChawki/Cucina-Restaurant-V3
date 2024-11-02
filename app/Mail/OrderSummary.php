<?php

namespace App\Mail;

use App\Models\CuisinierOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderSummary extends Mailable
{
    use Queueable, SerializesModels;

    public CuisinierOrder $order;
    public $pdf;

    public function __construct($order, $pdf)
    {
        $this->order = $order;
        $this->pdf = $pdf;
    }

    public function envelope(): Envelope
    {
        $prefix = str_contains($this->order->restau, 'Ziraoui') ? '[Ziraoui] ' : '';
        return new Envelope(
            subject: $prefix . 'Nouvelle Commande!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order-summary',
            with: [
                "order" => $this->order, 
                "pdf" => $this->pdf,
                "isZiraoui" => str_contains($this->order->restau, 'Ziraoui')
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}