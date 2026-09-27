const dotenv = require("dotenv");

// =====================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// =====================================================

dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");

const adminRoutes = require("./routes/adminRoutes");

const inventoryRoutes =
  require("./routes/inventoryRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const pizzaRoutes =
  require("./routes/pizzaRoutes");

const ingredientRoutes =
  require("./routes/ingredientRoutes");

// Notification Routes
const notificationRoutes =
  require("./routes/notificationRoutes");

// Payment Routes
const paymentRoutes =
  require("./routes/paymentRoutes");

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PizzaHub API is running 🚀",
  });
});

// =====================================================
// FAVICON
// =====================================================

app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// =====================================================
// API ROUTES
// =====================================================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Admin
app.use(
  "/api/admin",
  adminRoutes
);

// Inventory
app.use(
  "/api/inventory",
  inventoryRoutes
);

// Orders
app.use(
  "/api/orders",
  orderRoutes
);

// Pizzas
app.use(
  "/api/pizzas",
  pizzaRoutes
);

// Ingredients
app.use(
  "/api/ingredients",
  ingredientRoutes
);

// =====================================================
// ADMIN NOTIFICATIONS
// =====================================================

app.use(
  "/api/admin/notifications",
  notificationRoutes
);

// =====================================================
// PAYMENT / RAZORPAY
// =====================================================

app.use(
  "/api/payment",
  paymentRoutes
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on server.`,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error(
    "GLOBAL SERVER ERROR:",
    err
  );

  res.status(
    err.status || 500
  ).json({
    success: false,
    message:
      err.message ||
      "Internal server error.",
  });
});

// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 PizzaHub server running on http://localhost:${PORT}`
  );

  console.log(
    `💳 Payment API: http://localhost:${PORT}/api/payment`
  );
});