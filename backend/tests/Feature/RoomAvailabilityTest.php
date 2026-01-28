<?php

namespace Tests\Feature;

use App\Models\Hotel;
use App\Models\Room;
use App\Models\RoomAvailability;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomAvailabilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_room_available_when_all_dates_available()
    {
        $hotel = Hotel::factory()->create();
        $room = Room::factory()->create(['hotel_id' => $hotel->id]);

        $checkIn = Carbon::today()->addDays(10)->format('Y-m-d');
        $checkOut = Carbon::today()->addDays(12)->format('Y-m-d');

        // Create availability for all dates
        for ($date = Carbon::parse($checkIn); $date < Carbon::parse($checkOut); $date->addDay()) {
            RoomAvailability::create([
                'room_id' => $room->id,
                'date' => $date->format('Y-m-d'),
                'is_available' => true
            ]);
        }

        $response = $this->getJson('/api/rooms/availability', [
            'room_id' => $room->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'available' => true,
                'room_id' => (string)$room->id
            ]);
    }

    public function test_room_unavailable_when_some_dates_unavailable()
    {
        $hotel = Hotel::factory()->create();
        $room = Room::factory()->create(['hotel_id' => $hotel->id]);

        $checkIn = Carbon::today()->addDays(10)->format('Y-m-d');
        $checkOut = Carbon::today()->addDays(13)->format('Y-m-d');

        // Create availability for some dates, but make one unavailable
        $dates = [];
        for ($date = Carbon::parse($checkIn); $date < Carbon::parse($checkOut); $date->addDay()) {
            $dates[] = $date->format('Y-m-d');
            RoomAvailability::create([
                'room_id' => $room->id,
                'date' => $date->format('Y-m-d'),
                'is_available' => $date->format('Y-m-d') !== $dates[1] // Make second date unavailable
            ]);
        }

        $response = $this->getJson('/api/rooms/availability', [
            'room_id' => $room->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'available' => false,
                'room_id' => (string)$room->id
            ]);
    }

    public function test_room_availability_excludes_checkout_date()
    {
        $hotel = Hotel::factory()->create();
        $room = Room::factory()->create(['hotel_id' => $hotel->id]);

        $checkIn = Carbon::today()->addDays(10)->format('Y-m-d');
        $checkOut = Carbon::today()->addDays(11)->format('Y-m-d'); // 1 night stay

        // Only create availability for check-in date (not check-out)
        RoomAvailability::create([
            'room_id' => $room->id,
            'date' => $checkIn,
            'is_available' => true
        ]);

        $response = $this->getJson('/api/rooms/availability', [
            'room_id' => $room->id,
            'check_in' => $checkIn,
            'check_out' => $checkOut
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'available' => true, // Should be available because we only need check-in date
                'room_id' => (string)$room->id
            ]);
    }

    public function test_room_availability_validation_requires_room_id()
    {
        $response = $this->getJson('/api/rooms/availability', [
            'check_in' => Carbon::today()->addDays(10)->format('Y-m-d'),
            'check_out' => Carbon::today()->addDays(12)->format('Y-m-d')
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['room_id']);
    }

    public function test_room_availability_validation_requires_valid_dates()
    {
        $room = Room::factory()->create();

        $response = $this->getJson('/api/rooms/availability', [
            'room_id' => $room->id,
            'check_in' => Carbon::yesterday()->format('Y-m-d'), // Past date
            'check_out' => Carbon::today()->addDays(5)->format('Y-m-d')
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['check_in']);
    }

    public function test_room_availability_validation_checkout_after_checkin()
    {
        $room = Room::factory()->create();

        $response = $this->getJson('/api/rooms/availability', [
            'room_id' => $room->id,
            'check_in' => Carbon::today()->addDays(10)->format('Y-m-d'),
            'check_out' => Carbon::today()->addDays(5)->format('Y-m-d') // Before check-in
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['check_out']);
    }
}
