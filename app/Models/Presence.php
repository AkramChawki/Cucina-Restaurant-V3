<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    protected $fillable = [
        'employe_id',
        'month',
        'year',
        'attendance_data',
        'jours'
    ];

    protected $casts = [
        'attendance_data' => 'array'
    ];

    public function employe()
    {
        return $this->belongsTo(Employe::class);
    }
}