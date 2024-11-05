<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Menage extends BaseModel
{
    use HasFactory;

    protected function getProductModel()
    {
        return Menage::class;
    }
}