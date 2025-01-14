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
        Schema::create('cloture_caisses', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("restau");
            $table->string("date");
            $table->string("time");
            $table->string("responsable");
            $table->float("montant");
            $table->float("montantE")->nullable();
            $table->float("cartebancaire")->nullable();
            $table->float("cartebancaireLivraison")->nullable();
            $table->float("virement")->nullable();
            $table->float("cheque")->nullable();
            $table->float("compensation")->nullable();
            $table->float("familleAcc")->nullable();
            $table->float("erreurPizza")->nullable();
            $table->float("erreurCuisine")->nullable();
            $table->float("erreurServeur")->nullable();
            $table->float("erreurCaisse")->nullable();
            $table->float("giveawayPizza")->nullable();
            $table->float("giveawayPasta")->nullable();
            $table->float("glovoC")->nullable();
            $table->float("glovoE")->nullable();
            $table->float("appE")->nullable();
            $table->float("appC")->nullable();
            $table->float("shooting")->nullable();
            $table->float("ComGlovo")->nullable();
            $table->string("signature");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cloture_caisses');
    }
};
