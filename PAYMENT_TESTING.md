# Payment Method Testing Guide

This guide explains how to test the payment functionality in the Hotel Booking App.

## Manual Testing Steps

### Prerequisites
1. **Start Backend Server:**
   ```bash
   cd backend
   php artisan serve
   ```

2. **Start Frontend Server:**
   ```bash
   cd frontend
   npm start
   ```

3. **Ensure Database is Seeded:**
   ```bash
   cd backend
   php artisan migrate:fresh --seed
   ```

### Step-by-Step Testing Process

#### 1. Navigate to Hotel Selection
- Open `http://localhost:3000` in your browser
- Click "Browse Hotels" or navigate to `/hotels`
- Select any hotel from the list

#### 2. Select Dates and Room
- On the hotel details page, select:
  - **Check-in Date:** Any future date (e.g., 2026-06-01)
  - **Check-out Date:** Any date after check-in (e.g., 2026-06-05)
- Select a room from the available rooms
- Click "Proceed to Booking"

#### 3. Fill Guest Information
- Fill in the booking form:
  - **Full Name:** John Doe
  - **Email:** john@example.com
  - **Phone:** 1234567890
  - **Special Requests:** (Optional)
- Click "Continue to Payment"

#### 4. Test Payment Form

**Test Card Numbers (All will work - it's a mock system):**

| Card Number | Expiry | CVV | Cardholder Name | Expected Result |
|------------|--------|-----|-----------------|-----------------|
| `4111 1111 1111 1111` | `12/26` | `123` | John Doe | ✅ Success |
| `5555 5555 5555 4444` | `06/27` | `456` | Jane Smith | ✅ Success |
| `3782 822463 10005` | `09/28` | `1234` | Bob Johnson | ✅ Success (AMEX) |

**Note:** Any 16-digit number that passes validation will work since this is a mock payment system.

#### 5. Submit Payment
- Fill in the payment form with test card details
- Click "Pay $X.XX" button
- You should see:
  - Loading state ("Processing Payment...")
  - Success toast notification
  - Redirect to booking confirmation page

#### 6. Verify Booking Confirmation
- Check that you're redirected to `/confirmation/{booking_id}`
- Verify booking details are displayed:
  - Booking reference number
  - Hotel information
  - Room information
  - Dates
  - Guest information
  - Payment summary
  - Status: "CONFIRMED" and "PAID"

## What to Check

### ✅ Form Validation Tests

1. **Empty Fields:**
   - Try submitting with empty card number → Should show error
   - Try submitting with empty cardholder name → Should show error
   - Try submitting with empty expiry → Should show error
   - Try submitting with empty CVV → Should show error

2. **Invalid Formats:**
   - Card Number: `1234` (too short) → Should show "Please enter a valid 16-digit card number"
   - Expiry: `12/2` (invalid format) → Should show "Please enter in MM/YY format"
   - CVV: `12` (too short) → Should show "Please enter a valid CVV"

3. **Valid Input:**
   - Card Number: `4111111111111111` → Should auto-format to `4111 1111 1111 1111`
   - Expiry: `1226` → Should auto-format to `12/26`
   - CVV: `123` → Should accept

### ✅ Payment Processing Tests

1. **Successful Payment:**
   - Fill all fields correctly
   - Submit payment
   - Should see loading spinner
   - Should see success toast: "Payment processed successfully!"
   - Should redirect to confirmation page
   - Booking should be created in database with status "confirmed" and payment_status "paid"

2. **Network Error Simulation:**
   - Stop backend server
   - Try to submit payment
   - Should see error toast
   - Should not redirect

### ✅ Database Verification

After successful payment, verify in database:

```bash
cd backend
php artisan tinker
```

```php
// Check latest booking
$booking = \App\Models\Booking::latest()->first();
$booking->guest_name; // Should be "John Doe"
$booking->status; // Should be "confirmed"
$booking->payment_status; // Should be "paid"
$booking->total_amount; // Should match the displayed amount

// Check room availability was updated
$roomAvailability = \App\Models\RoomAvailability::where('booking_id', $booking->id)->get();
$roomAvailability->count(); // Should match number of nights
```

## Browser Developer Tools Testing

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Submit payment
4. Check for:
   - `POST /api/bookings` request
   - Status: 201 (Created)
   - Response contains booking data

### Console Tab
1. Open DevTools Console
2. Submit payment
3. Check for:
   - No errors
   - Success messages
   - API call logs

## Automated Testing

Run the payment flow test:

```bash
cd frontend
npm test -- PaymentPage
```

Or run all tests:
```bash
npm test
```

## Common Issues & Solutions

### Issue: Payment button doesn't work
**Solution:** Check browser console for errors. Ensure backend is running.

### Issue: "Failed to process payment" error
**Solution:** 
- Check backend server is running
- Check API endpoint is accessible
- Check database connection
- Verify room availability data exists

### Issue: Redirect doesn't happen
**Solution:**
- Check booking was created successfully
- Check booking ID in response
- Verify navigation logic in PaymentPage

### Issue: Booking not showing in confirmation
**Solution:**
- Check booking ID in URL
- Verify booking exists in database
- Check API endpoint `/api/bookings/{id}` returns data

## Test Scenarios Checklist

- [ ] Valid card details → Success
- [ ] Invalid card number format → Error shown
- [ ] Invalid expiry format → Error shown
- [ ] Invalid CVV → Error shown
- [ ] Empty fields → Validation errors
- [ ] Payment processing → Loading state shown
- [ ] Successful payment → Toast notification
- [ ] Successful payment → Redirect to confirmation
- [ ] Successful payment → Booking created in database
- [ ] Successful payment → Room availability updated
- [ ] Network error → Error toast shown
- [ ] Card number auto-formatting works
- [ ] Expiry date auto-formatting works

## Quick Test Card

**Recommended Test Card:**
- **Card Number:** `4111 1111 1111 1111`
- **Expiry:** `12/26`
- **CVV:** `123`
- **Cardholder Name:** `Test User`

This will pass all validations and complete the payment flow successfully.
