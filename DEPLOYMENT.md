# Deploying the Hotel Booking App

## Overview

- **Frontend (React)** → Deploy to **Vercel**
- **Backend (Laravel)** → Must be deployed to a **PHP host** (Vercel does not run Laravel). See [Backend hosting](#backend-hosting) below.

---

## 1. Deploy the frontend to Vercel

### Option A: Deploy via Vercel dashboard (recommended)

1. **Push your code** to GitHub, GitLab, or Bitbucket (if you haven’t already).

2. **Go to [vercel.com](https://vercel.com)** and sign in (e.g. with GitHub).

3. **Import the project**
   - Click **Add New…** → **Project**
   - Import your `hotel-booking-app` repo
   - Set **Root Directory** to `frontend` (important)
   - Vercel will use the `frontend/vercel.json` we added for build and SPA routing

4. **Environment variables**
   - In Project Settings → **Environment Variables**, add:
   - **Name:** `REACT_APP_API_URL`  
   - **Value:** your backend API base URL, e.g. `https://your-laravel-api.com/api`  
   - Apply to **Production** (and Preview if you want the same API in previews).

5. **Deploy**
   - Click **Deploy**. Vercel will run `npm install` and `npm run build` in the `frontend` folder and serve the `build` output.

After deployment you’ll get a URL like `https://your-app.vercel.app`. All client-side routes (e.g. `/hotels`, `/booking`) will work thanks to the SPA rewrite in `vercel.json`.

### Option B: Deploy with Vercel CLI

```bash
cd frontend
npm i -g vercel
vercel
```

When prompted:

- **Set up and deploy?** Yes  
- **Which scope?** Your account  
- **Link to existing project?** No (first time)  
- **Project name?** e.g. `hotel-booking-app`  
- **In which directory is your code?** `./` (you’re already in `frontend`)

Then add the env var in the Vercel dashboard (Project → Settings → Environment Variables):

- `REACT_APP_API_URL` = `https://your-laravel-api.com/api`

Redeploy so the variable is picked up:

```bash
vercel --prod
```

---

## 2. Backend hosting

Vercel does **not** run PHP/Laravel. Deploy the Laravel API to one of these:

| Option | Notes |
|--------|--------|
| **Laravel Forge** | Manages Laravel on DigitalOcean, AWS, etc. |
| **Railway** | Can run Laravel (PHP + MySQL). |
| **Render** | Web service + PostgreSQL/MySQL. |
| **DigitalOcean App Platform** | Supports PHP and MySQL. |
| **Shared/VPS hosting** | Any host with PHP 8.2+ and MySQL (e.g. RunCloud, Ploi). |

After the backend is deployed:

1. **CORS** is already set to allow any `*.vercel.app` origin. Optionally set `CORS_ALLOWED_ORIGINS` in the backend `.env` (comma-separated) for extra origins.
2. Use the backend’s public URL (e.g. `https://api.yourdomain.com`) and set **`REACT_APP_API_URL`** on Vercel to `https://api.yourdomain.com/api` (with `/api` if that’s your Laravel API prefix).

---

## 3. CORS error on `/hotels` (request to `hotel-booking-app.vercel.app/api`)

**Symptom:** "Access to XMLHttpRequest at 'https://hotel-booking-app.vercel.app/api/hotels' from origin 'https://hotel-booking-app-eight-xi.vercel.app' has been blocked by CORS policy."

**Cause:** The frontend is calling your **Vercel URL** (`hotel-booking-app.vercel.app`) instead of your **Laravel backend**. So `REACT_APP_API_URL` is set to a Vercel domain. The Vercel app is just the React SPA; it has no `/api` and no CORS headers for that.

**Fix (3 steps):**

1. **Get your backend API URL**  
   It’s the URL where your Laravel API is running, e.g. from Railway:  
   `https://your-service-name.up.railway.app`  
   The API base URL must end with `/api`:  
   `https://your-service-name.up.railway.app/api`

2. **Set it in Vercel**  
   - Vercel → your project → **Settings** → **Environment Variables**  
   - Add or edit **`REACT_APP_API_URL`**  
   - **Value:** your backend URL including `/api`, e.g. `https://your-service-name.up.railway.app/api`  
   - **Not** `https://hotel-booking-app.vercel.app` or any `*.vercel.app` URL  
   - Apply to Production (and Preview if you want).

3. **Redeploy**  
   **Deployments** → latest deployment → **⋯** → **Redeploy**  
   (Or push a new commit.)  
   Env vars are read at **build** time, so a redeploy is required.

After this, the frontend will call your real backend; the backend CORS config already allows `*.vercel.app`.

---

## 4. Quick checklist

- [ ] Repo pushed to GitHub/GitLab/Bitbucket  
- [ ] Vercel project created with **Root Directory** = `frontend`  
- [ ] `REACT_APP_API_URL` set in Vercel to your live API URL (including `/api`)  
- [ ] Backend deployed on a PHP host  
- [ ] Laravel CORS allows your Vercel frontend (already allows `*.vercel.app`)  
- [ ] Database and `.env` configured on the backend server  

Once these are done, the app on Vercel will talk to your Laravel API in production.
