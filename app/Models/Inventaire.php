<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventaire extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'restau', 'detail', 'pdf'];

    protected $casts = [
        'detail' => 'array',
    ];

    public function products()
    {
        return array_map(function ($item) {
            $p = CuisinierProduct::find($item['id']);
            if ($p) {
                $p->qty = $item['qty'];
                return $p;
            }
            return null;
        }, $this->detail ?? []);
    }
}