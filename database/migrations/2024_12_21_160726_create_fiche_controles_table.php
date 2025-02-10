<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fiche_controles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('date');
            $table->string('restau')->nullable();
            $table->enum('type', ['hygiene', 'patrimoine', 'prestataires', 'travaux', 'maintenance_preventive']);
            $table->json('data');
            $table->string('pdf')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fiche_controles');
    }
};