# Hotel Booking React App - Detailed Plan

## Project Structure

The application will be created in `C:\laragon\www\hotel-booking-app` with the following structure:

```
hotel-booking-app/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
├── frontend/            # React.js app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Database Schema

### Tables to create:

- **hotels**: id, name, address, description, images, amenities, rating, created_at, updated_at
- **rooms**: id, hotel_id, room_type, capacity, price_per_night, amenities, images, availability, created_at, updated_at
- **bookings**: id, hotel_id, room_id, check_in, check_out, guest_name, guest_email, guest_phone, total_amount, status, payment_status, created_at, updated_at
- **room_availability**: id, room_id, date, is_available, booking_id (nullable)

## Frontend Components (React.js)

### 1. **Date Selection Component** (`DatePicker.jsx`)

   - Calendar component for selecting check-in and check-out dates
   - Validation: check-out must be after check-in
   - Disable past dates and unavailable dates
   - Library: `react-datepicker` or `@mui/x-date-pickers`

### 2. **Hotel Listing Page** (`HotelList.jsx`)

   - Display available hotels with images, ratings, and basic info
   - Search and filter functionality
   - Link to hotel details

### 3. **Hotel Details Page** (`HotelDetails.jsx`)

   - Hotel information display
   - Date selection integration
   - Room availability display based on selected dates
   - Room selection component

### 4. **Room Selection Component** (`RoomSelection.jsx`)

   - Display available rooms for selected dates
   - Show room types, capacity, amenities, price per night
   - Calculate total price based on nights
   - Quantity selector for multiple rooms

### 5. **Booking Form Component** (`BookingForm.jsx`)

   - Guest details form:
     - Full name
     - Email
     - Phone number
     - Special requests (optional)
   - Booking summary display
   - Form validation

### 6. **Payment Component** (`Payment.jsx`)

   - Mock payment interface
   - Payment method selection (Credit Card, Debit Card mock)
   - Card details form (mock - no real processing)
   - Success/error handling

### 7. **Booking Confirmation Page** (`BookingConfirmation.jsx`)

   - Display booking details
   - Booking reference number
   - Download/print option

### 8. **State Management**

   - React Context API for booking state management
   - Store: selected dates, hotel, rooms, guest details, booking status

## Backend API Endpoints (Laravel)

### Routes in `routes/api.php`:

1. **GET /api/hotels** - List all hotels
2. **GET /api/hotels/{id}** - Get hotel details
3. **GET /api/hotels/{id}/rooms** - Get rooms for a hotel
4. **GET /api/rooms/availability** - Check room availability (query params: room_id, check_in, check_out)
5. **POST /api/bookings** - Create a new booking
6. **GET /api/bookings/{id}** - Get booking details
7. **PUT /api/bookings/{id}/payment** - Update payment status (mock)

### Controllers:

- `HotelController.php` - Handle hotel-related operations
- `RoomController.php` - Handle room availability and selection
- `BookingController.php` - Handle booking creation and management
- `PaymentController.php` - Handle mock payment processing

### Models:

- `Hotel.php` - Hotel model with relationships
- `Room.php` - Room model with availability logic
- `Booking.php` - Booking model with status management

### Services:

- `BookingService.php` - Business logic for booking creation
- `AvailabilityService.php` - Check room availability for date ranges
- `PaymentService.php` - Mock payment processing logic

## Key Features Implementation

### Date Selection Logic

- Validate date ranges
- Calculate number of nights
- Check room availability for selected dates
- Prevent double booking

### Room Availability Check

- Query room_availability table for date range
- Consider existing bookings
- Return available room count

### Booking Flow

1. User selects hotel
2. User selects dates (check-in/check-out)
3. System shows available rooms
4. User selects room(s) and quantity
5. User fills guest details form
6. User proceeds to payment (mock)
7. System creates booking with status "pending_payment"
8. After mock payment, status changes to "confirmed"
9. Booking confirmation displayed

### Payment Integration (Mock)

- Simulate payment processing
- Generate mock transaction ID
- Update booking payment_status to "paid"
- No actual payment gateway integration

## Technology Stack

### Frontend:

- React.js 18+
- React Router for navigation
- Axios for API calls
- React Context API for state management
- CSS Modules or Tailwind CSS for styling
- Date picker library (react-datepicker)

### Backend:

- Laravel 10+
- MySQL database
- Laravel Sanctum for API authentication (optional for future)
- Eloquent ORM

## Development Steps

1. **Setup Laravel Backend**

   - Create Laravel project in `backend/` directory
   - Configure database connection
   - Create migrations for hotels, rooms, bookings, room_availability
   - Create models and relationships
   - Create seeders with sample data
   - Implement API controllers and routes

2. **Setup React Frontend**

   - Create React app in `frontend/` directory
   - Install dependencies (react-router-dom, axios, date picker)
   - Setup routing structure
   - Create context for booking state
   - Implement API service layer

3. **Build Components**

   - Date selection component
   - Hotel listing and details pages
   - Room selection component
   - Booking form component
   - Payment component
   - Booking confirmation page

4. **Integrate Frontend with Backend**

   - Connect API endpoints
   - Handle API responses and errors
   - Implement loading states
   - Add error handling

5. **Styling and UX**

   - Responsive design
   - Loading indicators
   - Error messages
   - Success notifications
   - Form validation feedback

6. **Testing**

   - Test booking flow end-to-end
   - Test date validation
   - Test room availability logic
   - Test form validation

## Configuration Files

- `backend/.env` - Laravel environment configuration
- `frontend/.env` - React API base URL configuration
- `backend/config/cors.php` - CORS configuration for API access
- `backend/config/database.php` - Database configuration

## Sample Data

Create seeders with:

- 3-5 sample hotels
- Multiple room types per hotel (Single, Double, Suite, etc.)
- Sample pricing and amenities
