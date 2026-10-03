# 🍕 PizzaHub — Full-Stack Pizza Ordering & Delivery System

A modern, responsive, full-stack Pizza Delivery Web Application with custom pizza builder, real-time order tracking, inventory management, role-based admin dashboard, manual/COD payment workflows, and automated email notifications.

Developed as part of the **Oasis Infobyte Web Development Internship (Level 3 Project)**.

---

## 🚀 Live Demo & Deployment

- **Frontend (Vercel):** [Deployed on Vercel](https://vercel.com)
- **Backend (Render):** [Deployed on Render](https://render.com)
- **Database:** [MongoDB Atlas Cloud](https://www.mongodb.com/cloud/atlas)
- **Deployment Guide:** See [DEPLOYMENT.md](file:///d:/private/me%20website/OIBSIP/WebDev-L3-PizzaDelivery/DEPLOYMENT.md) for full step-by-step instructions.

---

## 🌟 Key Features

### 👤 Customer Experience
- **🎨 Interactive Pizza Builder:** Build your own custom pizza by choosing crust/bases, sauces, cheeses, veggies, and meats with dynamic real-time price calculation.
- **🍕 Curated Pizza Menu:** Browse signature pizzas, filter by veg/non-veg categories, add extra toppings, and customize sizes.
- **🛒 Cart & Checkout:** Real-time quantity adjustments, price breakdown (subtotal, taxes, delivery fee), promo codes, and multiple delivery address management.
- **💳 Flexible Payment Options:** Support for UPI / QR Code transfer, Cash on Delivery (COD), and Bank Transfer with transaction reference submission.
- **📍 Live Order Status Tracking:** Step-by-step interactive timeline (`Placed` ➔ `Accepted` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`).
- **🔐 User Authentication:** Secure registration, login, JWT session management, email verification via Nodemailer, and self-service password reset flows.
- **❤️ Wishlist & Order History:** Save favorite pizzas and easily view past invoices and detailed order summaries.
- **👤 Profile Management:** Update personal details, contact numbers, and saved shipping addresses.

### 🛡️ Admin Management Portal
- **📊 Interactive Dashboard:** Overview of total revenue, live active orders, low stock items, and recent transactions.
- **📦 Real-Time Inventory Control:** Track ingredient stock levels, receive automated low-stock warnings, restock supplies, and auto-deduct stock upon order placement.
- **🍕 Pizza & Ingredient Catalog:** Create, edit, toggle availability, and delete standard pizzas and customizable ingredients.
- **📋 Order Fulfillment Pipeline:** Update order statuses in real-time, inspect customer order details, and notify users of delivery progress.
- **💰 Payment Verification:** Review customer payment screenshots and transaction IDs, approve/reject manual payments, and update order confirmation status.
- **🔔 Notification Center:** Broadcast status alerts and stock threshold notifications.

---

## 🛠️ Technology Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4 | Ultra-fast, responsive single page application |
| **Routing & Icons** | React Router DOM v7, Lucide React | Declarative client-side routing & iconography |
| **HTTP Client** | Axios | REST API communication with interceptors |
| **Backend Runtime** | Node.js, Express.js (v5) | Modular RESTful API server |
| **Database & ODM** | MongoDB Atlas, Mongoose (v9) | Cloud NoSQL database with schema validation |
| **Authentication** | JWT (JSON Web Token), Bcryptjs | Secure token-based auth with salted password hashing |
| **Mailing Service** | Nodemailer (Gmail SMTP) | Transactional emails for verification & password reset |

---

## 📁 Project Directory Structure

```text
WebDev-L3-PizzaDelivery/
├── client/                     # Frontend Application (React 19 + Vite + Tailwind CSS)
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Footer, Modals, etc.)
│   │   ├── context/            # React Context providers (Auth, Cart, Wishlist, Theme)
│   │   ├── pages/              # Customer pages (Home, PizzaBuilder, Cart, Orders, etc.)
│   │   │   └── admin/          # Admin pages (Dashboard, Inventory, Orders, Payments, etc.)
│   │   ├── services/           # Axios API configuration & endpoints
│   │   ├── App.jsx             # Route definitions & layout wrappers
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Global Tailwind CSS imports
│   ├── .env.example            # Client environment template
│   ├── package.json            # Client dependencies and scripts
│   ├── vite.config.js          # Vite build config
│   └── vercel.json             # Vercel SPA rewrite configuration
│
├── server/                     # Backend Application (Node.js + Express.js + Mongoose)
│   ├── config/                 # Database connection & third-party configs
│   ├── controllers/            # Route controllers (Auth, Orders, Inventory, Pizzas, etc.)
│   ├── middleware/             # Auth JWT verification & admin guard middlewares
│   ├── models/                 # Mongoose data schemas (User, Order, Pizza, Inventory, etc.)
│   ├── routes/                 # Express API endpoint definitions
│   ├── scripts/                # Utility scripts (Admin creation, seed data, flow testing)
│   ├── utils/                  # Helper utilities (Email sender, error handlers)
│   ├── .env.example            # Server environment template
│   ├── package.json            # Server dependencies and scripts
│   └── server.js               # Express application entry point
│
├── DEPLOYMENT.md               # Complete production deployment guide (Render + Vercel)
└── README.md                   # Project documentation
```

---

## ⚙️ Getting Started (Local Setup)

### 📋 Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/) (v9.x or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB instance

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/AmitMakwana1204/OIBSIP.git
cd OIBSIP/WebDev-L3-PizzaDelivery
```

---

### 2️⃣ Configure & Start the Backend Server

1. Navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/pizzahub?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   CLIENT_URL=http://localhost:5173
   SERVER_URL=http://localhost:5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-16-character-app-password
   ```

5. *(Optional)* Seed initial Admin account:
   ```bash
   node scripts/createAdmin.js
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   > Backend runs at `http://localhost:5000`

---

### 3️⃣ Configure & Start the Frontend Client

1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variable:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   > Frontend runs at `http://localhost:5173`

---

## 📡 API Endpoint Overview

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new customer
- `POST /api/auth/login` — Login & receive JWT token
- `POST /api/auth/verify-email` — Verify email via token
- `POST /api/auth/forgot-password` — Send password reset link
- `POST /api/auth/reset-password` — Set new password with token
- `GET /api/auth/profile` — Fetch authenticated user profile
- `PUT /api/auth/profile` — Update user details / address

### 🍕 Pizzas & Ingredients (`/api/pizzas` & `/api/ingredients`)
- `GET /api/pizzas` — List all available pizzas
- `GET /api/pizzas/:id` — Get pizza details
- `GET /api/ingredients` — List all customizable ingredients (bases, sauces, cheese, toppings)

### 🛒 Orders (`/api/orders`)
- `POST /api/orders` — Place a new order (standard or custom pizza)
- `GET /api/orders/my-orders` — Retrieve logged-in user order history
- `GET /api/orders/:id` — Fetch detailed single order summary

### 💳 Payments (`/api/payments`)
- `POST /api/payments/submit` — Submit transaction ref / proof for manual payment
- `GET /api/payments/order/:orderId` — Check payment status for an order

### 🛡️ Admin Endpoints (`/api/admin`)
- `POST /api/admin/login` — Admin authentication
- `GET /api/admin/dashboard` — Metric counters & analytics
- `GET /api/admin/orders` — List and filter all customer orders
- `PUT /api/admin/orders/:id/status` — Update order delivery status
- `GET /api/admin/inventory` — Stock levels and low inventory alerts
- `PUT /api/admin/inventory/:id` — Update/restock ingredients
- `GET /api/admin/payments` — Review pending payments
- `PUT /api/admin/payments/:id/verify` — Approve or reject payment

---

## 🔒 Security Best Practices Implemented

- **Password Encryption:** Salted password hashing with `bcryptjs`.
- **JWT Protection:** Token verification middleware with expiration times.
- **Role-Based Guards:** Strict separation between customer and administrative access.
- **CORS Configuration:** Controlled cross-origin access allowed only from the trusted frontend domain.
- **Environment Isolation:** Sensitive credentials stored in `.env` and omitted from version control.

---

## 🤝 Contributing & Support

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License & Credits

Distributed under the **ISC License**. Developed with ❤️ for **Oasis Infobyte (OIBSIP)** Web Development & Designing Internship.
