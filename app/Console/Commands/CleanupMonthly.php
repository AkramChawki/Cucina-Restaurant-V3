<?php

namespace App\Console\Commands;

use App\Models\CuisinierOrder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanupMonthly extends Command
{
    protected $signature = 'cleanup:monthly';

    protected $description = 'Cleanup files and database records monthly';

    public function handle()
    {
        $directory = 'public/documents';

        $files = Storage::allFiles($directory);
        $directories = Storage::allDirectories($directory);

        // Delete all files
        foreach ($files as $file) {
            Storage::delete($file);
        }

        foreach ($directories as $dir) {
            Storage::deleteDirectory($dir);
        }

        $this->info('Files and directories inside public/documents deleted successfully.');

        CuisinierOrder::where('created_at', '<', now()->startOfMonth()->subMonth())->delete();
           
        $this->info('Monthly cleanup completed successfully.');
    }
}
