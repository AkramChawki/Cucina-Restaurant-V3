<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LivraisonSummary extends Mailable
{
    use Queueable, SerializesModels;

    public $summaryData;

    public function __construct($summaryData)
    {
        $this->summaryData = $summaryData;
    }

    public function envelope()
    {
        return new Envelope(
            subject: 'Livraison Summary',
        );
    }

    public function content()
    {
        return new Content(
            view: 'emails.livraison-summary',
        );
    }

    public function attachments()
    {
        return [];
    }
}