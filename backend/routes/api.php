<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\RoomController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Hotels
Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{hotel}', [HotelController::class, 'show']);
Route::get('/hotels/{hotel}/rooms', [HotelController::class, 'getRooms']);

// Rooms
Route::get('/rooms/availability', [RoomController::class, 'checkAvailability']);

// Bookings
Route::apiResource('bookings', BookingController::class)->only(['store', 'show']);