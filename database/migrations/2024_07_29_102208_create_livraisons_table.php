<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('livraisons', function (Blueprint $table) {
            $table->unsignedTinyInteger('type')->after('date');
            $table->string('pdf_url')->nullable()->after('data');
        });
    }

    public function down()
    {
        Schema::table('livraisons', function (Blueprint $table) {
            $table->dropColumn(['type', 'pdf_url']);
        });
    }
};