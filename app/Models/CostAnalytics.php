<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CostAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_id',
        'day',
        'month',
        'year',
        'type',
        'amount',
        'cumul',
        'revenue',
        'cumul_revenue',
        'percentage'
    ];

    /**
     * Get the restaurant that owns the cost analytics record.
     */
    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    /**
     * Scope a query to only include FC records.
     */
    public function scopeFoodCost($query)
    {
        return $query->where('type', 'FC');
    }

    /**
     * Scope a query to only include CC records.
     */
    public function scopeConsumableCost($query)
    {
        return $query->where('type', 'CC');
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeForDateRange($query, $startDate, $endDate)
    {
        return $query->whereRaw("CONCAT(year, '-', LPAD(month, 2, '0'), '-', LPAD(day, 2, '0')) >= ?", [$startDate])
                     ->whereRaw("CONCAT(year, '-', LPAD(month, 2, '0'), '-', LPAD(day, 2, '0')) <= ?", [$endDate]);
    }

    /**
     * Scope a query to filter by specific month and year.
     */
    public function scopeForMonth($query, $month, $year)
    {
        return $query->where('month', $month)
                     ->where('year', $year);
    }
}
