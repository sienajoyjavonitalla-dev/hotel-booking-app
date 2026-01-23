import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelService, Hotel, Room } from '../services/hotelService';
import { useBooking } from '../context/BookingContext';
import DateRangePicker from '../components/DateRangePicker';
import RoomSelection from '../components/RoomSelection';

const HotelDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { state, dispatch } = useBooking();
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkIn, setCheckIn] = useState<Date | null>(state.checkInDate);
    const [checkOut, setCheckOut] = useState<Date | null>(state.checkOutDate);

    useEffect(() => {
        const fetchHotelData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const hotelData = await hotelService.getHotel(parseInt(id));
                setHotel(hotelData);
                setRooms(hotelData.rooms || []);
                
                // Set hotel in booking context
                dispatch({ type: 'SELECT_HOTEL', payload: hotelData });
            } catch (err) {
                setError('Failed to load hotel details');
                console.error('Error fetching hotel:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotelData();
    }, [id, dispatch]);

    const handleDateChange = (checkInDate: Date | null, checkOutDate: Date | null) => {
        setCheckIn(checkInDate);
        setCheckOut(checkOutDate);
        
        if (checkInDate && checkOutDate) {
            dispatch({
                type: 'SET_DATES',
                payload: { checkIn: checkInDate, checkOut: checkOutDate },
            });
        }
    };

    const handleRoomSelect = (room: Room, quantity: number) => {
        if (quantity > 0) {
            dispatch({ type: 'SELECT_ROOM', payload: room });
            
            // Calculate total amount
            if (checkIn && checkOut) {
                const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                const total = room.price_per_night * nights * quantity;
                dispatch({ type: 'CALCULATE_TOTAL', payload: total });
            }
        }
    };

    const handleProceedToBooking = () => {
        if (!checkIn || !checkOut || !state.selectedRoom) {
            alert('Please select dates and at least one room');
            return;
        }
        navigate('/booking');
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Loading hotel details...</p>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error || 'Hotel not found'}</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hotel Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                    {hotel.images && hotel.images.length > 0 ? (
                        <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-500">Hotel Image</span>
                    )}
                </div>
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
                            <p className="text-gray-600 mb-2">{hotel.address}</p>
                            <div className="flex items-center">
                                <span className="text-yellow-400 text-xl">★</span>
                                <span className="ml-1 text-gray-700 font-semibold">{hotel.rating}</span>
                            </div>
                        </div>
                    </div>

                    {hotel.description && (
                        <p className="text-gray-700 mb-4">{hotel.description}</p>
                    )}

                    {hotel.amenities && hotel.amenities.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {hotel.amenities.map((amenity, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Date Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Dates</h2>
                <DateRangePicker
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onCheckInChange={(date) => handleDateChange(date, checkOut)}
                    onCheckOutChange={(date) => handleDateChange(checkIn, date)}
                />
            </div>

            {/* Room Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <RoomSelection
                    rooms={rooms}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onRoomSelect={handleRoomSelect}
                />
            </div>

            {/* Proceed Button */}
            {state.selectedRoom && checkIn && checkOut && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-lg font-semibold text-gray-900">Total Amount</p>
                            <p className="text-3xl font-bold text-blue-600">${state.totalAmount.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handleProceedToBooking}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Proceed to Booking
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelDetailsPage;
