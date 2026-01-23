import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService, Booking } from '../services/bookingService';
import { format } from 'date-fns';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingConfirmationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { dispatch } = useBooking();
    const { showToast } = useToast();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const bookingData = await bookingService.getBooking(parseInt(id));
                setBooking(bookingData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load booking details';
                setError(errorMessage);
                showToast(errorMessage, 'error');
                console.error('Error fetching booking:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id, showToast]);

    const handlePrint = () => {
        window.print();
    };

    const handleNewBooking = () => {
        dispatch({ type: 'RESET_BOOKING' });
        navigate('/hotels');
    };

    if (loading) {
        return <LoadingSpinner text="Loading booking confirmation..." />;
    }

    if (error || !booking) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12">
                <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
                <Link
                    to="/hotels"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Browse Hotels
                </Link>
            </div>
        );
    }

    const nights = booking.check_in && booking.check_out
        ? Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
                <div className="text-6xl mb-4">✓</div>
                <h1 className="text-3xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
                <p className="text-green-700">Your booking has been successfully processed.</p>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Print
                        </button>
                        <button
                            onClick={handleNewBooking}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            New Booking
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Booking Reference */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                        <p className="text-2xl font-bold text-blue-600">#{booking.id.toString().padStart(6, '0')}</p>
                    </div>

                    {/* Hotel Information */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Hotel Name</p>
                                <p className="font-semibold text-gray-900">
                                    {booking.hotel?.name || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Address</p>
                                <p className="font-semibold text-gray-900">
                                    {booking.hotel?.address || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Room Information */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Room Type</p>
                                <p className="font-semibold text-gray-900">
                                    {booking.room?.room_type || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Price per Night</p>
                                <p className="font-semibold text-gray-900">
                                    ${booking.room?.price_per_night || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Check-in</p>
                                <p className="font-semibold text-gray-900">
                                    {format(new Date(booking.check_in), 'EEEE, MMMM dd, yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Check-out</p>
                                <p className="font-semibold text-gray-900">
                                    {format(new Date(booking.check_out), 'EEEE, MMMM dd, yyyy')}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Duration</p>
                                <p className="font-semibold text-gray-900">
                                    {nights} night{nights !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Guest Information */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Name</p>
                                <p className="font-semibold text-gray-900">{booking.guest_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                <p className="font-semibold text-gray-900">{booking.guest_email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Phone</p>
                                <p className="font-semibold text-gray-900">{booking.guest_phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-600">Room Price</p>
                                <p className="font-semibold text-gray-900">
                                    ${booking.room?.price_per_night || 0}/night
                                </p>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-gray-600">Duration</p>
                                <p className="font-semibold text-gray-900">{nights} night{nights !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-bold text-gray-900">Total Amount</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ${booking.total_amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-600">Payment Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        booking.payment_status === 'paid'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {booking.payment_status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-gray-600">Booking Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        booking.status === 'confirmed'
                                            ? 'bg-green-100 text-green-800'
                                            : booking.status === 'cancelled'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {booking.status.toUpperCase().replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Actions */}
            <div className="text-center">
                <Link
                    to="/hotels"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Book Another Hotel
                </Link>
            </div>
        </div>
    );
};

export default BookingConfirmationPage;
