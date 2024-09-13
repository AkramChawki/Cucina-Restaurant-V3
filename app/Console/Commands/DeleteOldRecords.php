<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class DeleteOldRecords extends Command
{
    protected $signature = 'records:delete-old';
    protected $description = 'Delete old records and associated files for multiple models';

    protected $modelsConfig = [
        'App\Models\Audit' => ['period' => 'month', 'value' => 1],
        'App\Models\BL' => ['period' => 'weeks', 'value' => 2],
        'App\Models\Controle' => ['period' => 'months', 'value' => 3],
        'App\Models\CuisinierOrder' => ['period' => 'weeks', 'value' => 2],
        'App\Models\DK' => ['period' => 'weeks', 'value' => 2],
        'App\Models\Inventaire' => ['period' => 'months', 'value' => 3],
        'App\Models\Labo' => ['period' => 'weeks', 'value' => 2],
        'App\Models\Livraison' => ['period' => 'days', 'value' => 3],
        'App\Models\Menage' => ['period' => 'weeks', 'value' => 2],
    ];

    public function handle()
    {
        foreach ($this->modelsConfig as $model => $config) {
            $this->deleteOldRecords($model, $config['period'], $config['value']);
        }
    }

    protected function deleteOldRecords($model, $period, $value)
    {
        $cutoffDate = Carbon::now()->sub($period, $value);

        $query = $model::where('created_at', '<', $cutoffDate);

        $usesSoftDeletes = in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses($model));

        $recordsToDelete = $query->get();

        foreach ($recordsToDelete as $record) {
            $this->deleteAssociatedFiles($record);
            $usesSoftDeletes ? $record->forceDelete() : $record->delete();
        }

        $deletedCount = $recordsToDelete->count();

        $this->info("Deleted {$deletedCount} records from {$model}");
    }

    protected function deleteAssociatedFiles($record)
    {
        $modelName = class_basename(get_class($record));

        switch ($modelName) {
            case 'Audit':
                $this->deleteFile('public/' . $record->image);
                $this->deleteFile('public/' . $record->pdf);
                break;
            case 'BL':
                $this->deleteFile('public/bl/' . $record->pdf);
                break;
            case 'Controle':
            case 'Inventaire':
                $this->deleteFile('public/inventaire/' . $record->pdf);
                break;
            case 'CuisinierOrder':
                $this->deleteFile('public/orders/' . $record->pdf);
                break;
            case 'DK':
                $this->deleteFile('public/dk/' . $record->pdf);
                break;
            case 'Labo':
                $this->deleteFile('public/labo/' . $record->pdf);
                break;
            case 'Livraison':
                $this->deleteFile('public/livraisons/' . $record->pdf);
                break;
            case 'Menage':
                $this->deleteFile('public/menage/' . $record->pdf);
                break;
        }
    }

    protected function deleteFile($path)
    {
        if (Storage::exists($path)) {
            Storage::delete($path);
            $this->info("Deleted file: {$path}");
        }
    }
}