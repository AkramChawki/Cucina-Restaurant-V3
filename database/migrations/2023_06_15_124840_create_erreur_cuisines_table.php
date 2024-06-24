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
        Schema::create('erreur_cuisines', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("restau");
            $table->string("date");
            $table->string("produit");
            $table->string("entite");
            $table->string("plat");
            $table->string("motif");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('erreur_cuisines');
    }
};
