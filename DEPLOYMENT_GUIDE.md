# 🚀 Complete Production Hosting & Deployment Guide

This guide details how to host the **SecurePay Backend & Portfolio Application** in production with zero downtime, automatic database migrations, and automated admin seeding.

---

## 📑 Table of Contents
1. [Automatic Startup Lifecycle (`server.js`)](#1-automatic-startup-lifecycle)
2. [Option A: One-Click PaaS Hosting (Render / Railway)](#option-a-one-click-paas-hosting-render--railway)
3. [Option B: Self-Hosted Linux VPS (Ubuntu + Nginx + PM2 + SSL)](#option-b-self-hosted-linux-vps-ubuntu--nginx--pm2--ssl)
4. [Option C: Docker & Docker Compose](#option-c-docker--docker-compose)
5. [Frontend Deployment (Vercel / Netlify)](#frontend-deployment-vercel--netlify)
6. [Environment Variables Reference](#environment-variables-reference)
7. [Production Troubleshooting & Checklist](#production-troubleshooting--checklist)

---

## 1. Automatic Startup Lifecycle

The backend includes a unified master entrypoint: [`backend/src/server.js`](file:///c:/Users/shiv.b/Desktop/New%20folder/backend/src/server.js).

When the server starts (`npm start` or container launch), it executes a three-phase bootstrap:

```
[ npm start ] 
      │
      ▼
┌────────────────────────────────────────────────────────┐
│ Phase 1: Database Migration                            │
│ Executes setupDb.js (idempotent CREATE TABLE IF NOT    │
│ EXISTS for all tables, indexes, and schemas)           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 2: Automated Admin Seeding                       │
│ Executes seedSuperAdmin.js                             │
│ Checks if Super Admin exists in DB; if not, creates    │
│ the account automatically with environment credentials │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Phase 3: Launch Express + Socket.IO Server             │
│ Starts HTTP and WebSocket server on $PORT              │
│ Ready to serve live traffic & push events              │
└────────────────────────────────────────────────────────┘
```

> **Why this matters:** You do not need to manually SSH into the server or run migration scripts before deploying. Every fresh container or server instance bootstraps its own database schema and seed credentials automatically.

---

## Option A: One-Click PaaS Hosting (Render / Railway)

### 1. Render.com

Render supports both PostgreSQL and Node.js Web Services on its free/standard tier.

#### Step 1: Push code to GitHub
Push this repository to your GitHub account:
```bash
git add .
git commit -m "Production ready hosting configuration"
git push origin master
```

#### Step 2: Create PostgreSQL Database on Render
1. Go to [dashboard.render.com](https://dashboard.render.com/) → **New** → **PostgreSQL**.
2. **Name:** `securepay-db`
3. **Database:** `Securepaydb`
4. **User:** `postgres`
5. Click **Create Database**.
6. Copy the **Internal Database URL** (e.g. `postgres://user:pass@dpg-xxx:5432/Securepaydb`).

#### Step 3: Deploy Backend Web Service
1. In Render Dashboard, click **New** → **Web Service** → Connect your repository.
2. Configure settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. Add **Environment Variables**:
   | Variable | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | *Paste Internal Database URL from Step 2* |
   | `FRONTEND_URL` | `https://your-frontend-domain.vercel.app` |
   | `CLIENT_URL` | `https://your-frontend-domain.vercel.app` |
   | `JWT_ACCESS_SECRET` | *Generate a random 64-character string* |
   | `JWT_REFRESH_SECRET` | *Generate another random 64-character string* |
   | `COOKIE_SECRET` | *Generate a random cookie salt* |
   | `SUPER_ADMIN_PHONE` | `+917991234567` |
   | `SUPER_ADMIN_PASSWORD` | `SuperAdmin@123` |
4. Click **Create Web Service**. 
   - Render will build, migrate the database, seed the admin account, and make your API live at `https://your-app.onrender.com`.

---

### 2. Railway.app

1. Go to [railway.app](https://railway.app/) → **New Project**.
2. Select **Provision PostgreSQL**.
3. Select **Deploy from GitHub Repo** → select your repo → set root directory to `/backend`.
4. Add environment variables under the **Variables** tab (reference `DATABASE_URL` from the provisioned PostgreSQL instance).
5. Railway automatically routes WebSocket traffic for Socket.IO.

---

## Option B: Self-Hosted Linux VPS (Ubuntu + Nginx + PM2 + SSL)

Ideal for Hostinger VPS, DigitalOcean Droplets, AWS EC2, or Hetzner.

### Step 1: Install Node.js & PostgreSQL on Ubuntu

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL and create database
sudo -u postgres psql -c "CREATE DATABASE \"Securepaydb\";"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_strong_db_password';"
```

### Step 2: Clone and Configure Application

```bash
# Clone to /var/www
cd /var/www
git clone <your-repo-url> app
cd app/backend

# Install dependencies
npm install --production

# Create production .env file
nano .env
```

Add your production environment variables:
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
CLIENT_URL=https://yourdomain.com

DATABASE_URL=postgres://postgres:your_strong_db_password@localhost:5432/Securepaydb
DB_SSL=false

JWT_ACCESS_SECRET=your_super_strong_production_access_secret_64chars
JWT_REFRESH_SECRET=your_super_strong_production_refresh_secret_64chars
COOKIE_SECRET=your_cookie_signing_salt_64chars

SUPER_ADMIN_PHONE=+917991234567
SUPER_ADMIN_PASSWORD=YourSecureAdminPassword@123
SUPER_ADMIN_NAME="Shivakumar Admin"
```

### Step 3: Run with PM2 (Process Manager for Automatic Reboots)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application via master bootstrap script
pm2 start src/server.js --name "securepay-api"

# Configure PM2 to start on system boot
pm2 startup
pm2 save
```

### Step 4: Configure Nginx Reverse Proxy with WebSocket Support

Create `/etc/nginx/sites-available/api.yourdomain.com`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # API endpoints
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;

        # WebSocket headers for Socket.IO
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Client IP and host preservation
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts for persistent connections
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

Enable the configuration and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/api.yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Install Free SSL Certificate (Certbot Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

---

## Option C: Docker & Docker Compose

You can launch the complete production stack (PostgreSQL + Auto-Migrating Backend) with a single command:

```bash
# Clone repository
git clone <your-repo-url>
cd <repo-folder>

# Launch containers in background
docker compose up -d --build
```

To view real-time logs:
```bash
docker compose logs -f backend
```

---

## Frontend Deployment (Vercel / Netlify)

The frontend built with Vite and React can be hosted globally on Vercel or Netlify.

### Vercel Deployment Steps:
1. Go to [vercel.com](https://vercel.com/) → **Add New Project**.
2. Select your repository.
3. Set **Root Directory** to `frontend`.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add **Environment Variables**:
   - `VITE_API_URL`: `https://api.yourdomain.com` (your live backend URL)
8. Click **Deploy**.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Yes | App runtime mode | `production` |
| `PORT` | Yes | HTTP listening port | `5000` |
| `DATABASE_URL` | Yes | Cloud PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `FRONTEND_URL` | Yes | Allowed frontend origin for CORS | `https://portfolio.yourdomain.com` |
| `CLIENT_URL` | Yes | Secondary CORS origin for WebSockets | `https://portfolio.yourdomain.com` |
| `JWT_ACCESS_SECRET` | Yes | Secret key for 15-minute access tokens | 64+ char random string |
| `JWT_REFRESH_SECRET`| Yes | Secret key for 7-day refresh tokens | 64+ char random string |
| `COOKIE_SECRET` | Yes | Secret key for cookie signing | 32+ char random string |
| `SUPER_ADMIN_PHONE` | No | Default seeded admin phone number | `+917991234567` |
| `SUPER_ADMIN_PASSWORD` | No | Default seeded admin password | `SuperAdmin@123` |
| `SUPER_ADMIN_NAME` | No | Admin display name | `Shivakumar Admin` |
| `FIREBASE_CONFIG` | No | JSON string of Firebase Admin service account | `{"project_id": ...}` |

### Frontend (`frontend/.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | Yes | Live backend API and Socket.IO URL | `https://api.yourdomain.com` |
| `VITE_FIREBASE_VAPID_KEY` | No | Web Push VAPID key for background alerts | `BOr...` |

---

## Production Troubleshooting & Checklist

1. **CORS Errors:**
   - Ensure `FRONTEND_URL` and `CLIENT_URL` in `backend/.env` match the exact domain of your frontend (e.g. `https://my-app.vercel.app`, no trailing slash).
2. **WebSocket / Socket.IO Fails to Connect:**
   - In Nginx, make sure `proxy_set_header Upgrade $http_upgrade;` and `proxy_set_header Connection "upgrade";` are included.
3. **Database SSL Connection Errors on Cloud (Neon/Supabase/Render):**
   - The pool in `backend/src/config/database.js` automatically enables `{ rejectUnauthorized: false }` for cloud providers when `NODE_ENV=production`.
4. **Cookie Authentication on Cross-Origin Domains:**
   - If the frontend and backend are hosted on different domains, cookies require `SameSite=None; Secure`. In `jwtHelper.js`, when running over HTTPS, set `sameSite: 'none', secure: true`.

