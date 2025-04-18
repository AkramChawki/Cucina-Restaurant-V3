<?php

namespace App\Services;

class BLTypeMappingService
{
    /**
     * Original BL types
     */
    public static $validTypes = [
        'BL Economat',
        'BL Poisson',
        'BL Viande',
        'BL Labo',
        'BL Sauces Cuisine',
        'BL Sauces Pizza',
        'BL Boite Pizza',
        'BL Arancini et Ravioli',
        'BL Dessert',
        'BL Charcuterie et frommage',
        'BL Legume et jus',
        'BL Pate a pizza',
        'BL Conserve et pates',
        'BL Ramadan'
    ];
    
    /**
     * Thermal BL consolidated types
     */
    public static $thermalTypes = [
        'BL Protein',
        'BL Sauce',
        'BL Food Sec',
        'BL Economat',
        'BL Labo',
        'BL Arancini et Ravioli',
        'BL Dessert',
        'BL Charcuterie et frommage',
        'BL Legume et jus',
        'BL Ramadan'
    ];
    
    /**
     * Maps original BL types to thermal consolidated types
     */
    public static $typeMapping = [
        'BL Poisson' => 'BL Protein',
        'BL Viande' => 'BL Protein',
        'BL Sauces Cuisine' => 'BL Sauce',
        'BL Sauces Pizza' => 'BL Sauce',
        'BL Pate a pizza' => 'BL Food Sec',
        'BL Conserve et pates' => 'BL Food Sec',
        'BL Boite Pizza' => 'BL Food Sec',
        'BL Economat' => 'BL Economat',
        'BL Labo' => 'BL Labo',
        'BL Arancini et Ravioli' => 'BL Arancini et Ravioli',
        'BL Dessert' => 'BL Dessert',
        'BL Charcuterie et frommage' => 'BL Charcuterie et frommage',
        'BL Legume et jus' => 'BL Legume et jus',
        'BL Ramadan' => 'BL Ramadan'
    ];
    
    /**
     * Get thermal type for a given original BL type
     */
    public static function getThermalType($originalType)
    {
        return self::$typeMapping[$originalType] ?? $originalType;
    }
    
    /**
     * Get all original BL types that map to a given thermal type
     */
    public static function getOriginalTypesForThermal($thermalType)
    {
        return array_keys(array_filter(self::$typeMapping, function($t) use ($thermalType) {
            return $t === $thermalType;
        }));
    }
}