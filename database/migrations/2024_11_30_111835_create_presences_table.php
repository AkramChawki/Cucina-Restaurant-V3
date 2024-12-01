<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('presences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employe_id')->constrained()->onDelete('cascade');
            $table->integer('month');
            $table->integer('year');
            $table->json('attendance_data');
            $table->integer('jours')->nullable();
            $table->timestamps();
            $table->unique(['employe_id', 'month', 'year']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('presences');
    }
};