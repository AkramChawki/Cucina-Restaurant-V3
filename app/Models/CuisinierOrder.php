<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CuisinierOrder extends Model
{
    use HasFactory;

    protected $casts = [
        'detail' => 'array',
    ];

    public function getDetailAttribute($value)
    {
        if (is_string($value)) {
            return json_decode($value, true) ?? [];
        }
        return $value ?? [];
    }

    public function products()
    {
        $detail = $this->detail;
        
        if (!is_array($detail)) {
            return [];
        }

        return array_map(function ($item) {
            $p = CuisinierProduct::find($item['product_id']);
            if ($p) {
                $p->qty = $item['qty'];
                return $p;
            }
            return null;
        }, $detail);
    }
}