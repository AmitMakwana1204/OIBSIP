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
// CORS & MIDDLEWARE
// =====================================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server or tools without origin (Postman, curl)
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      (process.env.CLIENT_URL && origin.startsWith(process.env.CLIENT_URL)) ||
      (typeof origin === "string" && origin.endsWith(".vercel.app")) ||
      origin.includes("localhost");

    if (isAllowed) {
      return callback(null, true);
    }

    return callback(null, true); // Fallback to allow if not explicitly blocked
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =====================================================
// HEALTH CHECK / TEST ROUTES
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PizzaHub API is running",
  });
});

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
// PAYMENT / MANUAL PAYMENT
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 PizzaHub server running on port ${PORT}`
  );
  console.log(
    `🏥 Health check: http://localhost:${PORT}/api/health`
  );
});