<?php

namespace Tests\Feature;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\RoomAvailability;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingFlowIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_complete_booking_flow()
    {
        // Step 1: Create hotel and room
        $hotel = Hotel::factory()->create();
        $room = Room::factory()->create([
            'hotel_id' => $hotel->id,
            'price_per_night' => 100.00
        ]);

        // Step 2: Set check-in and check-out dates
        $checkIn = Carbon::today()->addDays(10)->format('Y-m-d');
        $checkOut = Carbon::today()->addDays(13)->format('Y-m-d'); // 3 nights

        // Step 3: Create room availability for the dates
        for ($date = Carbon::parse($checkIn); $date < Carbon::parse($checkOut); $date->addDay()) {
            RoomAvailability::create([
                'room_id' => $room->id,
                'date' => $date->format('Y-m-d'),
                'is_available' => true
            ]);
        }

        // Step 4: Check room availability
        $availabilityResponse = $this->getJson('/api/rooms/availability', [
            'room_id' => $room->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut
        ]);

        $availabilityResponse->assertStatus(200)
            ->assertJson(['available' => true]);

        // Step 5: Create booking
        $bookingData = [
            'hotel_id' => $hotel->id,
            'room_id' => $room->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'guest_name' => 'John Doe',
            'guest_email' => 'john@example.com',
            'guest_phone' => '1234567890',
            'total_amount' => 300.00, // 3 nights * 100
            'status' => 'confirmed',
            'payment_status' => 'paid'
        ];

        $bookingResponse = $this->postJson('/api/bookings', $bookingData);

        $bookingResponse->assertStatus(201)
            ->assertJson([
                'guest_name' => 'John Doe',
                'total_amount' => '300.00',
                'status' => 'confirmed',
                'payment_status' => 'paid'
            ]);

        $bookingId = $bookingResponse->json('id');

        // Step 6: Retrieve booking confirmation
        $confirmationResponse = $this->getJson("/api/bookings/{$bookingId}");

        $confirmationResponse->assertStatus(200)
            ->assertJson([
                'id' => $bookingId,
                'guest_name' => 'John Doe',
                'status' => 'confirmed'
            ]);

        // Verify booking exists in database
        $this->assertDatabaseHas('bookings', [
            'id' => $bookingId,
            'guest_email' => 'john@example.com',
            'status' => 'confirmed'
        ]);
    }

    public function test_booking_fails_when_room_unavailable()
    {
        $hotel = Hotel::factory()->create();
        $room = Room::factory()->create(['hotel_id' => $hotel->id]);

        $checkIn = Carbon::today()->addDays(10)->format('Y-m-d');
        $checkOut = Carbon::today()->addDays(13)->format('Y-m-d');

        // Create availability but make one date unavailable
        $dates = [];
        for ($date = Carbon::parse($checkIn); $date < Carbon::parse($checkOut); $date->addDay()) {
            $dates[] = $date->format('Y-m-d');
            RoomAvailability::create([
                'room_id' => $room->id,
                'date' => $date->format('Y-m-d'),
                'is_available' => $date->format('Y-m-d') !== $dates[1] // Make second date unavailable
            ]);
        }

        // Check availability should return false
        $availabilityResponse = $this->getJson('/api/rooms/availability', [
            'room_id' => $room->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut
        ]);

        $availabilityResponse->assertStatus(200)
            ->assertJson(['available' => false]);
    }
}
