const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/sendEmail");

// =========================
// USER RESPONSE HELPER
// =========================

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
    isVerified: user.isVerified,
  };
};

// =========================
// REGISTER USER
// =========================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // =========================
    // EMAIL VALIDATION
    // =========================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // =========================
    // PASSWORD VALIDATION
    // =========================

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

    // =========================
    // CHECK EXISTING USER
    // =========================

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword = await bcrypt.hash(password, 12);

    // =========================
    // VERIFICATION TOKEN
    // =========================

    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    const verificationTokenExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // =========================
    // CREATE USER
    // =========================

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,

      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",

      isVerified: false,

      verificationToken,
      verificationTokenExpires,
    });

    // =========================
    // SEND VERIFICATION EMAIL
    // =========================

    try {
      await sendVerificationEmail(
        user.email,
        user.name,
        verificationToken
      );
    } catch (emailErr) {
      console.warn(
        "⚠️ Warning: Email sending failed:",
        emailErr.message
      );

      console.log(
        `🔗 Verification Link for ${user.email}: ${
          process.env.CLIENT_URL || "http://localhost:5173"
        }/verify-email?token=${verificationToken}`
      );
    }

    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error during registration. Please try again.",
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

    // =========================
    // FIND USER
    // =========================

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Verification link is invalid or has expired.",
      });
    }

    // =========================
    // VERIFY USER
    // =========================

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);

    return res.status(500).json({
      success: false,
      message:
        "Server error during email verification",
    });
  }
};

// =========================
// LOGIN
// =========================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // =========================
    // FIND USER
    // =========================

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // =========================
    // VERIFY PASSWORD
    // =========================

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

    // =========================
    // EMAIL VERIFICATION
    // =========================

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email before logging in. Check your inbox for the verification link.",
      });
    }

    // =========================
    // GENERATE JWT
    // =========================

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

    // =========================
    // RESPONSE
    // =========================

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

// =========================
// GET CURRENT USER
// =========================

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

// =========================
// UPDATE PROFILE
// =========================

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

    // =========================
    // UPDATE FIELDS
    // =========================

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

// =========================
// CHANGE PASSWORD
// =========================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // =========================
    // VALIDATION
    // =========================

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

    // =========================
    // NEW PASSWORD LENGTH
    // =========================

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    // =========================
    // CONFIRM PASSWORD
    // =========================

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    // =========================
    // FIND USER
    // =========================

    const user = await User.findById(
      req.user.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =========================
    // CHECK CURRENT PASSWORD
    // =========================

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

    // =========================
    // CHECK SAME PASSWORD
    // =========================

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

    // =========================
    // HASH NEW PASSWORD
    // =========================

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    user.password = hashedPassword;

    // Clear any old reset-password token
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    // =========================
    // RESPONSE
    // =========================

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

// =========================
// FORGOT PASSWORD
// =========================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const genericMessage =
      "If an account exists with this email, a password reset link has been sent.";

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    // =========================
    // RESET TOKEN
    // =========================

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

    // =========================
    // SEND EMAIL
    // =========================

    try {
      await sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken
      );
    } catch (emailErr) {
      console.warn(
        "⚠️ Warning: Password reset email sending failed:",
        emailErr.message
      );

      console.log(
        `🔗 Password Reset Link for ${user.email}: ${
          process.env.CLIENT_URL || "http://localhost:5173"
        }/reset-password/${resetToken}`
      );
    }

    return res.status(200).json({
      success: true,
      message: genericMessage,
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

// =========================
// RESET PASSWORD
// =========================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const {
      password,
      confirmPassword,
    } = req.body;

    // =========================
    // TOKEN VALIDATION
    // =========================

    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "Reset token is required",
      });
    }

    // =========================
    // PASSWORD VALIDATION
    // =========================

    if (!password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Passwords do not match",
      });
    }

    // =========================
    // FIND USER
    // =========================

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

    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    user.password =
      hashedPassword;

    // =========================
    // CLEAR RESET TOKEN
    // =========================

    user.resetPasswordToken =
      null;

    user.resetPasswordExpires =
      null;

    await user.save();

    // =========================
    // RESPONSE
    // =========================

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

// =========================
// EXPORTS
// =========================

module.exports = {
  register,
  verifyEmail,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};