<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Labo extends Model
{
    use HasFactory;

    protected $casts = [
        'detail' => 'array',
    ];

    public function products()
    {
        return array_map(function ($item) {
            $p = CuisinierProduct::find($item['product_id']);
            if ($p) {
                $p->qty = $item['qty'];
                return $p;
            }
            return null;
        }, $this->detail ?? []);
    }

    public function setRestauAttribute($value)
    {
        $this->attributes['restau'] = null;
    }
}
