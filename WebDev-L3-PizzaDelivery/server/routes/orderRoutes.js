const express = require("express");

const router = express.Router();

const {
  createOrder,
  getUserOrders,
  cancelUserOrder,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

// ==========================================
// USER ORDER ROUTES
// Protected by user token
// ==========================================

// Create new order
// POST /api/orders
router.post("/", protect, createOrder);

// Get logged-in user's orders
// GET /api/orders/my-orders
router.get("/my-orders", protect, getUserOrders);

// Cancel logged-in user's order
// PUT /api/orders/my-orders/:orderId/cancel
router.put(
  "/my-orders/:orderId/cancel",
  protect,
  cancelUserOrder
);

module.exports = router;