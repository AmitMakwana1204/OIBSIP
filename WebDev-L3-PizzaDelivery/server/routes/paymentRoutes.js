const express = require("express");

const router = express.Router();

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

// ==========================================
// CREATE RAZORPAY ORDER
// POST /api/payment/create-order
// ==========================================
router.post(
  "/create-order",
  protect,
  createPaymentOrder
);

// ==========================================
// VERIFY RAZORPAY PAYMENT
// POST /api/payment/verify
// ==========================================
router.post(
  "/verify",
  protect,
  verifyPayment
);

module.exports = router;