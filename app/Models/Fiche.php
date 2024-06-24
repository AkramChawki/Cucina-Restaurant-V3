<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fiche extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'rubrique_id',
    ];

    public function rubrique()
    {
        return $this->belongsTo(Rubrique::class, 'rubrique_id');
    }

    public function cuisinier_products()
    {
        return $this->belongsToMany(CuisinierProduct::class, 'fiche_cuisinier_product');
    }
}
