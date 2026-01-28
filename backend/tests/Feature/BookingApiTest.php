<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Room;
use App\Models\RoomAvailability;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_booking()
    {
        $hotel = Hotel::factory()->create();
        $room = Room::factory()->create(['hotel_id' => $hotel->id]);

        $checkIn = Carbon::today()->addDays(10)->format('Y-m-d');
        $checkOut = Carbon::today()->addDays(12)->format('Y-m-d');

        // Create availability
        for ($date = Carbon::parse($checkIn); $date < Carbon::parse($checkOut); $date->addDay()) {
            RoomAvailability::create([
                'room_id' => $room->id,
                'date' => $date->format('Y-m-d'),
                'is_available' => true
            ]);
        }

        $bookingData = [
            'hotel_id' => $hotel->id,
            'room_id' => $room->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'guest_name' => 'John Doe',
            'guest_email' => 'john@example.com',
            'guest_phone' => '1234567890',
            'total_amount' => 200.00,
            'status' => 'confirmed',
            'payment_status' => 'paid'
        ];

        $response = $this->postJson('/api/bookings', $bookingData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'id',
                'hotel_id',
                'room_id',
                'check_in',
                'check_out',
                'guest_name',
                'guest_email',
                'total_amount',
                'status',
                'payment_status'
            ])
            ->assertJson([
                'guest_name' => 'John Doe',
                'guest_email' => 'john@example.com',
                'status' => 'confirmed',
                'payment_status' => 'paid'
            ]);

        $this->assertDatabaseHas('bookings', [
            'guest_email' => 'john@example.com',
            'status' => 'confirmed'
        ]);
    }

    public function test_can_get_booking_by_id()
    {
        $hotel = Hotel::factory()->create();
        $room = Room::factory()->create(['hotel_id' => $hotel->id]);

        $booking = Booking::factory()->create([
            'hotel_id' => $hotel->id,
            'room_id' => $room->id
        ]);

        $response = $this->getJson("/api/bookings/{$booking->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $booking->id,
                'hotel_id' => $hotel->id,
                'room_id' => $room->id
            ]);
    }

    public function test_returns_404_for_nonexistent_booking()
    {
        $response = $this->getJson('/api/bookings/999');

        $response->assertStatus(404);
    }

    public function test_booking_validation_requires_all_fields()
    {
        $response = $this->postJson('/api/bookings', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'hotel_id',
                'room_id',
                'check_in',
                'check_out',
                'guest_name',
                'guest_email',
                'guest_phone',
                'total_amount'
            ]);
    }

    public function test_booking_validation_requires_valid_email()
    {
        $hotel = Hotel::factory()->create();
        $room = Room::factory()->create(['hotel_id' => $hotel->id]);

        $bookingData = [
            'hotel_id' => $hotel->id,
            'room_id' => $room->id,
            'check_in' => Carbon::today()->addDays(10)->format('Y-m-d'),
            'check_out' => Carbon::today()->addDays(12)->format('Y-m-d'),
            'guest_name' => 'John Doe',
            'guest_email' => 'invalid-email',
            'guest_phone' => '1234567890',
            'total_amount' => 200.00
        ];

        $response = $this->postJson('/api/bookings', $bookingData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['guest_email']);
    }
}
