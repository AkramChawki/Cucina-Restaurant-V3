<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThermalReceipt extends Model
{
    use HasFactory;

    protected $fillable = [
        'receipt_id',
        'restaurant',
        'data',
        'printed'
    ];

    protected $casts = [
        'data' => 'array',
        'printed' => 'boolean'
    ];
}