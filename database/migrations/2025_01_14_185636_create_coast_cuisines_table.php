// database/migrations/[timestamp]_create_coast_cuisines_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('coast_cuisines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained('cuisinier_products')->onDelete('cascade');
            $table->integer('month');
            $table->integer('year');
            $table->integer('day');
            $table->float('value')->default(0);
            $table->timestamps();
            
            $table->unique(['restaurant_id', 'product_id', 'month', 'year', 'day']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('coast_cuisines');
    }
};