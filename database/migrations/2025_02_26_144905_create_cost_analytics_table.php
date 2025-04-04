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
        Schema::create('cost_analytics', function (Blueprint $table) {
            $table->unsignedBigInteger('restaurant_id');
            $table->integer('day');
            $table->integer('month');
            $table->integer('year');
            $table->string('type'); // 'FC' or 'CC'
            $table->decimal('amount', 10, 2)->default(0);
            $table->decimal('cumul', 10, 2)->default(0);
            $table->decimal('revenue', 10, 2)->default(0);
            $table->decimal('cumul_revenue', 10, 2)->default(0);
            $table->decimal('percentage', 10, 2)->default(0)->nullable();
            $table->timestamps();

            // Add a unique constraint to prevent duplicates
            $table->unique(['restaurant_id', 'day', 'month', 'year', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cost_analytics');
    }
};
