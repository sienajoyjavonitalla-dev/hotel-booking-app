<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\RoomAvailability;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class RoomAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $rooms = Room::all();
        $startDate = Carbon::now();
        $endDate = Carbon::now()->addMonths(6); // 6 months ahead

        foreach ($rooms as $room) {
            $currentDate = $startDate->copy();
            
            while ($currentDate <= $endDate) {
                RoomAvailability::create([
                    'room_id' => $room->id,
                    'date' => $currentDate->format('Y-m-d'),
                    'is_available' => true,
                    'booking_id' => null
                ]);
                
                $currentDate->addDay();
            }
        }
    }
}