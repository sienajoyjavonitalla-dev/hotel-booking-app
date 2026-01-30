# Hotel Owner Features Implementation Plan

## Overview

This plan implements four major features:

1. Authentication system for hotel owners using Laravel Sanctum
2. Hotel management dashboard for owners to manage hotels and room prices
3. Image upload functionality for hotels and rooms
4. UI beautification across the application

## Architecture Decisions

- **Authentication**: Laravel Sanctum (API tokens) for SPA authentication
- **Hotel Ownership**: One user can own multiple hotels (1:many relationship)
- **Image Storage**: Local storage in `backend/storage/app/public` with symbolic link

## Backend Implementation

### 1. Authentication Setup

**Install Laravel Sanctum:**

- Add `laravel/sanctum` to `backend/composer.json`
- Publish Sanctum configuration
- Add Sanctum middleware to API routes

**Database Changes:**

- Migration: Add `user_id` column to `hotels` table
- Update `Hotel` model to include `belongsTo(User::class)` relationship
- Update `User` model to include `hasMany(Hotel::class)` relationship

**API Endpoints** (`backend/routes/api.php`):

- `POST /api/auth/register` - Register new hotel owner
- `POST /api/auth/login` - Login and get token
- `POST /api/auth/logout` - Logout (revoke token)
- `GET /api/auth/user` - Get current authenticated user

**Controllers:**

- `backend/app/Http/Controllers/Api/AuthController.php` - Handle authentication

### 2. Hotel Management API

**Protected Routes** (`backend/routes/api.php`):

- `GET /api/owner/hotels` - Get owner's hotels
- `POST /api/owner/hotels` - Create new hotel
- `PUT /api/owner/hotels/{hotel}` - Update hotel
- `GET /api/owner/hotels/{hotel}/rooms` - Get hotel rooms
- `PUT /api/owner/rooms/{room}` - Update room (especially price_per_night)
- `POST /api/owner/rooms` - Create new room

**Controllers:**

- `backend/app/Http/Controllers/Api/Owner/HotelManagementController.php` - Hotel CRUD
- `backend/app/Http/Controllers/Api/Owner/RoomManagementController.php` - Room management

**Authorization:**

- Middleware to ensure users can only manage their own hotels
- Policy or manual checks in controllers

### 3. Image Upload API

**Endpoint:**

- `POST /api/upload/image` - Upload single image
- Returns: `{ url: string }` - Public URL to access image

**Controller:**

- `backend/app/Http/Controllers/Api/ImageUploadController.php`
- Validate file type (jpg, png, webp)
- Validate file size (max 5MB)
- Store in `storage/app/public/images/hotels/` or `storage/app/public/images/rooms/`
- Return public URL

**Storage Setup:**

- Run `php artisan storage:link` to create symbolic link
- Configure CORS if needed for image access

## Frontend Implementation

### 1. Authentication System

**Context:**

- `frontend/src/context/AuthContext.tsx` - Manage auth state, token storage
- Store token in localStorage
- Provide `useAuth` hook

**Services:**

- `frontend/src/services/authService.ts` - API calls for login/register/logout
- Update `frontend/src/services/api.ts` to include token in headers

**Pages:**

- `frontend/src/pages/LoginPage.tsx` - Login form
- `frontend/src/pages/RegisterPage.tsx` - Registration form (optional)

**Protected Route Component:**

- `frontend/src/components/ProtectedRoute.tsx` - Redirect to login if not authenticated

### 2. Hotel Management Dashboard

**Pages:**

- `frontend/src/pages/owner/DashboardPage.tsx` - Main dashboard showing owner's hotels
- `frontend/src/pages/owner/HotelEditPage.tsx` - Edit hotel details
- `frontend/src/pages/owner/RoomManagementPage.tsx` - Manage rooms for a hotel

**Components:**

- `frontend/src/components/ImageUploader.tsx` - Reusable image upload component
- `frontend/src/components/PriceEditor.tsx` - Component for editing room prices

**Services:**

- `frontend/src/services/ownerService.ts` - API calls for hotel/room management

**Features:**

- List all hotels owned by user
- Edit hotel name, address, description, amenities
- Upload/update hotel images
- View all rooms for a hotel
- Edit room price_per_night
- Add new rooms
- Upload room images

### 3. Image Upload Component

**Component:**

- `frontend/src/components/ImageUploader.tsx`
- Drag & drop or click to upload
- Preview before upload
- Progress indicator
- Multiple image support
- Remove/delete images

**Integration:**

- Use in hotel edit page
- Use in room management page
- Update hotel/room forms to handle image arrays

### 4. UI Beautification

**Enhancements:**

- Add react-icons package for better icons
- Improve color scheme with gradients
- Add loading skeletons instead of spinners
- Enhance card designs with better shadows and hover effects
- Add image galleries with lightbox functionality
- Improve form styling with better focus states
- Add animations for page transitions
- Enhance header with user menu when logged in
- Add dashboard link in navigation

**Specific Improvements:**

- Hotel cards: Better image display, hover effects
- Forms: Better validation visual feedback
- Buttons: More polished with icons
- Dashboard: Modern card-based layout
- Image galleries: Carousel/slider for hotel images

## File Structure

```
backend/
├── app/Http/Controllers/Api/
│   ├── AuthController.php (new)
│   └── Owner/
│       ├── HotelManagementController.php (new)
│       └── RoomManagementController.php (new)
├── app/Http/Controllers/Api/ImageUploadController.php (new)
├── app/Http/Middleware/
│   └── EnsureUserOwnsHotel.php (new - optional)
├── database/migrations/
│   └── YYYY_MM_DD_add_user_id_to_hotels_table.php (new)

frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.tsx (new)
│   ├── components/
│   │   ├── ImageUploader.tsx (new)
│   │   ├── PriceEditor.tsx (new)
│   │   └── ProtectedRoute.tsx (new)
│   ├── pages/
│   │   ├── LoginPage.tsx (new)
│   │   ├── RegisterPage.tsx (new - optional)
│   │   └── owner/
│   │       ├── DashboardPage.tsx (new)
│   │       ├── HotelEditPage.tsx (new)
│   │       └── RoomManagementPage.tsx (new)
│   └── services/
│       ├── authService.ts (new)
│       └── ownerService.ts (new)
```

## Implementation Steps

1. **Backend Setup**
   - Install Sanctum
   - Create migration for user_id in hotels
   - Set up authentication endpoints
   - Create image upload endpoint

2. **Frontend Auth**
   - Create AuthContext
   - Build login page
   - Update API service with token handling
   - Add protected routes

3. **Hotel Management**
   - Create owner API endpoints
   - Build dashboard page
   - Create hotel edit page
   - Add authorization checks

4. **Room Management**
   - Create room management API
   - Build room management page
   - Add price editing functionality

5. **Image Upload**
   - Create upload component
   - Integrate with hotel/room forms
   - Handle image display

6. **UI Enhancements**
   - Add icons library
   - Enhance existing components
   - Improve styling across app
   - Add dashboard navigation

## Security Considerations

- Validate file uploads (type, size)
- Sanitize file names
- Use Laravel's built-in file validation
- Ensure users can only access their own hotels
- Protect API routes with Sanctum middleware
- Store tokens securely in localStorage

## Testing Considerations

- Test authentication flow
- Test authorization (users can't access other hotels)
- Test image upload validation
- Test price updates
- Test protected routes redirect

## Todo List

- [ ] Install and configure Laravel Sanctum for API authentication
- [ ] Create migration to add user_id to hotels table and update models
- [ ] Create authentication API endpoints (login, register, logout)
- [ ] Create AuthContext and authService in frontend
- [ ] Build login page component
- [ ] Create ProtectedRoute component and update routing
- [ ] Create owner hotel management API endpoints
- [ ] Create image upload API endpoint with validation
- [ ] Build owner dashboard page
- [ ] Build hotel edit page with image upload
- [ ] Build room management page with price editing
- [ ] Create reusable ImageUploader component
- [ ] Add icons, improve styling, enhance components
- [ ] Update header with user menu and dashboard link
