<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    public function index()
    {
        return Hotel::all();
    }

    public function show(Hotel $hotel)
    {
        return $hotel->load('rooms');
    }

    public function getRooms(Hotel $hotel)
    {
        return $hotel->rooms;
    }
}