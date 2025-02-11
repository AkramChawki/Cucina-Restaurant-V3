<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('infractions', function (Blueprint $table) {
            $table->id();
            $table->string('restaurant');
            $table->text('infraction_constatee');
            $table->string('poste');
            $table->foreignId('employe_id')->constrained();
            $table->string('photo_path')->nullable();
            $table->date('infraction_date');
            $table->time('infraction_time');
            $table->string('pdf')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('infractions');
    }
};