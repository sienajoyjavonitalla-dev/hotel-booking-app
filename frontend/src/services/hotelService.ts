import api, { ApiError } from './api';

export interface Hotel {
    id: number;
    name: string;
    address: string;
    description: string | null;
    images: string[] | null;
    amenities: string[] | null;
    rating: number;
    created_at: string;
    updated_at: string;
}

export interface Room {
    id: number;
    hotel_id: number;
    room_type: string;
    capacity: number;
    price_per_night: number;
    amenities: string[] | null;
    images: string[] | null;
    availability: boolean;
    created_at: string;
    updated_at: string;
}

export const hotelService = {
    // Get all hotels
    getHotels: async (): Promise<Hotel[]> => {
        try {
            const response = await api.get('/hotels');
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message || 'Failed to fetch hotels');
        }
    },

    // Get hotel by ID with rooms
    getHotel: async (id: number): Promise<Hotel & { rooms: Room[] }> => {
        try {
            const response = await api.get(`/hotels/${id}`);
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            if (apiError.status === 404) {
                throw new Error('Hotel not found');
            }
            throw new Error(apiError.message || 'Failed to fetch hotel details');
        }
    },

    // Get rooms for a specific hotel
    getHotelRooms: async (hotelId: number): Promise<Room[]> => {
        try {
            const response = await api.get(`/hotels/${hotelId}/rooms`);
            return response.data;
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message || 'Failed to fetch hotel rooms');
        }
    },
};