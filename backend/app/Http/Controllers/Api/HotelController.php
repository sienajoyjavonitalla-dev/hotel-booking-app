<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;

class HotelController extends Controller
{
    /** Use SampleData fallback only when not in local (so local always uses DB). */
    private function useSampleData(): bool
    {
        return !app()->environment('local');
    }

    /**
     * List all hotels. Returns sample data if database is unavailable or empty (production only).
     */
    public function index(): JsonResponse
    {
        try {
            $hotels = Hotel::all();
            if ($hotels->isEmpty() && $this->useSampleData()) {
                return response()->json(SampleData::hotels());
            }
            return response()->json($hotels);
        } catch (\Throwable $e) {
            if ($this->useSampleData()) {
                return response()->json(SampleData::hotels());
            }
            throw $e;
        }
    }

    /**
     * Show a hotel with rooms. Returns sample data if database is unavailable (production only).
     */
    public function show(int $hotel): JsonResponse
    {
        try {
            $model = Hotel::with('rooms')->findOrFail($hotel);
            return response()->json($model);
        } catch (\Throwable $e) {
            if ($this->useSampleData()) {
                return response()->json(SampleData::hotelWithRooms($hotel));
            }
            throw $e;
        }
    }

    /**
     * Get rooms for a hotel. Returns sample rooms if database is unavailable (production only).
     */
    public function getRooms(int $hotel): JsonResponse
    {
        try {
            $model = Hotel::findOrFail($hotel);
            return response()->json($model->rooms);
        } catch (\Throwable $e) {
            if ($this->useSampleData()) {
                return response()->json(SampleData::rooms($hotel));
            }
            throw $e;
        }
    }
}