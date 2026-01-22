import api from './api';

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
}

export const bookingService = {
    // Check room availability
    checkAvailability: async (
        roomId: number,
        checkIn: string,
        checkOut: string
    ): Promise<AvailabilityCheck> => {
        const response = await api.get('/rooms/availability', {
            params: { room_id: roomId, check_in: checkIn, check_out: checkOut }
        });
        return response.data;
    },

    // Create a new booking
    createBooking: async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    // Get booking by ID
    getBooking: async (id: number): Promise<Booking> => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },
};