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
        Schema::create('fiche_cuisinier_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cuisinier_product_id')
                ->constrained();
            $table->foreignId('fiche_id')
                ->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fiche_cuisinier_product');
    }
};
