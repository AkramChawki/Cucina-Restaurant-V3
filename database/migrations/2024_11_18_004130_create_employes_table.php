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
        Schema::create('employes', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('DDN');
            $table->string('telephone');
            $table->string('address');
            $table->string('city');
            $table->string('country');
            $table->enum('marital_status', ['single', 'married', 'other']);
            $table->string('username')->unique();
            $table->string('profile_photo')->nullable();
            $table->string('id_card_front');
            $table->string('id_card_back');
            $table->string('restau');
            $table->date('embauche');
            $table->date('depart')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employes');
    }
};
