# Deploying Laravel Backend

This guide covers deploying your Laravel API backend to production. Choose one of the platforms below.

---

## Option 1: Railway (Recommended - Easiest)

Railway is the simplest option - it auto-detects Laravel and handles most setup automatically.

### Steps:

1. **Sign up at [railway.app](https://railway.app)** (free tier available, can use GitHub login)

2. **Create a new project**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"** (or upload code)
   - Choose your `hotel-booking-app` repository
   - **Critical:** Set **Root Directory** to **`backend`**. Railpack detects PHP/Laravel when it sees `composer.json` and `artisan` in the root. Without this, you get "Railpack could not determine how to build the app."
   - If you already created the project without Root Directory: go to **Settings** → **General** → **Root Directory** → set to `backend` → **Redeploy**

3. **Add MySQL database**
   - In your Railway project, click **"+ New"** → **"Database"** → **"Add MySQL"**
   - Railway will create a MySQL database and provide connection variables

4. **Set environment variables on the Laravel service (not on MySQL)**
   - **Important:** These variables must be set on your **Laravel/backend service** (the one that runs `php artisan serve`), **not** on the MySQL service. The MySQL service only runs the database; Laravel needs the variables to connect to it.
   - In Railway: click your **Laravel/backend service** (the GitHub-deployed one) → **Variables** tab
   - Add these variables. Use `${{MySQL.MYSQLHOST}}` etc. to reference the MySQL service (replace `MySQL` with your MySQL service name if different):
   
   ```
   APP_NAME=Hotel Booking API
   APP_ENV=production
   APP_KEY=base64:your-generated-key-here
   APP_DEBUG=false
   APP_URL=https://your-laravel-service.up.railway.app
   
   DB_CONNECTION=mysql
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_DATABASE=${{MySQL.MYSQLDATABASE}}
   DB_USERNAME=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   ```
   
   **If `${{MySQL.*}}` doesn't resolve:** In the Laravel service's Variables tab, click **"Add Reference"** (or **"Connect Variable"**) and select the MySQL service, then pick the variable (e.g. `MYSQLHOST`). Or copy the actual values from the MySQL service's Variables tab and paste them as plain values (e.g. `DB_HOST=monorail.proxy.rlwy.net`).

5. **Generate APP_KEY**
   - In Railway, open the service → **Deployments** → click the latest deployment → **View Logs**
   - Or use Railway's **"Generate Domain"** to get your app URL, then SSH/run:
   ```bash
   php artisan key:generate
   ```
   - Copy the generated key and add it to `APP_KEY` in Variables

6. **Start command (no migrations)**
   - In Railway → your Laravel service → **Settings** → **Start Command**, set to:
   ```bash
   php -S 0.0.0.0:$PORT -t public
   ```
   - This uses PHP's built-in server instead of `php artisan serve` (which can error with "Unsupported operand types: string + int" when `$PORT` is a string). Document root is `public/` so Laravel's `index.php` handles all requests.
   - **Do not** run `php artisan migrate` in the start command. If migrate fails (e.g. "table already exists"), Railway can mark the deploy as crashed. Run migrations once manually (see step 7).

7. **Run migrations once (manual)**
   - After the app is running: Railway → your Laravel service → **Settings** → **Shell** or **Run Command**, then run:
   ```bash
   php artisan migrate --force
   php artisan db:seed
   ```
   - Or use Railway CLI. Only needed once (or when you add new migrations).

8. **Get your API URL**
   - Railway will give you a URL like `https://your-app.railway.app`
   - Your API base URL is: `https://your-app.railway.app/api`
   - Use this in Vercel's `REACT_APP_API_URL` environment variable

9. **Update CORS** (already done in `config/cors.php` - allows `*.vercel.app`)

---

## Option 2: Render

Render is another easy option with a free tier.

### Steps:

1. **Sign up at [render.com](https://render.com)** (free tier available)

2. **Create a new Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repo
   - Set:
     - **Name:** `hotel-booking-api`
     - **Root Directory:** `backend`
     - **Environment:** `PHP`
     - **Build Command:** `composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache`
     - **Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT`

3. **Add PostgreSQL database** (Render's free MySQL is limited, PostgreSQL works great)
   - Click **"New +"** → **"PostgreSQL"**
   - Note the connection details

4. **Set environment variables** in your Web Service:
   ```
   APP_NAME=Hotel Booking API
   APP_ENV=production
   APP_KEY=                    # Generate with: php artisan key:generate --show
   APP_DEBUG=false
   APP_URL=                    # Your Render URL (e.g. https://hotel-booking-api.onrender.com)
   
   DB_CONNECTION=pgsql
   DB_HOST=                    # From PostgreSQL service
   DB_PORT=5432
   DB_DATABASE=                # From PostgreSQL service
   DB_USERNAME=                # From PostgreSQL service
   DB_PASSWORD=                # From PostgreSQL service
   ```

5. **Run migrations**
   - After first deploy, go to **Shell** in Render dashboard and run:
   ```bash
   php artisan migrate --force
   php artisan db:seed
   ```

6. **Get your API URL**
   - Render gives you: `https://hotel-booking-api.onrender.com`
   - API base URL: `https://hotel-booking-api.onrender.com/api`
   - Use this in Vercel's `REACT_APP_API_URL`

---

## Option 3: Laravel Forge (Advanced)

Forge manages Laravel on DigitalOcean, AWS, Linode, etc. More control, requires a server.

### Steps:

1. **Sign up at [forge.laravel.com](https://forge.laravel.com)**
2. **Create a server** (DigitalOcean droplet recommended)
3. **Create a site** and connect your GitHub repo
4. **Set Root Directory** to `backend`
5. **Configure environment** - Forge will create `.env` for you
6. **Deploy** - Forge handles migrations automatically

---

## After Deployment

### 1. Update Vercel Frontend

In **Vercel** → your project → **Settings** → **Environment Variables**:

- Set **`REACT_APP_API_URL`** to your backend API URL (e.g. `https://your-app.railway.app/api`)
- Redeploy the frontend

### 2. Test the API

Visit your backend URL directly:
- `https://your-backend-url.com/api/hotels` - Should return JSON (or empty array if no data)

### 3. Seed the Database (if needed)

If you want sample hotels/rooms, SSH into your server or use the platform's shell:

```bash
php artisan db:seed
```

Or run specific seeders:
```bash
php artisan db:seed --class=HotelSeeder
php artisan db:seed --class=RoomSeeder
```

---

## Troubleshooting

### "Pre-deploy command failed" (Deployment failed during deploy process)

Railway runs a **Pre deploy command** (if you set one) before starting the app. If that command fails (e.g. `php artisan migrate` when DB isn't ready, or a command that doesn't exist), the whole deploy fails.

**Fix:** Remove the Pre deploy command and run migrations in the **Start command** instead.

1. Railway → Your **Laravel/backend service** → **Settings**
2. Find **Deploy** or **Build & Deploy** section
3. **Pre Deploy Command** or **Pre-deploy command:** Clear it (leave empty) or delete it
4. **Start Command** (if shown): set to `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT`  
   (If you use the repo's Dockerfile, migrations already run in the start command; you don't need a separate pre-deploy.)
5. Save and **Redeploy**

Migrations will then run when the container starts (when DB is available), not before.

### "Railpack could not determine how to build the app"

Railpack only detects PHP/Laravel when **Root Directory** is the folder that contains `composer.json` and `artisan`. In this repo that folder is **`backend`**.

**Solution 1: Set Root Directory (fixes most cases)**
1. Railway → Your project → **Settings** (or service **Settings**)
2. Find **Root Directory** (under "Build" or "General")
3. Set it to **`backend`** (exactly that, no leading slash)
4. Save and **Redeploy**

**Solution 2: Use Docker**
1. In Railway → Your service → **Settings** → **Build**
2. Set **Builder** to **Dockerfile** (or enable "Use Dockerfile" if shown)
3. Ensure Root Directory is still **`backend`** so the Dockerfile at `backend/Dockerfile` is used
4. Redeploy

### CORS errors
- Ensure `config/cors.php` allows your Vercel domain (already configured for `*.vercel.app`)
- Check `APP_URL` matches your backend URL

### Database connection errors
- Verify all `DB_*` variables are set correctly
- For Railway: Use the provided `${{MySQL.*}}` variables
- For Render: Copy exact values from PostgreSQL service

### 500 errors
- Check logs in your platform's dashboard
- Ensure `APP_KEY` is set
- Run `php artisan config:clear` and `php artisan cache:clear`

### "Unsupported operand types: string + int" (ServeCommand.php line 250)

Laravel's `php artisan serve --port=$PORT` can fail on PHP 8+ when `$PORT` is a string (env vars are always strings). **Fix:** Use PHP's built-in server instead. Set **Start Command** to:
```bash
php -S 0.0.0.0:$PORT -t public
```
The `-t public` sets the document root so Laravel's `public/index.php` handles requests.

### Migrations fail / "Table already exists" / deploy still crashes

- **"Table 'bookings' already exists"** – Tables exist but Laravel tries to run the migration again (migrations table out of sync). Railway may still mark the deploy as failed even with `|| true`.
- **Fix:** Remove `migrate` from the **Start Command** entirely. Use only:
  ```bash
  php artisan serve --host=0.0.0.0 --port=$PORT
  ```
  The app will start; your existing tables are fine. Run new migrations later via Railway Shell when needed.
- **Other migration errors:** Ensure database exists and credentials are correct. Nuclear option: `php artisan migrate:fresh --seed` (⚠️ deletes all data).

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `APP_KEY` | Laravel encryption key | Generated with `php artisan key:generate` |
| `APP_URL` | Your backend base URL | `https://your-app.railway.app` |
| `DB_CONNECTION` | Database type | `mysql` or `pgsql` |
| `DB_HOST` | Database host | From your platform |
| `DB_DATABASE` | Database name | From your platform |
| `DB_USERNAME` | Database user | From your platform |
| `DB_PASSWORD` | Database password | From your platform |
| `CORS_ALLOWED_ORIGINS` | Extra CORS origins (optional) | `https://your-frontend.vercel.app` |

---

## Quick Start (Railway - Fastest)

1. Sign up Railway → New Project → GitHub repo → Root: `backend`
2. Add MySQL database
3. Set env vars (use Railway's `${{MySQL.*}}` for DB vars)
4. Generate `APP_KEY` → add to env vars
5. Deploy → get URL → use `https://your-app.railway.app/api` in Vercel

That's it! Railway handles most of the setup automatically.
