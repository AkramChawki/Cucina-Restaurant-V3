<?php

namespace App\Models;

use App\Traits\CostTrackable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CostPizza extends Model
{
    use HasFactory, CostTrackable;

}
