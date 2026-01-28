import React from 'react';
import { render, screen } from '@testing-library/react';
import DateRangePicker from '../DateRangePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const renderWithProvider = (component: React.ReactElement) => {
    return render(
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            {component}
        </LocalizationProvider>
    );
};

describe('DateRangePicker', () => {
    const mockOnCheckInChange = jest.fn();
    const mockOnCheckOutChange = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders check-in and check-out date pickers', () => {
        renderWithProvider(
            <DateRangePicker
                checkIn={null}
                checkOut={null}
                onCheckInChange={mockOnCheckInChange}
                onCheckOutChange={mockOnCheckOutChange}
            />
        );

        expect(screen.getByLabelText(/check-in date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/check-out date/i)).toBeInTheDocument();
    });

    it('displays number of nights when both dates are selected', () => {
        const checkIn = new Date('2026-06-01');
        const checkOut = new Date('2026-06-05');

        renderWithProvider(
            <DateRangePicker
                checkIn={checkIn}
                checkOut={checkOut}
                onCheckInChange={mockOnCheckInChange}
                onCheckOutChange={mockOnCheckOutChange}
            />
        );

        expect(screen.getByText(/4 night/i)).toBeInTheDocument();
    });

    it('displays singular night for 1 night stay', () => {
        const checkIn = new Date('2026-06-01');
        const checkOut = new Date('2026-06-02');

        renderWithProvider(
            <DateRangePicker
                checkIn={checkIn}
                checkOut={checkOut}
                onCheckInChange={mockOnCheckInChange}
                onCheckOutChange={mockOnCheckOutChange}
            />
        );

        expect(screen.getByText(/1 night selected/i)).toBeInTheDocument();
    });
});
