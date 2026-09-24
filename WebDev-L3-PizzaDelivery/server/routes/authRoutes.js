const express = require("express");

const {
  register,
  verifyEmail,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =========================================================
// PUBLIC AUTH ROUTES
// =========================================================

// Register
router.post(
  "/register",
  register
);

// Verify Email
router.get(
  "/verify-email",
  verifyEmail
);

// Login
router.post(
  "/login",
  login
);

// Forgot Password
router.post(
  "/forgot-password",
  forgotPassword
);

// Reset Password
router.post(
  "/reset-password/:token",
  resetPassword
);

// =========================================================
// PROTECTED USER ROUTES
// =========================================================

// Get logged-in user
router.get(
  "/me",
  protect,
  getMe
);

// Update logged-in user profile
router.put(
  "/profile",
  protect,
  updateProfile
);

// Change logged-in user's password
router.put(
  "/change-password",
  protect,
  changePassword
);

// =========================================================
// EXPORT
// =========================================================

module.exports = router;