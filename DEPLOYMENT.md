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

1. Set **CORS** in Laravel so your Vercel domain is allowed (`config/cors.php` → `allowed_origins`).
2. Use the backend’s public URL (e.g. `https://api.yourdomain.com`) and set **`REACT_APP_API_URL`** on Vercel to `https://api.yourdomain.com/api` (with `/api` if that’s your Laravel API prefix).

---

## 3. Quick checklist

- [ ] Repo pushed to GitHub/GitLab/Bitbucket  
- [ ] Vercel project created with **Root Directory** = `frontend`  
- [ ] `REACT_APP_API_URL` set in Vercel to your live API URL (including `/api`)  
- [ ] Backend deployed on a PHP host  
- [ ] Laravel CORS allows your Vercel frontend origin  
- [ ] Database and `.env` configured on the backend server  

Once these are done, the app on Vercel will talk to your Laravel API in production.
