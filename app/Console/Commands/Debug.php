<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Livraison;
use Illuminate\Support\Facades\Log;

class Debug extends Command
{
    protected $signature = 'app:debug';
    protected $description = 'Debug livraisons and restaurant groups';

    public function handle()
    {
        // Get all livraisons
        $livraisons = Livraison::all();
        
        $this->info("Total livraisons: " . $livraisons->count());
        
        // Get all restaurant groups
        $restaurantGroups = Livraison::distinct()->pluck('restaurant_group')->toArray();
        
        $this->info("Restaurant groups: " . implode(', ', $restaurantGroups));
        
        // For each restaurant, check what's in data
        foreach ($restaurantGroups as $restaurant) {
            if (empty($restaurant)) continue;
            
            $this->info("\nRestaurant: " . $restaurant);
            
            $restaurantLivraisons = Livraison::where('restaurant_group', $restaurant)->get();
            $this->info("  Livraisons count: " . $restaurantLivraisons->count());
            
            foreach ($restaurantLivraisons as $i => $livraison) {
                $this->info("  Livraison #" . $i);
                $this->info("    ID: " . $livraison->id);
                $this->info("    Type: " . $livraison->type);
                
                if (empty($livraison->data)) {
                    $this->error("    No data found!");
                    continue;
                }
                
                foreach ($livraison->data as $j => $dataItem) {
                    $restauInData = $dataItem['restau'] ?? 'UNKNOWN';
                    $this->info("    Data item #" . $j . " has restau: " . $restauInData);
                    
                    if ($restauInData === $restaurant) {
                        $this->info("      MATCH FOUND");
                    } else {
                        $this->error("      NO MATCH: '{$restauInData}' != '{$restaurant}'");
                    }
                    
                    if (isset($dataItem['products'])) {
                        $this->info("      Products count: " . count($dataItem['products']));
                    } else {
                        $this->error("      No products found!");
                    }
                }
            }
        }
        
        return 0;
    }
}