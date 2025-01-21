<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BML extends Model
{
    protected $table = 'b_m_l_s';
    
    protected $fillable = [
        'restaurant_id',
        'fournisseur',
        'designation',
        'quantity',
        'price',
        'month',
        'year'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}