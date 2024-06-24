<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rubrique extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function fiches()
    {
        return $this->hasMany(Fiche::class, 'rubrique_id');
    }
}
