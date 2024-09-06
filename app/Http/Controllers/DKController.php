<?php

namespace App\Http\Controllers;

use App\Models\DK;
use Inertia\Inertia;

class DKController extends BaseOrderController
{

    public function index()
    {
        $dks = DK::orderBy('created_at', 'desc')->get();
        return Inertia::render('DK', ['dks' => $dks]);
    }
    
    protected function getModelClass()
    {
        return DK::class;
    }

    protected function getPdfPrefix()
    {
        return "Commande-DK";
    }

    protected function getPdfDirectory()
    {
        return "dk";
    }
}