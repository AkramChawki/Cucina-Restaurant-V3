<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BL extends Model
{
    use HasFactory;

    protected $table = 'b_l_s';

    protected $fillable = [
        'name',
        'restau',
        'detail',
        'rest',
        'pdf'
    ];

    protected $casts = [
        'detail' => 'array',
        'rest' => 'array',
    ];

    public function products()
    {
        return array_map(function ($item) {
            $product = CuisinierProduct::find($item['product_id']);
            if ($product) {
                $product->qty = $item['qty'];
                if ($this->rest) {
                    $restItem = collect($this->rest)->firstWhere('product_id', $item['product_id']);
                    $product->rest = $restItem ? $restItem['qty'] : null;
                }
                return $product;
            }
            return null;
        }, $this->detail ?? []);
    }
}