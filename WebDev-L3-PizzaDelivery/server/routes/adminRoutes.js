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
  updatePaymentStatus,
} = require("../controllers/orderController");

const {
  adminProtect,
} = require("../middleware/adminMiddleware");

// ==========================================
// PUBLIC ADMIN LOGIN
// ==========================================

router.post(
  "/login",
  adminLogin
);

// ==========================================
// PROTECTED ADMIN DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  adminProtect,
  getDashboardStats
);

// ==========================================
// PROTECTED ADMIN ORDERS
// ==========================================

// Get all orders
// GET /api/admin/orders
router.get(
  "/orders",
  adminProtect,
  getAllOrders
);

// Get single order
// GET /api/admin/orders/:id
router.get(
  "/orders/:id",
  adminProtect,
  getOrderById
);

// Update order/delivery status
// PATCH /api/admin/orders/:id/status
router.patch(
  "/orders/:id/status",
  adminProtect,
  updateOrderStatus
);

// ==========================================
// UPDATE PAYMENT STATUS
// PATCH /api/admin/orders/:id/payment-status
// ==========================================
//
// Body:
// {
//   "paymentStatus": "PAID"
// }
//
// OR
//
// {
//   "paymentStatus": "FAILED"
// }
//
// OR
//
// {
//   "paymentStatus": "PENDING"
// ==========================================

router.patch(
  "/orders/:id/payment-status",
  adminProtect,
  updatePaymentStatus
);

module.exports = router;