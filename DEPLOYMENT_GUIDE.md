# 🚀 KalaburagiTech Netflix Analytics - Production Deployment Guide

This project consists of two components:
1. **Backend**: Python FastAPI service (`backend/`) on Port `8000`.
2. **Frontend**: Next.js 14 Web Application (`frontend/`) on Port `3000`.

---

## 🌟 Method 1: The Easiest & Free Cloud Method (Recommended)
> **Cost:** Free ($0)  
> **Frontend:** Hosted on [Vercel](https://vercel.com)  
> **Backend:** Hosted on [Render](https://render.com) or [Railway](https://railway.app)

### Step 1: Push your code to GitHub
Make sure your project is pushed to a GitHub repository:
```bash
git init
git add .
git commit -m "KalaburagiTech Netflix Analytics Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/netflix-analytics.git
git push -u origin main
```

---

### Step 2: Deploy the FastAPI Backend to Render
1. Go to [render.com](https://render.com) and create an account.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Fill in the service configuration:
   - **Name:** `kalaburagitech-netflix-backend`
   - **Region:** Any (e.g., Singapore or Frankfurt)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank)*
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
5. Click **Create Web Service**.
6. When deployment finishes, copy your live backend URL (e.g. `https://kalaburagitech-netflix-backend.onrender.com`).
   - You can test it at `https://kalaburagitech-netflix-backend.onrender.com/docs`.

---

### Step 3: Deploy the Next.js Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. In the configuration:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Select `frontend` (Click *Edit* next to Root Directory and pick `frontend`).
5. Open **Environment Variables** and add:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://kalaburagitech-netflix-backend.onrender.com/api` *(Your Render backend URL + `/api`)*
6. Click **Deploy**.
7. In ~60 seconds, your frontend will be live on a fast global CDN with a free `.vercel.app` domain and free SSL!

---

## 🐳 Method 2: Single VPS / Cloud Server (Docker Compose)
> **Cost:** $4 - $6/month (DigitalOcean, Hetzner, Linode, AWS EC2, or Hostinger)  
> **Control:** Full control over server and storage

### Prerequisites on your VPS:
Install Docker and Docker Compose on Ubuntu/Debian:
```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl enable --now docker
```

### Deployment:
1. Clone your repository onto the server:
   ```bash
   git clone https://github.com/YOUR_USERNAME/netflix-analytics.git
   cd netflix-analytics
   ```
2. Run Docker Compose:
   ```bash
   docker compose up -d --build
   ```
3. Check container status:
   ```bash
   docker compose ps
   ```
   Both `kalaburagitech_backend` and `kalaburagitech_frontend` will start automatically and restart on reboot!

---

## 🔒 Adding a Custom Domain and HTTPS with Nginx (Optional for VPS)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
Install free SSL with Certbot:
```bash
sudo certbot --nginx -d yourdomain.com
```

---

## 📋 Environment Variables Reference

| Variable | Service | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Frontend | `http://127.0.0.1:8000/api` | The base URL of the FastAPI backend + `/api` |
| `PORT` | Backend | `8000` | Port for Uvicorn server |
| `PORT` | Frontend | `3000` | Port for Next.js server |
