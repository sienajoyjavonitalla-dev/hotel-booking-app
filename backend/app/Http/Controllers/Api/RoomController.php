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
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in'
        ]);

        $room = Room::findOrFail($request->room_id);

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
        // Otherwise require a row for every night with is_available = true
        $hasAnyAvailabilityRows = $room->roomAvailability()
            ->where('date', '>=', $request->check_in)
            ->where('date', '<', $request->check_out)
            ->exists();

        $available = $hasAnyAvailabilityRows
            ? ($availabilityCount === $totalDays)
            : true;

        $response = [
            'available' => $available,
            'room_id' => $request->room_id,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'availability_count' => $availabilityCount,
            'total_days' => $totalDays
        ];

        return response()->json($response);
    }
}