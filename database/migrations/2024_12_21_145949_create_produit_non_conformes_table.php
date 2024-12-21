<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produit_non_conformes', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->date("date");
            $table->string("restau");
            $table->string("type"); // cuisinier ou pizzaiolo
            $table->string("produit");
            $table->date("date_production");
            $table->string("probleme"); // probleme lie au produit
            $table->string("pdf");
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produit_non_conformes');
    }
};