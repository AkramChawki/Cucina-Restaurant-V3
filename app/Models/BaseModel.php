<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    protected $casts = [
        'detail' => 'array',
        'rest' => 'array',
    ];

    abstract protected function getProductModel();

    public function products()
    {
        return array_map(function ($item) {
            $modelClass = $this->getProductModel();
            $p = $modelClass::find($item['product_id']);
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