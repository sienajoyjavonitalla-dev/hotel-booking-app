<?php

namespace Database\Factories;

use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition(): array
    {
        $roomTypes = ['Single', 'Double', 'Suite', 'Deluxe', 'Standard'];
        
        return [
            'hotel_id' => Hotel::factory(),
            'room_type' => fake()->randomElement($roomTypes),
            'capacity' => fake()->numberBetween(1, 4),
            'price_per_night' => fake()->randomFloat(2, 50, 500),
            'amenities' => fake()->randomElements(['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'], 3),
            'images' => [fake()->imageUrl()],
            'availability' => true,
        ];
    }
}
