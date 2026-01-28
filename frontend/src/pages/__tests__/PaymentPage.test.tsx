import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BookingProvider } from '../../context/BookingContext';
import { ToastProvider } from '../../context/ToastContext';
import PaymentPage from '../PaymentPage';
import { bookingService } from '../../services/bookingService';
import { Hotel, Room } from '../../services/hotelService';

// Mock the booking service
jest.mock('../../services/bookingService');
const mockedBookingService = bookingService as jest.Mocked<typeof bookingService>;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockHotel: Hotel = {
    id: 1,
    name: 'Test Hotel',
    address: '123 Test St',
    description: 'Test Description',
    images: null,
    amenities: null,
    rating: 4.5,
    created_at: '',
    updated_at: ''
};

const mockRoom: Room = {
    id: 1,
    hotel_id: 1,
    room_type: 'Single',
    capacity: 1,
    price_per_night: 100,
    amenities: null,
    images: null,
    availability: true,
    created_at: '',
    updated_at: ''
};

const renderPaymentPage = (initialState = {}) => {
    const defaultState = {
        selectedHotel: mockHotel,
        selectedRoom: mockRoom,
        checkInDate: new Date('2026-06-01'),
        checkOutDate: new Date('2026-06-05'),
        guestInfo: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            specialRequests: ''
        },
        totalAmount: 400,
        ...initialState
    };

    return render(
        <BrowserRouter>
            <ToastProvider>
                <BookingProvider>
                    <PaymentPage />
                </BookingProvider>
            </ToastProvider>
        </BrowserRouter>
    );
};

describe('PaymentPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate.mockClear();
    });

    it('renders payment form when booking data is available', () => {
        renderPaymentPage();

        expect(screen.getByText(/payment/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/card number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    });

    it('shows redirect message when booking data is missing', () => {
        renderPaymentPage({
            selectedHotel: null,
            selectedRoom: null,
            checkInDate: null,
            checkOutDate: null
        });

        expect(screen.getByText(/please complete your booking first/i)).toBeInTheDocument();
    });

    it('validates card number format', async () => {
        renderPaymentPage();

        const cardNumberInput = screen.getByLabelText(/card number/i);
        fireEvent.change(cardNumberInput, { target: { value: '1234' } });

        const submitButton = screen.getByRole('button', { name: /pay/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid 16-digit card number/i)).toBeInTheDocument();
        });
    });

    it('validates expiry date format', async () => {
        renderPaymentPage();

        const expiryInput = screen.getByLabelText(/expiry date/i);
        fireEvent.change(expiryInput, { target: { value: '12/2' } });

        const submitButton = screen.getByRole('button', { name: /pay/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter in MM\/YY format/i)).toBeInTheDocument();
        });
    });

    it('validates CVV format', async () => {
        renderPaymentPage();

        const cvvInput = screen.getByLabelText(/cvv/i);
        fireEvent.change(cvvInput, { target: { value: '12' } });

        const submitButton = screen.getByRole('button', { name: /pay/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid cvv/i)).toBeInTheDocument();
        });
    });

    it('formats card number with spaces', () => {
        renderPaymentPage();

        const cardNumberInput = screen.getByLabelText(/card number/i);
        fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } });

        expect(cardNumberInput).toHaveValue('4111 1111 1111 1111');
    });

    it('formats expiry date as MM/YY', () => {
        renderPaymentPage();

        const expiryInput = screen.getByLabelText(/expiry date/i);
        fireEvent.change(expiryInput, { target: { value: '1226' } });

        expect(expiryInput).toHaveValue('12/26');
    });

    it('processes payment successfully with valid data', async () => {
        const mockBooking = {
            id: 1,
            hotel_id: 1,
            room_id: 1,
            check_in: '2026-06-01',
            check_out: '2026-06-05',
            guest_name: 'John Doe',
            guest_email: 'john@example.com',
            guest_phone: '1234567890',
            total_amount: 400,
            status: 'confirmed' as const,
            payment_status: 'paid' as const,
            created_at: '',
            updated_at: ''
        };

        mockedBookingService.createBooking.mockResolvedValue(mockBooking);

        renderPaymentPage();

        // Fill in payment form
        fireEvent.change(screen.getByLabelText(/card number/i), { 
            target: { value: '4111111111111111' } 
        });
        fireEvent.change(screen.getByLabelText(/cardholder name/i), { 
            target: { value: 'John Doe' } 
        });
        fireEvent.change(screen.getByLabelText(/expiry date/i), { 
            target: { value: '12/26' } 
        });
        fireEvent.change(screen.getByLabelText(/cvv/i), { 
            target: { value: '123' } 
        });

        const submitButton = screen.getByRole('button', { name: /pay/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockedBookingService.createBooking).toHaveBeenCalledWith(
                expect.objectContaining({
                    hotel_id: 1,
                    room_id: 1,
                    guest_name: 'John Doe',
                    guest_email: 'john@example.com',
                    status: 'confirmed',
                    payment_status: 'paid'
                })
            );
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/confirmation/1');
        }, { timeout: 3000 });
    });

    it('shows error when payment fails', async () => {
        const error = new Error('Payment processing failed');
        mockedBookingService.createBooking.mockRejectedValue(error);

        renderPaymentPage();

        // Fill in payment form
        fireEvent.change(screen.getByLabelText(/card number/i), { 
            target: { value: '4111111111111111' } 
        });
        fireEvent.change(screen.getByLabelText(/cardholder name/i), { 
            target: { value: 'John Doe' } 
        });
        fireEvent.change(screen.getByLabelText(/expiry date/i), { 
            target: { value: '12/26' } 
        });
        fireEvent.change(screen.getByLabelText(/cvv/i), { 
            target: { value: '123' } 
        });

        const submitButton = screen.getByRole('button', { name: /pay/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockedBookingService.createBooking).toHaveBeenCalled();
        });

        // Error should be handled (toast shown, no navigation)
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('disables submit button while processing', async () => {
        mockedBookingService.createBooking.mockImplementation(
            () => new Promise(resolve => setTimeout(resolve, 100))
        );

        renderPaymentPage();

        // Fill in payment form
        fireEvent.change(screen.getByLabelText(/card number/i), { 
            target: { value: '4111111111111111' } 
        });
        fireEvent.change(screen.getByLabelText(/cardholder name/i), { 
            target: { value: 'John Doe' } 
        });
        fireEvent.change(screen.getByLabelText(/expiry date/i), { 
            target: { value: '12/26' } 
        });
        fireEvent.change(screen.getByLabelText(/cvv/i), { 
            target: { value: '123' } 
        });

        const submitButton = screen.getByRole('button', { name: /pay/i });
        fireEvent.click(submitButton);

        // Button should show processing state
        expect(screen.getByText(/processing payment/i)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
    });
});
