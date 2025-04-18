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
        Schema::create('thermal_receipts', function (Blueprint $table) {
            $table->id();
            $table->uuid('receipt_id')->unique();
            $table->string('restaurant');
            $table->json('data');
            $table->boolean('printed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thermal_receipts');
    }
};
