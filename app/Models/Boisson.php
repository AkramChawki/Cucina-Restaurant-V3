<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Boisson extends BaseModel
{
    use HasFactory;

    protected function getProductModel()
    {
        return Boisson::class;
    }
}