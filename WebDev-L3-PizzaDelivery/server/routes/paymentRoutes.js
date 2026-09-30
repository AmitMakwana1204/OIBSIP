const express = require("express");

const router = express.Router();

const {
  getPaymentConfig,
  submitManualPayment,
  getMyPayments,
  getAdminPayments,
  getAdminPaymentById,
  updateAdminPaymentStatus,
  getPaymentStats,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/adminMiddleware");

// ==========================================
// PUBLIC
// ==========================================

// Get manual payment configuration / instructions
// GET /api/payment/config
router.get("/config", getPaymentConfig);

// ==========================================
// USER ROUTES (protected by user token)
// ==========================================

// Submit manual payment details
// POST /api/payment/manual
router.post("/manual", protect, submitManualPayment);

// Get logged-in user's payments
// GET /api/payment/my-payments
router.get("/my-payments", protect, getMyPayments);

// ==========================================
// ADMIN ROUTES (protected by admin token)
// ==========================================

// Get payment stats
// GET /api/payment/admin/stats
router.get("/admin/stats", adminProtect, getPaymentStats);

// Get all payments
// GET /api/payment/admin
router.get("/admin", adminProtect, getAdminPayments);

// Get single payment
// GET /api/payment/admin/:id
router.get("/admin/:id", adminProtect, getAdminPaymentById);

// Update payment status
// PATCH /api/payment/admin/:id/status
router.patch(
  "/admin/:id/status",
  adminProtect,
  updateAdminPaymentStatus
);

module.exports = router;