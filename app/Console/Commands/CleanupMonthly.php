<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\CuisinierOrder; // Replace with your actual model

class CleanupMonthly extends Command
{
    protected $signature = 'cleanup:monthly';

    protected $description = 'Cleanup files and database records monthly';

    public function handle()
    {
        // Delete files
        $filesDeleted = Storage::deleteDirectory('public/documents');

        if ($filesDeleted) {
            $this->info('Files in public/documents deleted successfully.');
        } else {
            $this->error('Failed to delete files in public/documents.');
        }

        // Delete database records
        CuisinierOrder::where('created_at', '<', now()->startOfMonth()->subMonth())->delete(); // Adjust based on your database structure
           
        $this->info('Monthly cleanup completed successfully.');
    }
}
