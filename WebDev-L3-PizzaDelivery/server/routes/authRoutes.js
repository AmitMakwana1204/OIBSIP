const express = require("express");

const {
  register,
  verifyEmail,
} = require("../controllers/authController");

const router = express.Router();

// Register
router.post("/register", register);

// Verify Email
router.get("/verify-email", verifyEmail);

module.exports = router;