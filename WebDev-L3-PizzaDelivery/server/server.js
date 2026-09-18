const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Pizza Delivery API is running 🚀",
  });
});

// Favicon
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});

// Authentication routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});