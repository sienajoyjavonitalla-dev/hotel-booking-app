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
        
        // Check if room is available for the entire date range
        $availabilityCount = $room->roomAvailability()
            ->whereBetween('date', [$request->check_in, $request->check_out])
            ->where('is_available', true)
            ->count();
            
        $totalDays = \Carbon\Carbon::parse($request->check_in)
            ->diffInDays(\Carbon\Carbon::parse($request->check_out));
            
        return response()->json([
            'available' => $availabilityCount === $totalDays,
            'room_id' => $request->room_id,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out
        ]);
    }
}