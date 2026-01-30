# Step 1 Setup Instructions - Backend Setup

## Prerequisites
Make sure you have PHP and Composer available in your Laragon environment.

## Installation Steps

### 1. Install Laravel Sanctum

```bash
cd backend
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 2. Run Migration

```bash
php artisan migrate
```

This will add the `user_id` column to the `hotels` table.

### 3. Create Storage Link

```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public` so uploaded images can be accessed publicly.

### 4. Update .env File

Add the following to your `.env` file:

```env
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000
SESSION_DRIVER=cookie
```

### 5. Verify Installation

After running the above commands, you should have:

- ✅ Laravel Sanctum installed
- ✅ `user_id` column added to hotels table
- ✅ Authentication endpoints available at:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout` (protected)
  - `GET /api/auth/user` (protected)
- ✅ Image upload endpoint available at:
  - `POST /api/upload/image` (protected)
  - `DELETE /api/upload/image` (protected)

## Files Created/Modified

### New Files:
- `backend/app/Http/Controllers/Api/AuthController.php`
- `backend/app/Http/Controllers/Api/ImageUploadController.php`
- `backend/database/migrations/2026_01_23_000000_add_user_id_to_hotels_table.php`
- `backend/config/sanctum.php`

### Modified Files:
- `backend/composer.json` - Added laravel/sanctum dependency
- `backend/app/Models/Hotel.php` - Added user_id to fillable and user relationship
- `backend/app/Models/User.php` - Added hotels relationship
- `backend/routes/api.php` - Added auth and upload routes
- `backend/bootstrap/app.php` - Added Sanctum middleware

## Next Steps

After completing the setup commands above, proceed to Step 2: Frontend Authentication.
