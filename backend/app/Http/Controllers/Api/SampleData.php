<?php

namespace App\Http\Controllers\Api;

class SampleData
{
    /**
     * Sample hotels returned when database is unavailable or empty.
     */
    public static function hotels(): array
    {
        $now = now()->toIso8601String();
        return [
            [
                'id' => 1,
                'name' => 'Grand Plaza Hotel',
                'address' => '123 Main Street, Downtown City, ST 12345',
                'description' => 'Luxury hotel in the heart of downtown with modern amenities and exceptional service.',
                'images' => ['hotel1.jpg', 'hotel2.jpg'],
                'amenities' => ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Room Service'],
                'rating' => 4.5,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'name' => 'Seaside Resort',
                'address' => '456 Beach Avenue, Coastal Town, ST 67890',
                'description' => 'Beautiful beachfront resort with ocean views and relaxing atmosphere.',
                'images' => ['hotel3.jpg', 'hotel4.jpg'],
                'amenities' => ['WiFi', 'Beach Access', 'Pool', 'Spa', 'Restaurant'],
                'rating' => 4.8,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'name' => 'Mountain View Lodge',
                'address' => '789 Mountain Road, Scenic Valley, ST 54321',
                'description' => 'Cozy mountain lodge with breathtaking views and rustic charm.',
                'images' => ['hotel5.jpg', 'hotel6.jpg'],
                'amenities' => ['WiFi', 'Fireplace', 'Hiking Trails', 'Restaurant'],
                'rating' => 4.3,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 4,
                'name' => 'Ayah Lodge',
                'address' => 'Philippines, Baguio City, Ayala Avenue',
                'description' => 'Cozy mountain lodge with breathtaking views and rustic charm.',
                'images' => ['hotel5.jpg', 'hotel6.jpg'],
                'amenities' => ['WiFi', 'Fireplace', 'Hiking Trails', 'Restaurant'],
                'rating' => 4.3,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];
    }

    /**
     * Sample rooms for a hotel (when database is unavailable or empty).
     */
    public static function rooms(int $hotelId = 1): array
    {
        $now = now()->toIso8601String();
        $rooms = [
            1 => [
                ['id' => 1, 'hotel_id' => 1, 'room_type' => 'Single', 'capacity' => 1, 'price_per_night' => 100.00, 'amenities' => ['WiFi', 'TV', 'Air Conditioning'], 'images' => ['room1.jpg'], 'availability' => true],
                ['id' => 2, 'hotel_id' => 1, 'room_type' => 'Double', 'capacity' => 2, 'price_per_night' => 150.00, 'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'], 'images' => ['room2.jpg'], 'availability' => true],
                ['id' => 3, 'hotel_id' => 1, 'room_type' => 'Suite', 'capacity' => 4, 'price_per_night' => 300.00, 'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'], 'images' => ['room3.jpg'], 'availability' => true],
            ],
            2 => [
                ['id' => 4, 'hotel_id' => 2, 'room_type' => 'Standard', 'capacity' => 2, 'price_per_night' => 180.00, 'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Ocean View'], 'images' => ['room4.jpg'], 'availability' => true],
                ['id' => 5, 'hotel_id' => 2, 'room_type' => 'Deluxe', 'capacity' => 2, 'price_per_night' => 250.00, 'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Ocean View', 'Balcony'], 'images' => ['room5.jpg'], 'availability' => true],
            ],
            3 => [
                ['id' => 6, 'hotel_id' => 3, 'room_type' => 'Cabin', 'capacity' => 2, 'price_per_night' => 120.00, 'amenities' => ['WiFi', 'Fireplace', 'Mountain View'], 'images' => ['room6.jpg'], 'availability' => true],
                ['id' => 7, 'hotel_id' => 3, 'room_type' => 'Lodge Room', 'capacity' => 4, 'price_per_night' => 200.00, 'amenities' => ['WiFi', 'Fireplace', 'Mountain View', 'Kitchen'], 'images' => ['room7.jpg'], 'availability' => true],
            ],
        ];

        $list = $rooms[$hotelId] ?? $rooms[1];
        return array_map(function ($r) use ($now) {
            $r['created_at'] = $now;
            $r['updated_at'] = $now;
            return $r;
        }, $list);
    }

    /**
     * Single hotel with rooms (for show endpoint).
     */
    public static function hotelWithRooms(int $id): array
    {
        $hotels = static::hotels();
        $hotel = collect($hotels)->firstWhere('id', $id) ?? $hotels[0];
        $hotel['rooms'] = static::rooms((int) $hotel['id']);
        return $hotel;
    }
}
