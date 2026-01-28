<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        $checkIn = Carbon::today()->addDays(fake()->numberBetween(1, 30));
        $checkOut = $checkIn->copy()->addDays(fake()->numberBetween(1, 7));
        
        return [
            'hotel_id' => Hotel::factory(),
            'room_id' => Room::factory(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'guest_name' => fake()->name(),
            'guest_email' => fake()->email(),
            'guest_phone' => fake()->phoneNumber(),
            'total_amount' => fake()->randomFloat(2, 100, 2000),
            'status' => fake()->randomElement(['pending_payment', 'confirmed', 'cancelled']),
            'payment_status' => fake()->randomElement(['unpaid', 'paid', 'failed', 'refunded']),
        ];
    }
}
