<?php

namespace App\Models;

use App\Traits\CostTrackable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CostPizza extends Model
{
    use HasFactory, CostTrackable;

    protected $fillable = [
        'restaurant_id',
        'product_id',
        'month',
        'year',
        'daily_data'
    ];

    protected $casts = [
        'daily_data' => 'array'
    ];
}