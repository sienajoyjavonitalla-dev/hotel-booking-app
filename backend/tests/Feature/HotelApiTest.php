<?php

namespace Tests\Feature;

use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HotelApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_hotels()
    {
        Hotel::factory()->count(3)->create();

        $response = $this->getJson('/api/hotels');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'name',
                    'address',
                    'description',
                    'rating',
                    'created_at',
                    'updated_at'
                ]
            ]);
    }

    public function test_can_get_single_hotel_with_rooms()
    {
        $hotel = Hotel::factory()->create();
        Room::factory()->count(3)->create(['hotel_id' => $hotel->id]);

        $response = $this->getJson("/api/hotels/{$hotel->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'address',
                'rooms' => [
                    '*' => [
                        'id',
                        'hotel_id',
                        'room_type',
                        'capacity',
                        'price_per_night'
                    ]
                ]
            ])
            ->assertJsonCount(3, 'rooms');
    }

    public function test_returns_404_for_nonexistent_hotel()
    {
        $response = $this->getJson('/api/hotels/999');

        $response->assertStatus(404);
    }

    public function test_can_get_hotel_rooms()
    {
        $hotel = Hotel::factory()->create();
        Room::factory()->count(5)->create(['hotel_id' => $hotel->id]);

        $response = $this->getJson("/api/hotels/{$hotel->id}/rooms");

        $response->assertStatus(200)
            ->assertJsonCount(5)
            ->assertJsonStructure([
                '*' => [
                    'id',
                    'hotel_id',
                    'room_type',
                    'capacity',
                    'price_per_night'
                ]
            ]);
    }
}
