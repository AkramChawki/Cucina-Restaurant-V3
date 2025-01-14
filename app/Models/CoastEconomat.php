<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoastEconomat extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_id',
        'product_id',
        'month',
        'year',
        'day',
        'value'
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function product()
    {
        return $this->belongsTo(CuisinierProduct::class, 'product_id');
    }

    public static function getMonthlyData($restaurantId, $month, $year)
    {
        return self::where('restaurant_id', $restaurantId)
            ->where('month', $month)
            ->where('year', $year)
            ->get()
            ->groupBy('product_id');
    }
}
