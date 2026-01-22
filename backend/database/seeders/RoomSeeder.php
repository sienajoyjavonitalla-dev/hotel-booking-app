<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        // Hotel 1 rooms
        Room::create([
            'hotel_id' => 1,
            'room_type' => 'Single',
            'capacity' => 1,
            'price_per_night' => 100.00,
            'amenities' => ['WiFi', 'TV', 'Air Conditioning'],
            'images' => ['room1.jpg'],
            'availability' => true
        ]);

        Room::create([
            'hotel_id' => 1,
            'room_type' => 'Double',
            'capacity' => 2,
            'price_per_night' => 150.00,
            'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
            'images' => ['room2.jpg'],
            'availability' => true
        ]);

        Room::create([
            'hotel_id' => 1,
            'room_type' => 'Suite',
            'capacity' => 4,
            'price_per_night' => 300.00,
            'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'],
            'images' => ['room3.jpg'],
            'availability' => true
        ]);

        // Hotel 2 rooms
        Room::create([
            'hotel_id' => 2,
            'room_type' => 'Standard',
            'capacity' => 2,
            'price_per_night' => 180.00,
            'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Ocean View'],
            'images' => ['room4.jpg'],
            'availability' => true
        ]);

        Room::create([
            'hotel_id' => 2,
            'room_type' => 'Deluxe',
            'capacity' => 2,
            'price_per_night' => 250.00,
            'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Ocean View', 'Balcony'],
            'images' => ['room5.jpg'],
            'availability' => true
        ]);

        // Hotel 3 rooms
        Room::create([
            'hotel_id' => 3,
            'room_type' => 'Cabin',
            'capacity' => 2,
            'price_per_night' => 120.00,
            'amenities' => ['WiFi', 'Fireplace', 'Mountain View'],
            'images' => ['room6.jpg'],
            'availability' => true
        ]);

        Room::create([
            'hotel_id' => 3,
            'room_type' => 'Lodge Room',
            'capacity' => 4,
            'price_per_night' => 200.00,
            'amenities' => ['WiFi', 'Fireplace', 'Mountain View', 'Kitchen'],
            'images' => ['room7.jpg'],
            'availability' => true
        ]);
    }
}