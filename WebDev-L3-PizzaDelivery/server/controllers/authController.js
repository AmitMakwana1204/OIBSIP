const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require("../utils/sendEmail");

// =========================================================
// USER RESPONSE HELPER
// =========================================================

const getUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    pincode: user.pincode || "",
    isVerified: user.isVerified ?? true,
  };
};

// =========================================================
// REGISTER USER
// POST /api/auth/register
// =========================================================

const register = async (req, res) => {
  const duplicateEmailMessage =
    "Email is already registered. Please login or use forgot password.";

  try {
    const {
      name,
      email,
      password,
      confirmPassword,
    } = req.body;

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // -----------------------------------------------------
    // EMAIL VALIDATION
    // -----------------------------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // -----------------------------------------------------
    // PASSWORD VALIDATION
    // -----------------------------------------------------

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // -----------------------------------------------------
    // CHECK EXISTING USER (Fast indexed query with lean _id)
    // -----------------------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail,
    })
      .select("_id")
      .lean();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: duplicateEmailMessage,
      });
    }

    // -----------------------------------------------------
    // HASH PASSWORD (Optimized bcrypt cost 10)
    // -----------------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // -----------------------------------------------------
    // CREATE USER IN MONGODB (isVerified: true)
    // -----------------------------------------------------

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      isVerified: true,
    });

    // -----------------------------------------------------
    // GENERATE JWT TOKEN FOR INSTANT LOGIN
    // -----------------------------------------------------

    let token = null;
    if (process.env.JWT_SECRET) {
      token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
    }

    // -----------------------------------------------------
    // IMMEDIATE RESPONSE (FASTEST POSSIBLE REGISTRATION)
    // -----------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Registration successful! You can now login.",
      token,
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered. Please login or use forgot password.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error during registration. Please try again.",
    });
  }
};

// =========================================================
// RESEND VERIFICATION EMAIL
// POST /api/auth/resend-verification
// =========================================================

const resendVerification = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "Welcome email sent if the account exists.",
      });
    }

    // Respond immediately to client
    res.status(200).json({
      success: true,
      message: "Welcome email sent successfully. Please check your inbox.",
    });

    // Send email asynchronously in background
    setImmediate(() => {
      sendWelcomeEmail(
        user.email,
        user.name
      ).catch((emailError) => {
        console.error("Async welcome email error:", emailError);
      });
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to send the email. Please try again later.",
    });
  }
};

// =========================================================
// VERIFY EMAIL
// GET /api/auth/verify-email?token=...
// =========================================================

const verifyEmail = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Email is already active! You can log in.",
  });
};

// =========================================================
// LOGIN USER
// POST /api/auth/login
// =========================================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // -----------------------------------------------------
    // FIND USER
    // -----------------------------------------------------

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // -----------------------------------------------------
    // PASSWORD CHECK
    // -----------------------------------------------------

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // -----------------------------------------------------
    // JWT SECRET CHECK
    // -----------------------------------------------------

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from .env"
      );

      return res.status(500).json({
        success: false,
        message:
          "Server configuration error.",
      });
    }

    // -----------------------------------------------------
    // GENERATE JWT
    // -----------------------------------------------------

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // -----------------------------------------------------
    // RESPONSE
    // -----------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error during login. Please try again.",
    });
  }
};

// =========================================================
// GET CURRENT USER
// GET /api/auth/me
// =========================================================

const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select(
      "-password -verificationToken -verificationTokenExpires -resetPasswordToken -resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error("Get Me Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching user",
    });
  }
};

// =========================================================
// UPDATE PROFILE
// PUT /api/auth/profile
// =========================================================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------------
    // UPDATE FIELDS
    // -----------------------------------------------------

    if (name !== undefined) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (address !== undefined) {
      user.address = address.trim();
    }

    if (city !== undefined) {
      user.city = city.trim();
    }

    if (state !== undefined) {
      user.state = state.trim();
    }

    if (pincode !== undefined) {
      user.pincode = pincode.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: getUserResponse(user),
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating profile",
    });
  }
};

// =========================================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// =========================================================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All password fields are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    if (
      newPassword !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    // -----------------------------------------------------
    // FIND USER
    // -----------------------------------------------------

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // -----------------------------------------------------
    // CURRENT PASSWORD
    // -----------------------------------------------------

    const isCurrentPasswordValid =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    // -----------------------------------------------------
    // SAME PASSWORD CHECK
    // -----------------------------------------------------

    const isSamePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    // -----------------------------------------------------
    // HASH NEW PASSWORD (Cost 10)
    // -----------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password = hashedPassword;

    // Clear reset password data
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while changing password",
    });
  }
};

// =========================================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password
// =========================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const genericMessage =
      "If an account exists with this email, a password reset link has been sent.";

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    // -----------------------------------------------------
    // CREATE RESET TOKEN
    // -----------------------------------------------------

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpires =
      new Date(
        Date.now() + 15 * 60 * 1000
      );

    await user.save();

    // Respond immediately to client
    res.status(200).json({
      success: true,
      message: genericMessage,
    });

    // Send reset email asynchronously in background
    setImmediate(() => {
      sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken
      ).catch((emailError) => {
        console.error("Async password reset email error:", emailError);
      });
    });
  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error. Please try again later.",
    });
  }
};

// =========================================================
// RESET PASSWORD
// POST /api/auth/reset-password/:token
// =========================================================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const {
      password,
      confirmPassword,
    } = req.body;

    // -----------------------------------------------------
    // TOKEN
    // -----------------------------------------------------

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token is required",
      });
    }

    // -----------------------------------------------------
    // PASSWORD
    // -----------------------------------------------------

    if (
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    if (
      password !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    // -----------------------------------------------------
    // FIND USER
    // -----------------------------------------------------

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset link is invalid or has expired.",
      });
    }

    // -----------------------------------------------------
    // HASH PASSWORD (Cost 10)
    // -----------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    user.password =
      hashedPassword;

    // -----------------------------------------------------
    // CLEAR RESET TOKEN
    // -----------------------------------------------------

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully! You can now log in with your new password.",
    });
  } catch (error) {
    console.error(
      "Reset Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during password reset",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  register,
  resendVerification,
  verifyEmail,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};