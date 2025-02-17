<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BML extends Model
{

    public const TYPES = [
        'Achat' => 'achat',
        'Livraison' => 'livraison',
        'Stock' => 'stock',
        'Autre' => 'autre'
    ];
    protected $table = 'b_m_l_s';
    
    protected $fillable = [
        'restaurant_id',
        'fournisseur',
        'designation',
        'quantity',
        'price',
        'unite',
        'date',
        'type',
        'total_ttc',
        'month',
        'year'
    ];
    
    protected $casts = [
        'date' => 'date',
        'quantity' => 'decimal:2',
        'price' => 'decimal:2',
        'total_ttc' => 'decimal:2'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}