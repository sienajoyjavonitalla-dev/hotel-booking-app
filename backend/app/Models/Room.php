<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'room_type',
        'capacity',
        'price_per_night',
        'amenities',
        'images',
        'availability'
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'amenities' => 'array',
        'images' => 'array',
        'availability' => 'boolean'
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function roomAvailability()
    {
        return $this->hasMany(RoomAvailability::class);
    }
}