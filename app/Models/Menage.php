<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menage extends Model
{
    use HasFactory;

    protected $casts = [
        'detail' => 'array',
        'rest' => 'array',
    ];

    public function products()
    {
        return array_map(function ($item) {
            // Change Menage::find to Product::find since we're looking for products
            $p = Product::find($item['product_id']);
            if ($p) {
                $p->qty = $item['qty'];
                // Add rest value if it exists in the rest array
                if ($this->rest) {
                    $restItem = collect($this->rest)->firstWhere('product_id', $item['product_id']);
                    $p->rest = $restItem ? $restItem['qty'] : null;
                }
                return $p;
            }
            // Return a null-safe object if product not found
            return (object)[
                'image' => null,
                'designation' => 'Product Not Found',
                'qty' => $item['qty'],
                'unite' => 'N/A',
                'rest' => null
            ];
        }, $this->detail ?? []);
    }
}