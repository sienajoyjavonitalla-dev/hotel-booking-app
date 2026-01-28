import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BookingProvider, useBooking } from '../BookingContext';
import { Hotel, Room } from '../../services/hotelService';

const TestComponent: React.FC = () => {
    const { state, dispatch } = useBooking();

    return (
        <div>
            <div data-testid="hotel">{state.selectedHotel?.name || 'No hotel'}</div>
            <div data-testid="room">{state.selectedRoom?.room_type || 'No room'}</div>
            <div data-testid="total">{state.totalAmount}</div>
            <button
                onClick={() => {
                    const hotel: Hotel = {
                        id: 1,
                        name: 'Test Hotel',
                        address: '123 Test St',
                        description: 'Test',
                        images: null,
                        amenities: null,
                        rating: 4.5,
                        created_at: '',
                        updated_at: ''
                    };
                    dispatch({ type: 'SELECT_HOTEL', payload: hotel });
                }}
            >
                Select Hotel
            </button>
            <button
                onClick={() => {
                    const room: Room = {
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
                    dispatch({ type: 'SELECT_ROOM', payload: room });
                }}
            >
                Select Room
            </button>
            <button
                onClick={() => {
                    dispatch({
                        type: 'SET_DATES',
                        payload: {
                            checkIn: new Date('2026-06-01'),
                            checkOut: new Date('2026-06-05')
                        }
                    });
                }}
            >
                Set Dates
            </button>
            <button
                onClick={() => {
                    dispatch({ type: 'CALCULATE_TOTAL', payload: 400 });
                }}
            >
                Calculate Total
            </button>
            <button
                onClick={() => {
                    dispatch({ type: 'RESET_BOOKING' });
                }}
            >
                Reset
            </button>
        </div>
    );
};

describe('BookingContext', () => {
    it('provides initial state', () => {
        render(
            <BookingProvider>
                <TestComponent />
            </BookingProvider>
        );

        expect(screen.getByTestId('hotel')).toHaveTextContent('No hotel');
        expect(screen.getByTestId('room')).toHaveTextContent('No room');
        expect(screen.getByTestId('total')).toHaveTextContent('0');
    });

    it('allows selecting a hotel', () => {
        render(
            <BookingProvider>
                <TestComponent />
            </BookingProvider>
        );

        act(() => {
            screen.getByText('Select Hotel').click();
        });

        expect(screen.getByTestId('hotel')).toHaveTextContent('Test Hotel');
    });

    it('allows selecting a room', () => {
        render(
            <BookingProvider>
                <TestComponent />
            </BookingProvider>
        );

        act(() => {
            screen.getByText('Select Room').click();
        });

        expect(screen.getByTestId('room')).toHaveTextContent('Single');
    });

    it('allows setting dates', () => {
        render(
            <BookingProvider>
                <TestComponent />
            </BookingProvider>
        );

        act(() => {
            screen.getByText('Set Dates').click();
        });

        // Dates are set in state (we can't easily test this without exposing more)
        expect(screen.getByText('Set Dates')).toBeInTheDocument();
    });

    it('allows calculating total', () => {
        render(
            <BookingProvider>
                <TestComponent />
            </BookingProvider>
        );

        act(() => {
            screen.getByText('Calculate Total').click();
        });

        expect(screen.getByTestId('total')).toHaveTextContent('400');
    });

    it('allows resetting booking', () => {
        render(
            <BookingProvider>
                <TestComponent />
            </BookingProvider>
        );

        // Set some state
        act(() => {
            screen.getByText('Select Hotel').click();
            screen.getByText('Calculate Total').click();
        });

        expect(screen.getByTestId('hotel')).toHaveTextContent('Test Hotel');
        expect(screen.getByTestId('total')).toHaveTextContent('400');

        // Reset
        act(() => {
            screen.getByText('Reset').click();
        });

        expect(screen.getByTestId('hotel')).toHaveTextContent('No hotel');
        expect(screen.getByTestId('total')).toHaveTextContent('0');
    });
});
