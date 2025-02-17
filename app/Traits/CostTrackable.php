<?php

namespace App\Traits;

trait CostTrackable
{
    protected $fillable = [
        'restaurant_id',
        'product_id',
        'month',
        'year',
        'daily_data'
    ];

    protected $casts = [
        'daily_data' => 'array'
    ];

    public function restaurant()
    {
        return $this->belongsTo(\App\Models\Restaurant::class);
    }

    public function product()
    {
        return $this->belongsTo(\App\Models\CuisinierProduct::class, 'product_id');
    }

    public static function getMonthlyData($restaurantId, $month, $year)
    {
        return self::where('restaurant_id', $restaurantId)
            ->where('month', $month)
            ->where('year', $year)
            ->get()
            ->mapWithKeys(function ($record) {
                // Ensure daily_data has both periods for each day
                $standardizedData = [];
                if ($record->daily_data) {
                    foreach ($record->daily_data as $day => $periods) {
                        $standardizedData[$day] = [
                            'morning' => $periods['morning'] ?? 0,
                            'afternoon' => $periods['afternoon'] ?? 0
                        ];
                    }
                }
                return [$record->product_id => $standardizedData];
            });
    }
}