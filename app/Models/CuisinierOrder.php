<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CuisinierOrder extends Model
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
                // Add rest value if it exists
                if (isset($this->rest[$item['product_id']])) {
                    $p->rest = $this->rest[$item['product_id']];
                }
                return $p;
            }
            return null;
        }, $this->detail ?? []);
    }
}
