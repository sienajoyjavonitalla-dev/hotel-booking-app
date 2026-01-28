# Testing Guide

This document provides instructions for running tests in the Hotel Booking App.

## Backend Tests (Laravel PHPUnit)

### Running Tests

Run all tests:
```bash
cd backend
php artisan test
```

Run specific test file:
```bash
php artisan test tests/Feature/HotelApiTest.php
```

Run specific test method:
```bash
php artisan test --filter test_can_get_all_hotels
```

### Test Coverage

#### Feature Tests

1. **HotelApiTest** (`tests/Feature/HotelApiTest.php`)
   - Tests hotel listing endpoint
   - Tests single hotel retrieval with rooms
   - Tests hotel rooms endpoint
   - Tests 404 handling

2. **RoomAvailabilityTest** (`tests/Feature/RoomAvailabilityTest.php`)
   - Tests room availability checking
   - Tests availability when all dates are available
   - Tests availability when some dates are unavailable
   - Tests checkout date exclusion logic
   - Tests validation rules

3. **BookingApiTest** (`tests/Feature/BookingApiTest.php`)
   - Tests booking creation
   - Tests booking retrieval
   - Tests validation rules
   - Tests email validation

4. **BookingFlowIntegrationTest** (`tests/Feature/BookingFlowIntegrationTest.php`)
   - Tests complete end-to-end booking flow
   - Tests availability check → booking creation → confirmation
   - Tests booking failure when room unavailable

### Test Database

Tests use an in-memory SQLite database (configured in `phpunit.xml`). Each test runs with a fresh database state using `RefreshDatabase` trait.

## Frontend Tests (React Testing Library)

### Running Tests

Run all tests:
```bash
cd frontend
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

Run tests with coverage:
```bash
npm test -- --coverage
```

### Test Coverage

#### Component Tests

1. **BookingForm.test.tsx**
   - Tests form field rendering
   - Tests required field validation
   - Tests email format validation
   - Tests phone number validation
   - Tests form submission with valid data
   - Tests error clearing on input

2. **DateRangePicker.test.tsx**
   - Tests date picker rendering
   - Tests nights calculation display
   - Tests singular/plural night display

3. **BookingContext.test.tsx**
   - Tests initial state
   - Tests hotel selection
   - Tests room selection
   - Tests date setting
   - Tests total calculation
   - Tests booking reset

#### Service Tests

1. **hotelService.test.ts**
   - Tests hotel fetching
   - Tests hotel retrieval with rooms
   - Tests error handling
   - Tests 404 handling

## Test Scenarios Covered

### ✅ Booking Flow End-to-End
- Complete booking flow from hotel selection to confirmation
- Room availability checking
- Booking creation
- Booking confirmation retrieval

### ✅ Date Validation
- Check-in date must be in the future
- Check-out date must be after check-in
- Checkout date exclusion from availability check
- Date range calculations

### ✅ Room Availability Logic
- Availability when all dates are available
- Unavailability when some dates are unavailable
- Proper date range checking (excluding checkout)
- Multiple room availability checks

### ✅ Form Validation
- Required field validation
- Email format validation
- Phone number format validation
- Real-time error clearing
- Form submission with valid data

## Running All Tests

### Backend Only
```bash
cd backend
php artisan test
```

### Frontend Only
```bash
cd frontend
npm test
```

### Both (in separate terminals)
```bash
# Terminal 1
cd backend && php artisan test

# Terminal 2
cd frontend && npm test
```

## Test Data

Tests use factories to generate test data:
- `HotelFactory` - Creates test hotels
- `RoomFactory` - Creates test rooms
- `BookingFactory` - Creates test bookings

All factories use Faker for realistic test data generation.

## Continuous Integration

These tests can be integrated into CI/CD pipelines:
- Backend: `php artisan test`
- Frontend: `npm test -- --ci --coverage`

## Notes

- Backend tests use in-memory SQLite for fast execution
- Frontend tests use React Testing Library for component testing
- All tests are isolated and can run independently
- Test data is automatically cleaned up between tests
