<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('livraisons:aggregate')->twiceDailyAt(3, 16, 00);
        $schedule->command('records:delete-old')->cron('0 0 */14 * *');
        $schedule->command('presence:calculate-jours')
            ->monthlyOn(2, '00:01')
            ->runInBackground();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
