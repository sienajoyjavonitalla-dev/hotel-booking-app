import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useBooking } from '../context/BookingContext';

interface BookingFormProps {
    onSubmit: (formData: {
        name: string;
        email: string;
        phone: string;
        specialRequests: string;
    }) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit }) => {
    const { state, dispatch } = useBooking();
    const [formData, setFormData] = useState({
        name: state.guestInfo.name,
        email: state.guestInfo.email,
        phone: state.guestInfo.phone,
        specialRequests: state.guestInfo.specialRequests,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Update form data when context changes
        setFormData({
            name: state.guestInfo.name,
            email: state.guestInfo.email,
            phone: state.guestInfo.phone,
            specialRequests: state.guestInfo.specialRequests,
        });
    }, [state.guestInfo]);

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        // Update context
        dispatch({
            type: 'SET_GUEST_INFO',
            payload: { [field]: value },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
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
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
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
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
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
                    label="Special Requests (Optional)"
                    multiline
                    rows={4}
                    value={formData.specialRequests}
                    onChange={(e) => handleChange('specialRequests', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#3b82f6',
                            },
                        },
                    }}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                Continue to Payment
            </button>
        </form>
    );
};

export default BookingForm;
