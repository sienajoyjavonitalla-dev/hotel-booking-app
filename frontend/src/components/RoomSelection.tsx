import React, { useState, useEffect } from 'react';
import { Room } from '../services/hotelService';
import { bookingService } from '../services/bookingService';
import { format } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';

interface RoomSelectionProps {
    rooms: Room[];
    checkIn: Date | null;
    checkOut: Date | null;
    onRoomSelect: (room: Room, quantity: number) => void;
}

interface RoomAvailability {
    roomId: number;
    available: boolean;
    loading: boolean;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({
    rooms,
    checkIn,
    checkOut,
    onRoomSelect,
}) => {
    const [selectedRooms, setSelectedRooms] = useState<{ [key: number]: number }>({});
    const [availability, setAvailability] = useState<{ [key: number]: RoomAvailability }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (checkIn && checkOut) {
            checkRoomAvailability();
        } else {
            // Reset availability when dates are cleared
            setAvailability({});
        }
    }, [checkIn, checkOut, rooms]);

    const checkRoomAvailability = async () => {
        if (!checkIn || !checkOut) return;

        setLoading(true);
        const availabilityMap: { [key: number]: RoomAvailability } = {};

        // Initialize all rooms as loading
        rooms.forEach(room => {
            availabilityMap[room.id] = { roomId: room.id, available: false, loading: true };
        });
        setAvailability(availabilityMap);

        // Check availability for each room
        const promises = rooms.map(async (room) => {
            try {
                const result = await bookingService.checkAvailability(
                    room.id,
                    format(checkIn, 'yyyy-MM-dd'),
                    format(checkOut, 'yyyy-MM-dd')
                );
                return { roomId: room.id, available: result.available, loading: false };
            } catch (error) {
                console.error(`Error checking availability for room ${room.id}:`, error);
                return { roomId: room.id, available: false, loading: false };
            }
        });

        const results = await Promise.all(promises);
        const newAvailability: { [key: number]: RoomAvailability } = {};
        results.forEach(result => {
            newAvailability[result.roomId] = result;
        });

        setAvailability(newAvailability);
        setLoading(false);
    };

    const handleQuantityChange = (roomId: number, quantity: number) => {
        const newSelectedRooms = { ...selectedRooms };
        if (quantity > 0) {
            newSelectedRooms[roomId] = quantity;
        } else {
            delete newSelectedRooms[roomId];
        }
        setSelectedRooms(newSelectedRooms);

        const room = rooms.find(r => r.id === roomId);
        if (room) {
            onRoomSelect(room, quantity);
        }
    };

    const calculateTotal = (room: Room, quantity: number): number => {
        if (!checkIn || !checkOut) return 0;
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        return room.price_per_night * nights * quantity;
    };

    if (!checkIn || !checkOut) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800">Please select check-in and check-out dates to view available rooms</p>
            </div>
        );
    }

    if (loading) {
        return <LoadingSpinner text="Checking room availability..." />;
    }

    const availableRooms = rooms.filter(room => {
        const roomAvailability = availability[room.id];
        return roomAvailability && roomAvailability.available && !roomAvailability.loading;
    });

    if (availableRooms.length === 0) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800">No rooms available for the selected dates</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Available Rooms</h3>
            <div className="space-y-4">
                {availableRooms.map((room) => {
                    const quantity = selectedRooms[room.id] || 0;
                    const total = calculateTotal(room, quantity);
                    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                        <div key={room.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h4 className="text-xl font-semibold text-gray-900">{room.room_type}</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Capacity: {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">
                                                ${room.price_per_night}
                                            </p>
                                            <p className="text-sm text-gray-600">per night</p>
                                        </div>
                                    </div>

                                    {room.amenities && room.amenities.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Amenities:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {room.amenities.map((amenity, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                                    >
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {quantity > 0 && (
                                        <div className="mt-3 p-3 bg-blue-50 rounded">
                                            <p className="text-sm text-gray-700">
                                                {quantity} room{quantity !== 1 ? 's' : ''} × ${room.price_per_night}/night × {nights} night{nights !== 1 ? 's' : ''}
                                            </p>
                                            <p className="text-lg font-semibold text-blue-600 mt-1">
                                                Total: ${total.toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleQuantityChange(room.id, Math.max(0, quantity - 1))}
                                        disabled={quantity === 0}
                                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent active:scale-95"
                                    >
                                        <span className="text-gray-600 font-bold">−</span>
                                    </button>
                                    <span className="w-12 text-center font-semibold text-gray-900 text-lg">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(room.id, quantity + 1)}
                                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-500 transition-all duration-200 active:scale-95"
                                    >
                                        <span className="text-blue-600 font-bold">+</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoomSelection;
