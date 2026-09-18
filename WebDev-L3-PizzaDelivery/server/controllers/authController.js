const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");

const {
  sendVerificationEmail,
} = require("../utils/sendEmail");

// =========================
// REGISTER USER
// =========================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Token expires in 15 minutes
    const verificationTokenExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    // Send verification email
    await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// =========================
// VERIFY EMAIL
// =========================
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Verify user
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! 🎉",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during email verification",
    });
  }
};

module.exports = {
  register,
  verifyEmail,
};