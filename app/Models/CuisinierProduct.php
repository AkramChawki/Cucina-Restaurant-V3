<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CuisinierProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'designation',
        'image',
        'unite',
        'type',
        'cr',
        'prix',
        'moy',
        'cuisinier_category_id',
    ];

    public function cuisinier_category()
    {
        return $this->belongsTo(CuisinierCategory::class);
    }

    public function fiches()
    {
        return $this->belongsToMany(Fiche::class, 'fiche_cuisinier_product', 'cuisinier_product_id', 'fiche_id');
    }
}
