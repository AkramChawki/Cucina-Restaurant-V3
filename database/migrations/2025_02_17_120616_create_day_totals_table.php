<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('day_totals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained();
            $table->integer('day');
            $table->integer('month');
            $table->integer('year');
            $table->decimal('total', 10, 2);
            $table->string('type');  // Add type field
            $table->timestamps();

            // Updated unique constraint to include type
            $table->unique(['restaurant_id', 'day', 'month', 'year', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('day_totals');
    }
};
