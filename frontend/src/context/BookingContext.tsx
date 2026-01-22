import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Hotel, Room } from '../services/hotelService';

export interface BookingState {
    selectedHotel: Hotel | null;
    selectedRoom: Room | null;
    checkInDate: Date | null;
    checkOutDate: Date | null;
    guestInfo: {
        name: string;
        email: string;
        phone: string;
        specialRequests: string;
    };
    totalAmount: number;
    isLoading: boolean;
    error: string | null;
}

type BookingAction =
    | { type: 'SELECT_HOTEL'; payload: Hotel }
    | { type: 'SELECT_ROOM'; payload: Room }
    | { type: 'SET_DATES'; payload: { checkIn: Date; checkOut: Date } }
    | { type: 'SET_GUEST_INFO'; payload: Partial<BookingState['guestInfo']> }
    | { type: 'CALCULATE_TOTAL'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'RESET_BOOKING' };

const initialState: BookingState = {
    selectedHotel: null,
    selectedRoom: null,
    checkInDate: null,
    checkOutDate: null,
    guestInfo: {
        name: '',
        email: '',
        phone: '',
        specialRequests: '',
    },
    totalAmount: 0,
    isLoading: false,
    error: null,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
    switch (action.type) {
        case 'SELECT_HOTEL':
            return { ...state, selectedHotel: action.payload };
        case 'SELECT_ROOM':
            return { ...state, selectedRoom: action.payload };
        case 'SET_DATES':
            return {
                ...state,
                checkInDate: action.payload.checkIn,
                checkOutDate: action.payload.checkOut,
            };
        case 'SET_GUEST_INFO':
            return {
                ...state,
                guestInfo: { ...state.guestInfo, ...action.payload },
            };
        case 'CALCULATE_TOTAL':
            return { ...state, totalAmount: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'RESET_BOOKING':
            return initialState;
        default:
            return state;
    }
}

const BookingContext = createContext<{
    state: BookingState;
    dispatch: React.Dispatch<BookingAction>;
} | null>(null);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    return (
        <BookingContext.Provider value={{ state, dispatch }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};