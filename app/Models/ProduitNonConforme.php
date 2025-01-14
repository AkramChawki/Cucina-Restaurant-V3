<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProduitNonConforme extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'date',
        'restau',
        'type',
        'produit',
        'date_production',
        'probleme',
        'pdf',
        'images'
    ];

    protected $casts = [
        'date' => 'date',
        'date_production' => 'date',
        'images' => 'array'
    ];
}