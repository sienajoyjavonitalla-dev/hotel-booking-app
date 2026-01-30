<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;

class HotelController extends Controller
{
    /**
     * List all hotels. Returns sample data if database is unavailable or empty.
     */
    public function index(): JsonResponse|array
    {
        try {
            $hotels = Hotel::all();
            if ($hotels->isEmpty()) {
                return response()->json(SampleData::hotels());
            }
            return $hotels;
        } catch (\Throwable $e) {
            return response()->json(SampleData::hotels());
        }
    }

    /**
     * Show a hotel with rooms. Returns sample data if database is unavailable.
     * Uses route param name {hotel} but resolved as id (no model binding) so we can fallback when DB fails.
     */
    public function show(int $hotel): JsonResponse|array
    {
        try {
            $model = Hotel::with('rooms')->findOrFail($hotel);
            return $model;
        } catch (\Throwable $e) {
            return response()->json(SampleData::hotelWithRooms($hotel));
        }
    }

    /**
     * Get rooms for a hotel. Returns sample rooms if database is unavailable.
     */
    public function getRooms(int $hotel): JsonResponse|array
    {
        try {
            $model = Hotel::findOrFail($hotel);
            return $model->rooms;
        } catch (\Throwable $e) {
            return response()->json(SampleData::rooms($hotel));
        }
    }
}