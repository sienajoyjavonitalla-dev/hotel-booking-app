import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';

interface DatePickerProps {
    label: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
    error?: boolean;
    helperText?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    label,
    value,
    onChange,
    minDate,
    maxDate,
    error,
    helperText,
}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MUIDatePicker
                label={label}
                value={value}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        error: error,
                        helperText: helperText,
                        sx: {
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                    borderColor: '#3b82f6',
                                },
                            },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default DatePicker;
