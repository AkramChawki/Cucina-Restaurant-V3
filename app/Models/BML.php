<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BML extends Model
{
    // Define type constants with display names as keys and values as database values
    public const TYPES = [
        'Gastro' => 'gastro',
        'Giada' => 'giada',
        'Legume' => 'legume',
        'Boisson' => 'boisson'
    ];
    
    // Define type to fournisseur mapping
    public const TYPE_FOURNISSEUR_MAP = [
        'gastro' => 'GASTRO',
        'giada' => 'GIADA',
        'legume' => 'Legume',
        'boisson' => 'COCA COLA'
    ];
    
    protected $table = 'b_m_l_s';

    protected $fillable = [
        'restaurant_id',
        'fournisseur',
        'designation',
        'quantity',
        'price',
        'unite',
        'date',
        'type',
        'total_ttc',
        'month',
        'year'
    ];

    protected $casts = [
        'date' => 'date',
        'quantity' => 'decimal:2',
        'price' => 'decimal:2',
        'total_ttc' => 'decimal:2'
    ];

    /**
     * Get the fournisseur for a given type
     */
    public static function getFournisseurByType($type)
    {
        return self::TYPE_FOURNISSEUR_MAP[$type] ?? '';
    }

    /**
     * Set the fournisseur attribute based on type
     */
    public function setTypeAttribute($value)
    {
        $this->attributes['type'] = $value;
        
        // Auto-set fournisseur when type changes
        if (isset(self::TYPE_FOURNISSEUR_MAP[$value])) {
            $this->attributes['fournisseur'] = self::TYPE_FOURNISSEUR_MAP[$value];
        }
    }

    /**
     * Calculate total_ttc before saving
     */
    protected static function booted()
    {
        static::creating(function ($bml) {
            if (!isset($bml->attributes['total_ttc']) || $bml->attributes['total_ttc'] == 0) {
                $bml->total_ttc = $bml->quantity * $bml->price;
            }
        });
        
        static::updating(function ($bml) {
            if ($bml->isDirty(['quantity', 'price'])) {
                $bml->total_ttc = $bml->quantity * $bml->price;
            }
        });
    }

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}