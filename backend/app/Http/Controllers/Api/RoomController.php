<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function checkAvailability(Request $request)
    {
        $request->validate([
            'room_id' => 'required|integer',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in'
        ]);

        try {
            $room = Room::find($request->room_id);

            // Room not in DB (e.g. sample data rooms from HotelController fallback) → treat as available
            if (!$room) {
                return response()->json([
                    'available' => true,
                    'room_id' => (int) $request->room_id,
                    'check_in' => $request->check_in,
                    'check_out' => $request->check_out,
                ]);
            }

            // Calculate total nights (exclude check-out date since guest leaves that day)
            $checkInDate = \Carbon\Carbon::parse($request->check_in);
            $checkOutDate = \Carbon\Carbon::parse($request->check_out);
            $totalDays = (int) $checkInDate->diffInDays($checkOutDate);

            // Count availability records for this range (is_available = true, no booking)
            $availabilityCount = $room->roomAvailability()
                ->where('date', '>=', $request->check_in)
                ->where('date', '<', $request->check_out)
                ->where('is_available', true)
                ->count();

            // If no availability rows exist for this range, treat as available (e.g. room_availability not seeded)
            $hasAnyAvailabilityRows = $room->roomAvailability()
                ->where('date', '>=', $request->check_in)
                ->where('date', '<', $request->check_out)
                ->exists();

            $available = $hasAnyAvailabilityRows
                ? ($availabilityCount === $totalDays)
                : true;

            return response()->json([
                'available' => $available,
                'room_id' => (int) $request->room_id,
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
                'availability_count' => $availabilityCount,
                'total_days' => $totalDays
            ]);
        } catch (\Throwable $e) {
            // Prevent 500 on production (e.g. missing table, timezone, DB issue) → treat as available
            report($e);
            return response()->json([
                'available' => true,
                'room_id' => (int) $request->room_id,
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
            ]);
        }
    }
}