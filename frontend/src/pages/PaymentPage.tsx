import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/bookingService';
import { format } from 'date-fns';
import { TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useBooking();
    const { showToast } = useToast();
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [processing, setProcessing] = useState(false);

    // Redirect if essential booking data is missing
    if (!state.selectedHotel || !state.selectedRoom || !state.checkInDate || !state.checkOutDate) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800 mb-4">Please complete your booking first</p>
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

    const validateCardData = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!cardData.cardNumber.trim()) {
            newErrors.cardNumber = 'Card number is required';
        } else if (!/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Please enter a valid 16-digit card number';
        }

        if (!cardData.cardName.trim()) {
            newErrors.cardName = 'Cardholder name is required';
        }

        if (!cardData.expiryDate.trim()) {
            newErrors.expiryDate = 'Expiry date is required';
        } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
            newErrors.expiryDate = 'Please enter in MM/YY format';
        }

        if (!cardData.cvv.trim()) {
            newErrors.cvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
            newErrors.cvv = 'Please enter a valid CVV';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCardNumberChange = (value: string) => {
        // Format card number with spaces
        const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
        setCardData(prev => ({ ...prev, cardNumber: formatted }));
    };

    const handleExpiryChange = (value: string) => {
        // Format expiry date as MM/YY
        const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
        setCardData(prev => ({ ...prev, expiryDate: formatted }));
    };

    const handleCvvChange = (value: string) => {
        // Only allow digits, max 4 characters
        const formatted = value.replace(/\D/g, '').slice(0, 4);
        setCardData(prev => ({ ...prev, cvv: formatted }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateCardData()) {
            return;
        }

        setProcessing(true);
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            // Create booking
            const bookingData = {
                hotel_id: state.selectedHotel!.id,
                room_id: state.selectedRoom!.id,
                check_in: format(state.checkInDate!, 'yyyy-MM-dd'),
                check_out: format(state.checkOutDate!, 'yyyy-MM-dd'),
                guest_name: state.guestInfo.name,
                guest_email: state.guestInfo.email,
                guest_phone: state.guestInfo.phone,
                total_amount: state.totalAmount,
                status: 'confirmed' as const,
                payment_status: 'paid' as const,
            };

            const booking = await bookingService.createBooking(bookingData);

            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Navigate to confirmation page
            showToast('Payment processed successfully!', 'success');
            navigate(`/confirmation/${booking.id}`);
        } catch (error) {
            console.error('Error creating booking:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to process payment. Please try again.';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            showToast(errorMessage, 'error');
        } finally {
            setProcessing(false);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const nights = state.checkInDate && state.checkOutDate
        ? Math.ceil((state.checkOutDate.getTime() - state.checkInDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">{state.selectedHotel.name}</h3>
                                <p className="text-sm text-gray-600">{state.selectedHotel.address}</p>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-1">Room</p>
                                <p className="font-semibold text-gray-900">{state.selectedRoom.room_type}</p>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-1">Duration</p>
                                <p className="font-semibold text-gray-900">
                                    {format(state.checkInDate!, 'MMM dd')} - {format(state.checkOutDate!, 'MMM dd, yyyy')}
                                </p>
                                <p className="text-sm text-gray-600">{nights} night{nights !== 1 ? 's' : ''}</p>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-gray-600">Room Price</p>
                                    <p className="font-semibold text-gray-900">
                                        ${state.selectedRoom.price_per_night}/night
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-bold text-gray-900">Total Amount</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ${state.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> This is a mock payment system. No real transactions will be processed.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FormControl component="fieldset">
                                <FormLabel component="legend" className="text-gray-900 font-semibold mb-2">
                                    Payment Method
                                </FormLabel>
                                <RadioGroup
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <FormControlLabel
                                        value="credit_card"
                                        control={<Radio />}
                                        label="Credit Card"
                                    />
                                    <FormControlLabel
                                        value="debit_card"
                                        control={<Radio />}
                                        label="Debit Card"
                                    />
                                </RadioGroup>
                            </FormControl>

                            <div>
                                <TextField
                                    fullWidth
                                    label="Card Number"
                                    value={cardData.cardNumber}
                                    onChange={(e) => handleCardNumberChange(e.target.value)}
                                    error={!!errors.cardNumber}
                                    helperText={errors.cardNumber}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                        },
                                    }}
                                />
                            </div>

                            <div>
                                <TextField
                                    fullWidth
                                    label="Cardholder Name"
                                    value={cardData.cardName}
                                    onChange={(e) => setCardData(prev => ({ ...prev, cardName: e.target.value }))}
                                    error={!!errors.cardName}
                                    helperText={errors.cardName}
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: '#3b82f6',
                                            },
                                        },
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <TextField
                                        fullWidth
                                        label="Expiry Date"
                                        value={cardData.expiryDate}
                                        onChange={(e) => handleExpiryChange(e.target.value)}
                                        error={!!errors.expiryDate}
                                        helperText={errors.expiryDate}
                                        placeholder="MM/YY"
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: '#3b82f6',
                                                },
                                            },
                                        }}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        fullWidth
                                        label="CVV"
                                        value={cardData.cvv}
                                        onChange={(e) => handleCvvChange(e.target.value)}
                                        error={!!errors.cvv}
                                        helperText={errors.cvv}
                                        placeholder="123"
                                        required
                                        type="password"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&:hover fieldset': {
                                                    borderColor: '#3b82f6',
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin">⏳</span>
                                        Processing Payment...
                                    </span>
                                ) : (
                                    `Pay $${state.totalAmount.toFixed(2)}`
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
