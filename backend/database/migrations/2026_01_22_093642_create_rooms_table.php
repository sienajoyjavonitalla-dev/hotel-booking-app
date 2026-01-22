<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
            $table->string('room_type'); // Single, Double, Suite, etc.
            $table->integer('capacity'); // Number of guests
            $table->decimal('price_per_night', 10, 2);
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->boolean('availability')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};