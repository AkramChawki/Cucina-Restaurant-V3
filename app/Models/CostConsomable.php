<?php

namespace App\Models;

use App\Traits\CostTrackable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CostConsomable extends Model
{
    use HasFactory, CostTrackable;

}
