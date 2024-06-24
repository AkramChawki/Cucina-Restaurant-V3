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

    public function products()
    {
        return array_map(function ($item) {
            $p = CuisinierProduct::find($item['product_id']);
            $p->qty = $item['qty'];
            return $p;
        }, $this->detail);
    }
}
