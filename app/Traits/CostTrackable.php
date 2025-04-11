<?php

namespace App\Traits;

trait CostTrackable
{
    public function initializeCostTrackable()
    {
        $this->fillable = [
            'restaurant_id',
            'product_id',
            'month',
            'year',
            'daily_data',
            'status',
            'verified_by_id',
            'verified_at'
        ];

        $this->casts = array_merge($this->casts, [
            'daily_data' => 'array',
            'verified_at' => 'datetime'
        ]);
    }

    public function restaurant()
    {
        return $this->belongsTo(\App\Models\Restaurant::class);
    }

    public function product()
    {
        return $this->belongsTo(\App\Models\CuisinierProduct::class, 'product_id');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'verified_by_id');
    }

    public static function getMonthlyData($restaurantId, $month, $year)
    {
        return self::where('restaurant_id', $restaurantId)
            ->where('month', $month)
            ->where('year', $year)
            ->get()
            ->mapWithKeys(function ($record) {
                $standardizedData = [];
                if ($record->daily_data) {
                    foreach ($record->daily_data as $day => $periods) {
                        $standardizedData[$day] = [
                            'morning' => $periods['morning'] ?? 0,
                            'afternoon' => $periods['afternoon'] ?? 0,
                            'status' => $periods['status'] ?? 'pending',
                            'created_at' => $periods['created_at'] ?? null,
                            'updated_at' => $periods['updated_at'] ?? null,
                            'verified_at' => $periods['verified_at'] ?? null,
                            'verified_by' => $periods['verified_by'] ?? null
                        ];
                    }
                }
                return [$record->product_id => $standardizedData];
            });
    }
}