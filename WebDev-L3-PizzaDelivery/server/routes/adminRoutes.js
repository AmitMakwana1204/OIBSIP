const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getDashboardStats,
} = require("../controllers/adminController");
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { adminProtect } = require("../middleware/adminMiddleware");

// Public Admin Login
router.post("/login", adminLogin);

// Protected Admin Dashboard
router.get("/dashboard", adminProtect, getDashboardStats);

// Protected Admin Orders
router.get("/orders", adminProtect, getAllOrders);
router.get("/orders/:id", adminProtect, getOrderById);
router.patch("/orders/:id/status", adminProtect, updateOrderStatus);

module.exports = router;
