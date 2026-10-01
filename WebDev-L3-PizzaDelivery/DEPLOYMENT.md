# 🍕 PizzaHub — Complete Production Deployment Guide

This guide provides end-to-end instructions for deploying the **PizzaHub** full-stack application to **Render (Backend)**, **Vercel (Frontend)**, and **MongoDB Atlas (Database)**.

---

## 🏗️ Production Architecture Overview

| Component | Platform | Configuration |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | React 19 + Vite + Tailwind CSS + React Router (`client/vercel.json` SPA rewrites) |
| **Backend** | [Render](https://render.com) | Node.js + Express.js API (`server/server.js`, 0.0.0.0 binding) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Cloud Managed MongoDB Cluster |
| **Email** | Gmail SMTP via Nodemailer | Account Verification & Password Reset Emails |
| **Payment** | Manual Payment + COD | QR Code / UPI / Bank Transfer / COD with Admin verification |
| **Auth** | JWT + bcryptjs | Role-based (User & Admin) token authentication |

---

## 📋 Required Environment Variables Summary

### 1. Backend (`server` on Render)

| Variable Name | Description | Example / Format |
|---|---|---|
| `PORT` | Server listening port | `5000` or assigned by Render |
| `NODE_ENV` | Application environment | `production` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pizzahub?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for signing user/admin JWTs | `a_very_long_secure_random_string_64_chars` |
| `CLIENT_URL` | Deployed Frontend URL (no trailing slash) | `https://oibsip-seven-rho.vercel.app` |
| `SERVER_URL` | Deployed Backend URL (no trailing slash) | `https://pizzahub-api.onrender.com` |
| `EMAIL_USER` | Gmail address for sending notifications | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail 16-character App Password (spaces accepted) | Set as a Render secret |

### 2. Frontend (`client` on Vercel)

| Variable Name | Description | Example / Format |
|---|---|---|
| `VITE_API_URL` | Full backend API URL with `/api` path | `https://oibsip-4m86.onrender.com/api` |

---

## 🚀 Step 1: Set Up MongoDB Atlas

1. **Create Account / Login:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. **Create a Database Cluster:**
   - Choose **M0 Free Shared Tier**.
   - Select your preferred cloud provider and region (e.g. AWS / Mumbai `ap-south-1` or closest to your users).
   - Click **Create Deployment**.
3. **Create Database User:**
   - Go to **Security > Database Access > Add New Database User**.
   - Authentication method: **Password**.
   - Username: e.g. `pizzahub_admin`.
   - Password: Click **Autogenerate Secure Password** and copy it somewhere safe.
   - Database User Privileges: **Read and write to any database**.
   - Click **Add User**.
4. **Network Access (IP Whitelist):**
   - Go to **Security > Network Access > Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`). *(Required so Render servers can connect dynamically)*.
   - Click **Confirm**.
5. **Get Connection String:**
   - Go to **Database > Clusters > Connect > Drivers**.
   - Driver: `Node.js`, Version: `6.0 or later`.
   - Copy connection string:
     ```
     mongodb+srv://pizzahub_admin:<password>@cluster0.xxxxx.mongodb.net/pizzahub?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual database user password.

---

## 📧 Step 2: Configure Gmail App Password (for Nodemailer)

1. Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2. Ensure **2-Step Verification** is turned **ON**.
3. In the search bar at top, type **App Passwords** (or visit `https://myaccount.google.com/apppasswords`).
4. Enter an app name (e.g. `PizzaHub`).
5. Click **Create**.
6. Copy the **16-character password** (format: `xxxx xxxx xxxx xxxx`).
7. Use this value for `EMAIL_PASS` and your Gmail address for `EMAIL_USER`.

---

## 🌐 Step 3: Deploy Backend on Render

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare PizzaHub for production deployment"
   git push origin main
   ```
2. **Create Render Web Service:**
   - Log into [Render.com](https://render.com).
   - Click **New + > Web Service**.
   - Connect your GitHub repository: `WebDev-L3-PizzaDelivery`.
3. **Configure Service Settings:**
   - **Name:** `pizzahub-api` (or your choice)
   - **Region:** Singapore / Frankfurt / Oregon (closest to your MongoDB Atlas region)
   - **Branch:** `main`
   - **Root Directory:** `server` *(IMPORTANT)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
4. **Add Environment Variables:**
   Click **Environment Variables** and add:
   ```
   PORT = 5000
   NODE_ENV = production
   MONGO_URI = mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pizzahub?retryWrites=true&w=majority
   JWT_SECRET = <your_generated_secret_string>
   CLIENT_URL = https://oibsip-seven-rho.vercel.app
   SERVER_URL = https://oibsip-4m86.onrender.com
   EMAIL_USER = your-email@gmail.com
   EMAIL_PASS = your-16-char-app-password (Gmail App Password; keep secret)
   ```
5. **Deploy:** Click **Create Web Service**.
6. **Verify Backend Deployment:**
   - Once deployed, copy your Render URL: e.g. `https://pizzahub-api.onrender.com`
   - Open in browser: `https://oibsip-4m86.onrender.com/api/health`
   - Expected output:
     ```json
     {
       "success": true,
       "message": "PizzaHub API is running"
     }
     ```

---

## ⚡ Step 4: Deploy Frontend on Vercel

1. Log into [Vercel.com](https://vercel.com).
2. Click **Add New... > Project**.
3. Import your GitHub repository.
4. **Configure Project Settings:**
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and choose `client` *(IMPORTANT)*
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. **Add Environment Variable:**
   - Name: `VITE_API_URL`
   - Value: `https://oibsip-4m86.onrender.com/api` *(Your Render backend URL + `/api`)*
6. **Deploy:** Click **Deploy**.
7. Once deployed, note down your production Vercel URL (e.g. `https://pizzahub.vercel.app`).

---

## 🔄 Step 5: Update CORS & Client URL on Render

1. Go back to your [Render Dashboard](https://dashboard.render.com).
2. Open your backend service (`pizzahub-api`) > **Environment Variables**.
3. Update `CLIENT_URL` with your final Vercel URL:
   ```
   CLIENT_URL = https://oibsip-seven-rho.vercel.app
   ```
4. Click **Save Changes** (Render will automatically re-deploy with updated environment variables).

---

## 🧪 Production Verification Checklist

Run through this checklist on the live deployed URL:

- [ ] **Health Check:** Visit `https://your-backend.onrender.com/api/health` — returns 200 OK.
- [ ] **Home Page & Menu:** Visit `https://your-frontend.vercel.app` — pizzas load properly from MongoDB.
- [ ] **Direct URL Refresh:** Refresh `/login`, `/dashboard`, `/cart` — no 404 error (handled by `client/vercel.json`).
- [ ] **User Registration:** Register a new user account.
- [ ] **Email Verification:** Check your email for the verification link (pointing to `https://your-frontend.vercel.app/verify-email?token=...`).
- [ ] **User Login:** Login with verified credentials — JWT saved in localStorage.
- [ ] **Pizza Builder & Customization:** Build custom pizza with ingredients.
- [ ] **Cart & Checkout:** Add pizzas to cart and proceed to checkout with delivery address.
- [ ] **Order Creation:** Place order via Manual Payment or COD.
- [ ] **Order Status & History:** View real-time order status and order cancellation.
- [ ] **Admin Login:** Access `/admin/login` and login with admin credentials.
- [ ] **Admin Dashboard:** View stats, total revenue, and active orders.
- [ ] **Admin Inventory & Menu:** Add, edit, delete pizzas and update ingredient stock.
- [ ] **Admin Payments:** Review manual payment transaction IDs and approve/reject payments.
- [ ] **Admin Notifications:** View notification bell with unread count and mark notifications as read.

---

## 🛠️ Troubleshooting Common Issues

### 1. Render Free Tier Cold Starts
- **Symptom:** First request takes 30-50 seconds to respond.
- **Cause:** Render free tier spins down inactive web services after 15 minutes.
- **Solution:** This is normal behavior on free tier. You can use a free uptime monitoring service like [UptimeRobot](https://uptimerobot.com) to ping `https://your-backend.onrender.com/api/health` every 10 minutes to keep it warm.

### 2. CORS Policy Errors in Browser
- **Symptom:** `Access to fetch at ... has been blocked by CORS policy`.
- **Cause:** Mismatched `CLIENT_URL` in Render environment variables.
- **Fix:** Ensure `CLIENT_URL` in Render exactly matches your Vercel URL (including `https://` and without any trailing `/`).

### 3. Vercel 404 on Page Refresh
- **Symptom:** Direct navigation to `/dashboard` or `/orders` gives 404 NOT_FOUND.
- **Fix:** Ensure `client/vercel.json` exists in your repository with `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`.

### 4. MongoDB Atlas Connection Timeout
- **Symptom:** Backend logs show `MongooseServerSelectionError` or connection fails.
- **Fix:** Check MongoDB Atlas > **Network Access** > Verify `0.0.0.0/0` is allowed. Ensure your database user password has no unencoded special characters in the connection string.

---

🎉 **Congratulations! PizzaHub is now fully production ready.**
