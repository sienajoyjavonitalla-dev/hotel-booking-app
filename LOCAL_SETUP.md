# Local Development Setup & Troubleshooting

## Quick Setup Checklist

### Backend (Laravel)

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```
   
   **If you get Sanctum errors**, ensure Sanctum is installed:
   ```bash
   composer require laravel/sanctum
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   ```

3. **Copy environment file**
   ```bash
   copy .env.example .env
   ```
   (or `cp .env.example .env` on Mac/Linux)

4. **Generate app key**
   ```bash
   php artisan key:generate
   ```

5. **Configure database** in `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=hotel_booking
   DB_USERNAME=root
   DB_PASSWORD=        # Your MySQL password (empty if using Laragon default)
   ```

6. **Create database** (if it doesn't exist)
   - Open MySQL (via Laragon, phpMyAdmin, or MySQL command line)
   - Create database: `CREATE DATABASE hotel_booking;`

7. **Run migrations**
   ```bash
   php artisan migrate
   ```

8. **Seed the database** (add sample hotels/rooms)
   ```bash
   php artisan db:seed
   ```

9. **Start the backend server**
   ```bash
   php artisan serve
   ```
   Backend should be running at `http://localhost:8000`

### Frontend (React)

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend**
   ```bash
   npm start
   ```
   Frontend should open at `http://localhost:3000`

---

## Troubleshooting "Server Error" on `/hotels`

### 1. Check if Backend is Running

**Test the API directly:**
- Open browser: `http://localhost:8000/api/hotels`
- Should return JSON (empty array `[]` if no data, or hotel data if seeded)

**If you get an error:**
- Make sure Laravel server is running: `php artisan serve` in the `backend` folder
- Check the terminal for error messages

### 2. Check Database Connection

**Test database connection:**
```bash
cd backend
php artisan tinker
```
Then in tinker:
```php
DB::connection()->getPdo();
```
Should return `PDO Object` without errors.

**Common database issues:**
- Database doesn't exist → Create it: `CREATE DATABASE hotel_booking;`
- Wrong credentials in `.env` → Check `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- MySQL not running → Start MySQL service (Laragon should handle this)

### 3. Check if Database Has Data

**Check if hotels table exists and has data:**
```bash
php artisan tinker
```
Then:
```php
\App\Models\Hotel::count();
```
- Returns `0` → Database is empty, run: `php artisan db:seed`
- Returns error → Table doesn't exist, run: `php artisan migrate`

### 4. Check CORS Configuration

**Verify CORS allows localhost:3000:**
- Check `backend/config/cors.php` - should include `'http://localhost:3000'`
- If you changed the frontend port, add it to `allowed_origins`

**Test CORS:**
- Open browser DevTools (F12) → Network tab
- Try loading `/hotels` page
- Check if you see CORS error in console

### 5. Check Browser Console

**Open browser DevTools (F12) → Console tab:**
- Look for error messages
- Common errors:
  - **"Network error"** → Backend not running or wrong URL
  - **"CORS error"** → CORS not configured correctly
  - **"404 Not Found"** → Wrong API URL or route doesn't exist
  - **"500 Internal Server Error"** → Backend error (check Laravel logs)

### 6. Check Laravel Logs

**View Laravel error logs:**
```bash
cd backend
tail -f storage/logs/laravel.log
```
(Or open `backend/storage/logs/laravel.log` in a text editor)

Look for:
- Database connection errors
- Missing table errors
- PHP errors

### 7. Clear Laravel Cache

**Sometimes cached config causes issues:**
```bash
cd backend
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### 8. Verify API URL

**Check what URL the frontend is using:**
- Open browser DevTools → Network tab
- Look for request to `/hotels`
- Check the full URL (should be `http://localhost:8000/api/hotels`)

**If wrong URL:**
- Check `frontend/.env` (if exists) for `REACT_APP_API_URL`
- Default should be `http://localhost:8000/api` (set in `frontend/src/services/api.ts`)

---

## Common Issues & Solutions

### Issue: "Network error. Please check your internet connection"

**Solution:**
- Backend server not running → Start with `php artisan serve`
- Wrong API URL → Check `frontend/src/services/api.ts` line 3

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution:**
- Check `backend/config/cors.php` includes `'http://localhost:3000'`
- Clear config cache: `php artisan config:clear`
- Restart Laravel server

### Issue: "SQLSTATE[HY000] [1045] Access denied for user"

**Solution:**
- Check `.env` database credentials
- Verify MySQL is running
- Test connection: `php artisan tinker` → `DB::connection()->getPdo();`

### Issue: "SQLSTATE[42S02] Base table or view not found"

**Solution:**
- Run migrations: `php artisan migrate`
- Check if tables exist: `php artisan tinker` → `DB::select('SHOW TABLES');`

### Issue: "Target class [Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful] does not exist"

**Solution:**
1. **Reinstall Sanctum:**
   ```bash
   cd backend
   composer require laravel/sanctum
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   ```

2. **Regenerate autoloader:**
   ```bash
   composer dump-autoload
   ```

3. **Clear caches:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

4. **Restart the server:**
   ```bash
   php artisan serve
   ```

**If still not working**, the middleware is now conditional in `bootstrap/app.php` - it will only load if Sanctum is available. Your API routes should work without it.

### Issue: Empty array `[]` returned (no hotels)

**Solution:**
- Database is empty → Seed it: `php artisan db:seed`
- Or manually add hotels via tinker or database

---

## Quick Test Commands

**Test backend API:**
```bash
curl http://localhost:8000/api/hotels
```

**Test database:**
```bash
cd backend
php artisan tinker
\App\Models\Hotel::all();
```

**Reset everything:**
```bash
cd backend
php artisan migrate:fresh --seed
```
⚠️ **Warning:** This deletes all data and recreates tables with sample data.

---

## Still Having Issues?

1. **Check Laravel logs:** `backend/storage/logs/laravel.log`
2. **Check browser console:** F12 → Console tab
3. **Check network tab:** F12 → Network tab → Look for failed requests
4. **Verify both servers running:**
   - Backend: `http://localhost:8000/api/hotels` should work
   - Frontend: `http://localhost:3000` should load
