<?php

namespace App\Http\Controllers;

use App\Models\ThermalReceipt;
use Inertia\Inertia;

class ThermalReceiptController extends Controller
{
    public function index()
    {
        $thermalReceipts = ThermalReceipt::orderBy('created_at', 'desc')
            ->get();
            
        return Inertia::render('ThermalReceipts', [
            'thermalReceipts' => $thermalReceipts
        ]);
    }
    
    public function markAsPrinted($id)
    {
        $receipt = ThermalReceipt::findOrFail($id);
        $receipt->printed = true;
        $receipt->save();
        
        return redirect()->back();
    }
    
    public function getLatestForRestaurant($restaurant)
    {
        $receipt = ThermalReceipt::where('restaurant', $restaurant)
            ->orderBy('created_at', 'desc')
            ->first();
            
        if (!$receipt) {
            return Inertia::render('RestaurantLatestReceipt', [
                'restaurant' => $restaurant,
                'receipt' => null
            ]);
        }
        
        return Inertia::render('RestaurantLatestReceipt', [
            'restaurant' => $restaurant,
            'receipt' => $receipt
        ]);
    }
}