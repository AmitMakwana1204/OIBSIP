const jwt = require("jsonwebtoken");

// =========================
// PROTECT USER ROUTES
// =========================

const protect = (req, res, next) => {
  try {
    // =========================
    // GET AUTHORIZATION HEADER
    // =========================

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token provided.",
      });
    }

    // =========================
    // GET TOKEN
    // =========================

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. No token provided.",
      });
    }

    // =========================
    // VERIFY TOKEN
    // =========================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =========================
    // ATTACH USER
    // =========================

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error(
      "Auth Middleware Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = {
  protect,
};