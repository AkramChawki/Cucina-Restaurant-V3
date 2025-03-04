<?php

namespace App\Http\Controllers;

use App\Models\BML;
use App\Models\DayTotal;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BMLController extends Controller
{
    public function index()
    {
        $restaurants = Restaurant::all(['id', 'name', 'slug']);

        return Inertia::render('FluxReel/bml/BMLRestau', [
            'restaurants' => $restaurants
        ]);
    }

    public function show(Request $request, $restaurantSlug)
    {
        // Force log all incoming parameters to debug
        Log::info('BML Show Request Raw', [
            'all_parameters' => $request->all(),
            'query_string' => $request->getQueryString()
        ]);

        $restaurant = Restaurant::where('slug', $restaurantSlug)->firstOrFail();
        $currentMonth = $request->get('month', now()->month);
        $currentYear = $request->get('year', now()->year);
        $type = $request->get('type', ''); // Default to empty string

        // Convert 'null' or 'undefined' strings to actual empty string
        if ($type === 'null' || $type === 'undefined') {
            $type = '';
        }

        // Log the processed parameters for debugging
        Log::info('BML Show Request Processed', [
            'restaurant' => $restaurant->name,
            'restaurant_id' => $restaurant->id,
            'month' => $currentMonth,
            'year' => $currentYear,
            'type' => $type,
            'type_is_empty' => empty($type),
            'type_is_null' => is_null($type),
            'type_length' => strlen($type),
        ]);

        // Create query to get entries
        $query = BML::where('restaurant_id', $restaurant->id)
            ->where('month', $currentMonth)
            ->where('year', $currentYear);

        // Only apply type filter if a specific type is selected and non-empty
        if (!empty($type)) {
            Log::info('Applying type filter', ['type' => $type]);
            $query->where('type', $type);
        } else {
            Log::info('No type filter applied, showing all types');
        }

        // Add explicit ordering by date
        $query->orderBy('date', 'asc');

        $entries = $query->get();

        Log::info('BML Entries Found', [
            'count' => $entries->count(),
            'first_entry' => $entries->first() ? $entries->first()->toArray() : null,
            'types_found' => $entries->pluck('type')->unique()->toArray()
        ]);

        // Format entries for the frontend
        $existingEntries = $entries->map(function ($entry) {
            return [
                'id' => $entry->id,
                'fournisseur' => $entry->fournisseur,
                'designation' => $entry->designation,
                'quantity' => (float)$entry->quantity,
                'price' => (float)$entry->price,
                'unite' => $entry->unite,
                'date' => $entry->date->format('Y-m-d'),
                'type' => $entry->type,
                'total_ttc' => (float)$entry->total_ttc
            ];
        });

        Log::info('Mapped entries', [
            'count' => $existingEntries->count(),
            'first_entry' => $existingEntries->first()
        ]);

        return Inertia::render('FluxReel/bml/BML', [
            'restaurant' => $restaurant,
            'currentMonth' => [
                'month' => (int)$currentMonth,
                'year' => (int)$currentYear
            ],
            'existingEntries' => $existingEntries,
            'types' => BML::TYPES,
            'currentType' => $type, // Make sure to return the processed type
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'rows' => 'required|array',
            'rows.*.fournisseur' => 'required|string',
            'rows.*.designation' => 'required|string',
            'rows.*.quantity' => 'required|numeric|min:0',
            'rows.*.price' => 'required|numeric|min:0',
            'rows.*.unite' => 'required|string',
            'rows.*.date' => 'required|date',
            'rows.*.type' => 'required|string',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer',
            'day_total' => 'required|numeric|min:0'
        ]);

        // Log the request data for debugging
        Log::info('BML Store Request', [
            'restaurant_id' => $request->restaurant_id,
            'month' => $request->month,
            'year' => $request->year,
            'type' => $request->type,
            'rows_count' => count($request->rows)
        ]);

        // Start a database transaction to ensure data integrity
        DB::beginTransaction();

        try {
            // Group rows by date and type
            $rowsByDateAndType = collect($request->rows)->groupBy(function ($row) {
                // Extract month and year from the actual date
                $dateCarbon = Carbon::parse($row['date']);
                $date = $dateCarbon->format('Y-m-d');
                $type = $row['type'];
                return "{$date}|{$type}";
            });

            // Process each date and type combination separately
            foreach ($rowsByDateAndType as $dateTypeKey => $rows) {
                list($date, $type) = explode('|', $dateTypeKey);
                $dateCarbon = Carbon::parse($date);
                $day = $dateCarbon->day;
                // Use the actual month and year from the date, not the request parameters
                $month = $dateCarbon->month;
                $year = $dateCarbon->year;

                // Calculate day total for this date and type
                $dayTotal = 0;
                foreach ($rows as $row) {
                    $dayTotal += (float)$row['total_ttc'];
                }

                // First, delete existing entries for this date/type
                $deletedCount = BML::where('restaurant_id', $request->restaurant_id)
                    ->whereDate('date', $date)
                    ->where('type', $type)
                    ->delete();

                // Log deletion
                Log::info('Deleted existing BML entries', [
                    'restaurant_id' => $request->restaurant_id,
                    'date' => $date,
                    'type' => $type,
                    'deleted_count' => $deletedCount
                ]);

                // Create new entries
                $createdRows = [];
                foreach ($rows as $row) {
                    $newEntry = BML::create([
                        'restaurant_id' => $request->restaurant_id,
                        'fournisseur' => $row['fournisseur'],
                        'designation' => $row['designation'],
                        'quantity' => $row['quantity'],
                        'price' => $row['price'],
                        'unite' => $row['unite'],
                        'date' => $row['date'],
                        'type' => $row['type'],
                        'total_ttc' => $row['total_ttc'],
                        'month' => $month,  // Use actual month from date
                        'year' => $year,    // Use actual year from date
                    ]);
                    $createdRows[] = $newEntry->id;
                }

                Log::info('Created new BML entries', [
                    'count' => count($createdRows),
                    'ids' => $createdRows,
                    'actual_month' => $month,
                    'actual_year' => $year
                ]);

                // Update the daily total for this specific day and type
                $this->updateDayTotal(
                    $request->restaurant_id,
                    $day,
                    $month,  // Use actual month
                    $year,   // Use actual year
                    $type,
                    $dayTotal
                );
            }

            // Commit transaction if everything succeeded
            DB::commit();

            return redirect()->back()->with('success', 'BML enregistré avec succès');
        } catch (\Exception $e) {
            // If anything fails, rollback the transaction
            DB::rollBack();

            Log::error('Error storing BML data', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Une erreur est survenue lors de l\'enregistrement');
        }
    }

    /**
     * Update or create a day total record
     */
    private function updateDayTotal($restaurantId, $day, $month, $year, $type, $total)
    {
        // Format the type for day_totals table
        $dayTotalType = 'bml_' . $type;

        // Get current day total if it exists
        $dayTotalRecord = DayTotal::updateOrCreate(
            [
                'restaurant_id' => $restaurantId,
                'day' => $day,
                'month' => $month,
                'year' => $year,
                'type' => $dayTotalType
            ],
            ['total' => $total]
        );

        // Log day total update
        Log::info('Updated day total', [
            'id' => $dayTotalRecord->id,
            'restaurant_id' => $restaurantId,
            'day' => $day,
            'month' => $month,
            'year' => $year,
            'type' => $dayTotalType,
            'total' => $total
        ]);

        return $dayTotalRecord;
    }
}
