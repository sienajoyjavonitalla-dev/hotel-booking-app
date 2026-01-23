import api, { ApiError } from './api';

export interface Booking {
    id: number;
    hotel_id: number;
    room_id: number;
    check_in: string;
    check_out: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    total_amount: number;
    status: 'pending_payment' | 'confirmed' | 'cancelled';
    payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
    created_at: string;
    updated_at: string;
    hotel?: any;
    room?: any;
}

export interface AvailabilityCheck {
    available: boolean;
    room_id: number;
    check_in: string;
    check_out: string;
    message?: string;
}

export const bookingService = {
    // Check room availability
    checkAvailability: async (
        roomId: number,
        checkIn: string,
        checkOut: string
    ): Promise<AvailabilityCheck> => {
        try {
            const response = await api.get('/rooms/availability', {
                params: { room_id: roomId, check_in: checkIn, check_out: checkOut }
            });
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            // Return unavailable if there's an error checking availability
            return {
                available: false,
                room_id: roomId,
                check_in: checkIn,
                check_out: checkOut,
                message: apiError.message || 'Unable to check availability',
            };
        }
    },

    // Create a new booking
    createBooking: async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> => {
        try {
            const response = await api.post('/bookings', bookingData);
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            if (apiError.status === 422) {
                throw new Error(apiError.message || 'Validation error. Please check your input.');
            }
            if (apiError.status === 409) {
                throw new Error('Room is no longer available for the selected dates.');
            }
            throw new Error(apiError.message || 'Failed to create booking');
        }
    },

    // Get booking by ID
    getBooking: async (id: number): Promise<Booking> => {
        try {
            const response = await api.get(`/bookings/${id}`);
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            if (apiError.status === 404) {
                throw new Error('Booking not found');
            }
            throw new Error(apiError.message || 'Failed to fetch booking details');
        }
    },
};