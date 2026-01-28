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

        // Calculate total nights (exclude check-out date since guest leaves that day)
        $checkInDate = \Carbon\Carbon::parse($request->check_in);
        $checkOutDate = \Carbon\Carbon::parse($request->check_out);
        // Cast to int to avoid strict-comparison issues
        $totalDays = (int) $checkInDate->diffInDays($checkOutDate);
        
        // Check room availability (exclude check-out date)
        // Guest needs room on check-in date but not on check-out date (they leave that morning)
        $availabilityCount = RoomAvailability::where('room_id', $request->room_id)
            ->where('date', '>=', $request->check_in)
            ->where('date', '<', $request->check_out) // Exclude check-out date
            ->where('is_available', true)
            ->count();
            
        if ($availabilityCount !== $totalDays) {
            return response()->json(['error' => 'Room not available for selected dates'], 422);
        }

        $booking = DB::transaction(function () use ($request) {
            // Create booking
            $booking = Booking::create($request->all());
            
            // Mark dates as unavailable (exclude check-out date)
            RoomAvailability::where('room_id', $request->room_id)
                ->where('date', '>=', $request->check_in)
                ->where('date', '<', $request->check_out) // Exclude check-out date
                ->update(['is_available' => false, 'booking_id' => $booking->id]);
            
            // Return booking with relationships loaded
            return $booking->load(['hotel', 'room']);
        });

        return response()->json($booking, 201);
    }

    public function show(Booking $booking)
    {
        return $booking->load(['hotel', 'room']);
    }
}