<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained();
            $table->foreignId('room_id')->constrained();
            $table->date('check_in');
            $table->date('check_out');
            $table->string('guest_name');
            $table->string('guest_email');
            $table->string('guest_phone');
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending_payment', 'confirmed', 'cancelled'])->default('pending_payment');
            $table->enum('payment_status', ['unpaid', 'paid', 'failed', 'refunded'])->default('unpaid');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};