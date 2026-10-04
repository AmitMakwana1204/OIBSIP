# 🍕 PizzaHub

### Full-Stack Pizza Ordering & Delivery Platform

PizzaHub is a modern full-stack pizza ordering platform built with **React, Node.js, Express.js, and MongoDB**.

Customers can browse pizzas, build custom pizzas, manage their cart and wishlist, place orders, submit payments, and track order status. Admins can manage pizzas, ingredients, inventory, orders, payments, and notifications.

🎓 Developed as part of the **Oasis Infobyte Web Development Internship — Level 3 Project**.

---

## ✨ Features

### 👤 Customer

* 🔐 Registration & Login
* 📧 Email Verification
* 🔑 Forgot & Reset Password
* 🍕 Custom Pizza Builder
* 🛒 Cart & Checkout
* ❤️ Wishlist
* 📦 Order History
* 📍 Order Status Tracking
* 👤 Profile & Address Management
* 💳 Multiple Payment Options

### 🛡️ Admin

* 📊 Admin Dashboard
* 🍕 Pizza Management
* 🧂 Ingredient Management
* 📦 Inventory Management
* ⚠️ Low-Stock Alerts
* 📋 Order Management
* 💰 Payment Verification
* 🔔 Notifications

---

## 🍕 Custom Pizza Builder

Create your own pizza by selecting:

* Pizza Base
* Sauce
* Cheese
* Vegetables
* Meat / Toppings

The price is calculated dynamically based on the selected ingredients.

---

## 📍 Order Tracking

Customers can track their order through:

```text
Placed → Accepted → Preparing → Out for Delivery → Delivered
```

---

## 🛠️ Tech Stack

| Category       | Technologies                 |
| -------------- | ---------------------------- |
| Frontend       | React 19, Vite, Tailwind CSS |
| Routing        | React Router DOM             |
| Icons          | Lucide React                 |
| HTTP           | Axios                        |
| Backend        | Node.js, Express.js          |
| Database       | MongoDB Atlas, Mongoose      |
| Authentication | JWT, Bcryptjs                |
| Email          | Nodemailer                   |

---

## 📁 Project Structure

```text
WebDev-L3-PizzaDelivery/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       │   └── admin/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   └── server.js
│
├── DEPLOYMENT.md
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

* Node.js 18+
* npm
* MongoDB Atlas or MongoDB

### Clone

```bash
git clone https://github.com/AmitMakwana1204/OIBSIP.git
cd OIBSIP/WebDev-L3-PizzaDelivery
```

### Backend

```bash
cd server
npm install
```

Create `.env`:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

Start server:

```bash
npm run dev
```

### Frontend

Open a new terminal:

```bash
cd client
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🔐 Security

* JWT-based authentication
* Bcrypt password hashing
* Protected routes
* Role-based authorization
* Admin access control
* CORS configuration
* Environment variables for sensitive credentials

---

## 🌐 Deployment

```text
Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas
```

### Live Demo

> Add your actual deployed frontend URL here.

---

## 📸 Screenshots

Add screenshots for:

* Home
* Pizza Builder
* Cart
* Orders
* Admin Dashboard
* Inventory

Example:

```text
screenshots/
├── home.png
├── pizza-builder.png
├── cart.png
├── orders.png
├── admin-dashboard.png
└── inventory.png
```

---

## 🎯 What This Project Demonstrates

* Full-stack MERN development
* REST API development
* Authentication & authorization
* MongoDB database integration
* React application architecture
* Admin dashboard development
* Order management
* Payment workflows
* Inventory management
* Email integration
* Deployment

---

## 👨‍💻 Author

**Amit Makwana**

Full Stack Web Developer

**Tech:** React.js • Node.js • Express.js • MongoDB • JavaScript • Tailwind CSS

## 📄 License

ISC License

Developed with ❤️ for the **Oasis Infobyte Web Development & Designing Internship**.
