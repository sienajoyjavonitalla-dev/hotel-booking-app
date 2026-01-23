import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import BookingForm from '../components/BookingForm';
import { format } from 'date-fns';

const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useBooking();

    // Redirect if essential booking data is missing
    if (!state.selectedHotel || !state.selectedRoom || !state.checkInDate || !state.checkOutDate) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800 mb-4">Please select a hotel and room first</p>
                    <button
                        onClick={() => navigate('/hotels')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Browse Hotels
                    </button>
                </div>
            </div>
        );
    }

    const nights = state.checkInDate && state.checkOutDate
        ? Math.ceil((state.checkOutDate.getTime() - state.checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const handleFormSubmit = () => {
        navigate('/payment');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">{state.selectedHotel.name}</h3>
                                <p className="text-sm text-gray-600">{state.selectedHotel.address}</p>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-1">Room Type</p>
                                <p className="font-semibold text-gray-900">{state.selectedRoom.room_type}</p>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-1">Check-in</p>
                                <p className="font-semibold text-gray-900">
                                    {state.checkInDate ? format(state.checkInDate, 'MMM dd, yyyy') : '-'}
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-1">Check-out</p>
                                <p className="font-semibold text-gray-900">
                                    {state.checkOutDate ? format(state.checkOutDate, 'MMM dd, yyyy') : '-'}
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-1">Duration</p>
                                <p className="font-semibold text-gray-900">
                                    {nights} night{nights !== 1 ? 's' : ''}
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-gray-600">Room Price</p>
                                    <p className="font-semibold text-gray-900">
                                        ${state.selectedRoom.price_per_night}/night
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-bold text-gray-900">Total</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ${state.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Information</h2>
                        <BookingForm onSubmit={handleFormSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
