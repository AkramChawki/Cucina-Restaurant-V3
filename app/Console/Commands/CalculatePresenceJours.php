<?php

namespace App\Console\Commands;

use App\Models\Presence;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CalculatePresenceJours extends Command
{
    protected $signature = 'presence:calculate-jours {--month=} {--year=}';
    protected $description = 'Calculate jours for presence records of previous month';

    public function handle()
    {
        // Get month and year from options or use previous month
        $date = Carbon::now()->subMonth();
        $month = $this->option('month') ?? $date->month;
        $year = $this->option('year') ?? $date->year;

        $this->info("Calculating jours for {$month}/{$year}");

        // Get all presence records for the specified month
        $presences = Presence::where('month', $month)
            ->where('year', $year)
            ->get();

        foreach ($presences as $presence) {
            $jours = 0;

            foreach ($presence->attendance_data ?? [] as $day => $status) {
                $jours += match($status) {
                    'present' => 1,
                    'continue' => 1.5,
                    'conge-paye' => 1,
                    'absent', 'conge-non-paye', 'repos' => 0,
                    default => 0,
                };
            }

            $presence->update(['jours' => $jours]);
            $this->info("Updated presence {$presence->id} with {$jours} jours");
        }

        $this->info('Calculation completed');
    }
}