<?php

namespace Database\Factories;

use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hotel>
 */
class HotelFactory extends Factory
{
    protected $model = Hotel::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' Hotel',
            'address' => fake()->address(),
            'description' => fake()->paragraph(),
            'images' => [fake()->imageUrl(), fake()->imageUrl()],
            'amenities' => fake()->randomElements(['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Room Service'], 3),
            'rating' => fake()->randomFloat(1, 3.0, 5.0),
        ];
    }
}
