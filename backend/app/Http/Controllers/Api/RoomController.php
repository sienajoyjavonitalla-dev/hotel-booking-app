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
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in'
        ]);

        $room = Room::findOrFail($request->room_id);
        
        // Calculate total nights (exclude check-out date since guest leaves that day)
        $checkInDate = \Carbon\Carbon::parse($request->check_in);
        $checkOutDate = \Carbon\Carbon::parse($request->check_out);
        // Cast to int to avoid strict-comparison issues like 1 (int) vs 1.0 (float)
        $totalDays = (int) $checkInDate->diffInDays($checkOutDate);
        
        // Check if room is available for all nights (from check-in to check-out, excluding check-out date)
        // Guest needs room on check-in date but not on check-out date (they leave that morning)
        $availabilityCount = $room->roomAvailability()
            ->where('date', '>=', $request->check_in)
            ->where('date', '<', $request->check_out) // Exclude check-out date
            ->where('is_available', true)
            ->count();
        
        $response = [
            // Strict compare is OK now because both are ints
            'available' => $availabilityCount === $totalDays,
            'room_id' => $request->room_id,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'availability_count' => $availabilityCount,
            'total_days' => $totalDays
        ];
            
        return response()->json($response);
    }
}