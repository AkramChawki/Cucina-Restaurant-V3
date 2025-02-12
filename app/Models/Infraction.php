<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Infraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant',
        'infraction_constatee',
        'poste',
        'employe_id',
        'photo_path',
        'infraction_date',
        'infraction_time',
        'pdf'
    ];

    protected $casts = [
        'infraction_date' => 'date:Y-m-d',
        'infraction_time' => 'datetime:H:i:s'
    ];

    // Relationship with Employee
    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }

    // Accessor for full datetime
    public function getInfractionDatetimeAttribute()
    {
        return $this->infraction_date->format('Y-m-d') . ' ' . 
               $this->infraction_time->format('H:i:s');
    }
}