<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\RoomAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
            'guest_name' => 'required|string|max:255',
            'guest_email' => 'required|email|max:255',
            'guest_phone' => 'required|string|max:20',
            'total_amount' => 'required|numeric|min:0'
        ]);

        // Check room availability
        $availabilityCount = RoomAvailability::where('room_id', $request->room_id)
            ->whereBetween('date', [$request->check_in, $request->check_out])
            ->where('is_available', true)
            ->count();
            
        $totalDays = \Carbon\Carbon::parse($request->check_in)
            ->diffInDays(\Carbon\Carbon::parse($request->check_out));
            
        if ($availabilityCount !== $totalDays) {
            return response()->json(['error' => 'Room not available for selected dates'], 422);
        }

        DB::transaction(function () use ($request) {
            // Create booking
            $booking = Booking::create($request->all());
            
            // Mark dates as unavailable
            RoomAvailability::where('room_id', $request->room_id)
                ->whereBetween('date', [$request->check_in, $request->check_out])
                ->update(['is_available' => false, 'booking_id' => $booking->id]);
        });

        return response()->json(['message' => 'Booking created successfully'], 201);
    }

    public function show(Booking $booking)
    {
        return $booking->load(['hotel', 'room']);
    }
}