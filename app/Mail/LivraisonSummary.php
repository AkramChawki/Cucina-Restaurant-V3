<?php

namespace App\Mail;

use App\Models\Livraison;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LivraisonSummary extends Mailable
{
    use Queueable, SerializesModels;

    public Livraison $livraison;

    public $pdf;

    /**
     * Create a new message instance.
     */
    public function __construct($livraison, $pdf)
    {
        $this->livraison = $livraison;
        $this->pdf = $pdf;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Résumé des Livraisons',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.livraison-summary',
            with: ["livraison" => $this->livraison, "pdf" => $this->pdf]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [
        ];
    }
}