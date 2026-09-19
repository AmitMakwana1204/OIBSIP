const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// User order routes (Protected by user token)
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);

module.exports = router;
