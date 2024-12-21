<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FicheControle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'date',
        'restau',
        'type',
        'data',
        'pdf'
    ];

    protected $casts = [
        'date' => 'date',
        'data' => 'array'
    ];
}