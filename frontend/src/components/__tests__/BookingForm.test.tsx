import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingProvider } from '../../context/BookingContext';
import BookingForm from '../BookingForm';

const renderWithProvider = (component: React.ReactElement) => {
    return render(
        <BookingProvider>
            {component}
        </BookingProvider>
    );
};

describe('BookingForm', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all form fields', () => {
        renderWithProvider(<BookingForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /continue to payment/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        renderWithProvider(<BookingForm onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole('button', { name: /continue to payment/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates email format', async () => {
        renderWithProvider(<BookingForm onSubmit={mockOnSubmit} />);

        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

        const submitButton = screen.getByRole('button', { name: /continue to payment/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates phone number format', async () => {
        renderWithProvider(<BookingForm onSubmit={mockOnSubmit} />);

        const phoneInput = screen.getByLabelText(/phone number/i);
        fireEvent.change(phoneInput, { target: { value: 'abc123' } });

        const submitButton = screen.getByRole('button', { name: /continue to payment/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('submits form with valid data', async () => {
        renderWithProvider(<BookingForm onSubmit={mockOnSubmit} />);

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByLabelText(/special requests/i), { target: { value: 'Late check-in please' } });

        const submitButton = screen.getByRole('button', { name: /continue to payment/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                specialRequests: 'Late check-in please'
            });
        });
    });

    it('clears error when user starts typing', async () => {
        renderWithProvider(<BookingForm onSubmit={mockOnSubmit} />);

        const submitButton = screen.getByRole('button', { name: /continue to payment/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        });

        const nameInput = screen.getByLabelText(/full name/i);
        fireEvent.change(nameInput, { target: { value: 'J' } });

        await waitFor(() => {
            expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
        });
    });
});
