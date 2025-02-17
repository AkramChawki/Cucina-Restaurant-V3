<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cost_cuisines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained('cuisinier_products')->onDelete('cascade');
            $table->integer('month');
            $table->integer('year');
            $table->json('daily_data');
            $table->timestamps();
            $table->unique(['restaurant_id', 'product_id', 'month', 'year']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('cost_cuisines');
    }
};