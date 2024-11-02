<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livraison extends Model
{
    use HasFactory;

    protected $fillable = [
        'date', 
        'type', 
        'restaurant_group',
        'data', 
        'pdf_url'
    ];

    protected $casts = [
        'data' => 'array',
        'date' => 'date',
        'type' => 'string',
        'restaurant_group' => 'string'
    ];
}