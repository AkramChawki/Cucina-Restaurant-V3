<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BL extends Model
{
    use HasFactory;

    protected $casts = [
        'detail' => 'array',
        'rest' => 'array',
    ];

    public function products()
    {
        return array_map(function ($item) {
            $p = CuisinierProduct::find($item['product_id']);
            if ($p) {
                $p->qty = $item['qty'];
                // Add rest value if it exists in the rest array
                if ($this->rest) {
                    $restItem = collect($this->rest)->firstWhere('product_id', $item['product_id']);
                    $p->rest = $restItem ? $restItem['qty'] : null;
                }
                return $p;
            }
            return null;
        }, $this->detail ?? []);
    }
}