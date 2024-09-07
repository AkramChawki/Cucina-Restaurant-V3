<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'date',
        'restau',
        'defeillance',
        'image',
        'pdf'
    ];

    protected $casts = [
        'date' => 'date',
    ];


}
