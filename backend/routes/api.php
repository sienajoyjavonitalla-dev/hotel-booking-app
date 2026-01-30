<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\ImageUploadController;
use App\Http\Controllers\Api\RoomController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
// Hotels
Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{hotel}', [HotelController::class, 'show']);
Route::get('/hotels/{hotel}/rooms', [HotelController::class, 'getRooms']);

// Rooms
Route::get('/rooms/availability', [RoomController::class, 'checkAvailability']);

// Bookings
Route::apiResource('bookings', BookingController::class)->only(['store', 'show']);

// Authentication routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    // Image upload
    Route::post('/upload/image', [ImageUploadController::class, 'upload']);
    Route::delete('/upload/image', [ImageUploadController::class, 'delete']);
});