<?php

namespace Database\Seeders;

use App\Models\Hotel;
use Illuminate\Database\Seeder;

class HotelSeeder extends Seeder
{
    public function run(): void
    {
        Hotel::create([
            'name' => 'Grand Plaza Hotel',
            'address' => '123 Main Street, Downtown City, ST 12345',
            'description' => 'Luxury hotel in the heart of downtown with modern amenities and exceptional service.',
            'images' => ['hotel1.jpg', 'hotel2.jpg'],
            'amenities' => ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Room Service'],
            'rating' => 4.5
        ]);

        Hotel::create([
            'name' => 'Seaside Resort',
            'address' => '456 Beach Avenue, Coastal Town, ST 67890',
            'description' => 'Beautiful beachfront resort with ocean views and relaxing atmosphere.',
            'images' => ['hotel3.jpg', 'hotel4.jpg'],
            'amenities' => ['WiFi', 'Beach Access', 'Pool', 'Spa', 'Restaurant'],
            'rating' => 4.8
        ]);

        Hotel::create([
            'name' => 'Mountain View Lodge',
            'address' => '789 Mountain Road, Scenic Valley, ST 54321',
            'description' => 'Cozy mountain lodge with breathtaking views and rustic charm.',
            'images' => ['hotel5.jpg', 'hotel6.jpg'],
            'amenities' => ['WiFi', 'Fireplace', 'Hiking Trails', 'Restaurant'],
            'rating' => 4.3
        ]);
    }
}