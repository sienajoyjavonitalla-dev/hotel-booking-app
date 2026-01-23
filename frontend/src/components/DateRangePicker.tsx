import React, { useState, useEffect } from 'react';
import DatePicker from './DatePicker';
import { differenceInDays } from 'date-fns';

interface DateRangePickerProps {
    checkIn: Date | null;
    checkOut: Date | null;
    onCheckInChange: (date: Date | null) => void;
    onCheckOutChange: (date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    checkIn,
    checkOut,
    onCheckInChange,
    onCheckOutChange,
}) => {
    const [checkInError, setCheckInError] = useState(false);
    const [checkOutError, setCheckOutError] = useState(false);
    const [checkInHelperText, setCheckInHelperText] = useState('');
    const [checkOutHelperText, setCheckOutHelperText] = useState('');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    useEffect(() => {
        // Validate check-in date
        if (checkIn) {
            if (checkIn < today) {
                setCheckInError(true);
                setCheckInHelperText('Check-in date cannot be in the past');
            } else {
                setCheckInError(false);
                setCheckInHelperText('');
            }
        }

        // Validate check-out date
        if (checkOut) {
            if (checkIn && checkOut <= checkIn) {
                setCheckOutError(true);
                setCheckOutHelperText('Check-out date must be after check-in date');
            } else if (checkOut < today) {
                setCheckOutError(true);
                setCheckOutHelperText('Check-out date cannot be in the past');
            } else {
                setCheckOutError(false);
                setCheckOutHelperText('');
            }
        }
    }, [checkIn, checkOut, today]);

    const handleCheckInChange = (date: Date | null) => {
        onCheckInChange(date);
        // If check-out is before or equal to new check-in, reset check-out
        if (date && checkOut && checkOut <= date) {
            onCheckOutChange(null);
        }
    };

    const nights = checkIn && checkOut && !checkInError && !checkOutError
        ? differenceInDays(checkOut, checkIn)
        : 0;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker
                    label="Check-in Date"
                    value={checkIn}
                    onChange={handleCheckInChange}
                    minDate={today}
                    error={checkInError}
                    helperText={checkInHelperText}
                />
                <DatePicker
                    label="Check-out Date"
                    value={checkOut}
                    onChange={onCheckOutChange}
                    minDate={checkIn || today}
                    error={checkOutError}
                    helperText={checkOutHelperText}
                />
            </div>
            {nights > 0 && (
                <div className="text-center text-gray-600">
                    <span className="font-semibold">{nights}</span> night{nights !== 1 ? 's' : ''} selected
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
