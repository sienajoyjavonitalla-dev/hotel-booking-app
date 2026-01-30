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
   - Set **Root Directory** to `backend`

3. **Add MySQL database**
   - In your Railway project, click **"+ New"** → **"Database"** → **"Add MySQL"**
   - Railway will create a MySQL database and provide connection variables

4. **Set environment variables**
   - Go to your service → **Variables** tab
   - Add these variables (Railway auto-provides `DATABASE_URL`, `MYSQL_HOST`, etc.):
   
   ```
   APP_NAME=Hotel Booking API
   APP_ENV=production
   APP_KEY=                    # Will be generated, see step 5
   APP_DEBUG=false
   APP_URL=                    # Your Railway app URL (e.g. https://your-app.railway.app)
   
   DB_CONNECTION=mysql
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_DATABASE=${{MySQL.MYSQLDATABASE}}
   DB_USERNAME=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   
   CORS_ALLOWED_ORIGINS=      # Optional: comma-separated Vercel URLs
   ```

5. **Generate APP_KEY**
   - In Railway, open the service → **Deployments** → click the latest deployment → **View Logs**
   - Or use Railway's **"Generate Domain"** to get your app URL, then SSH/run:
   ```bash
   php artisan key:generate
   ```
   - Copy the generated key and add it to `APP_KEY` in Variables

6. **Run migrations**
   - In Railway, go to your service → **Settings** → **Deploy Command** (or use the CLI):
   ```bash
   php artisan migrate --force && php artisan db:seed
   ```
   - Or add to **Start Command**: `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT`

7. **Get your API URL**
   - Railway will give you a URL like `https://your-app.railway.app`
   - Your API base URL is: `https://your-app.railway.app/api`
   - Use this in Vercel's `REACT_APP_API_URL` environment variable

8. **Update CORS** (already done in `config/cors.php` - allows `*.vercel.app`)

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

### Migrations fail
- Ensure database exists and credentials are correct
- Try: `php artisan migrate:fresh --seed` (⚠️ deletes all data)

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
