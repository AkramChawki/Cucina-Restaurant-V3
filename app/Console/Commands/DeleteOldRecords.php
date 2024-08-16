<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Livraison;
use App\Models\CuisinierOrder;
use Carbon\Carbon;

class DeleteOldRecords extends Command
{
    protected $signature = 'records:delete-old';
    protected $description = 'Delete records older than 3 days for Livraison and CuisinierOrder models';

    public function handle()
    {
        $threeDaysAgo = Carbon::now()->subDays(3);

        $deletedLivraisons = Livraison::where('created_at', '<', $threeDaysAgo)->delete();
        $deletedOrders = CuisinierOrder::where('created_at', '<', $threeDaysAgo)->delete();

        $this->info("Successfully deleted {$deletedLivraisons} Livraison records and {$deletedOrders} CuisinierOrder records");
    }
}