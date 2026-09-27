const crypto = require("crypto");

const razorpay = require("../config/razorpay");
const Order = require("../models/Order");


// =========================================================
// CREATE RAZORPAY ORDER
// POST /api/payment/create-order
// =========================================================

const createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      amount,
      currency = "INR",
      receipt,
      orderId,
    } = req.body;

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount is required.",
      });
    }

    // Optional: connect Razorpay payment to MongoDB order
    let mongoOrder = null;

    if (orderId) {
      mongoOrder = await Order.findOne({
        _id: orderId,
        user: userId,
      });

      if (!mongoOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      if (mongoOrder.paymentMethod !== "ONLINE") {
        return res.status(400).json({
          success: false,
          message: "This order is not an online payment order.",
        });
      }
    }

    const options = {
      amount: Math.round(numericAmount * 100),
      currency,
      receipt:
        receipt ||
        `pizza_${Date.now()}`,
      notes: {
        userId: String(userId),
        orderId: orderId
          ? String(orderId)
          : "",
      },
    };

    const razorpayOrder =
      await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      message: "Payment order created successfully.",
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error(
      "Create Razorpay order error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


// =========================================================
// VERIFY RAZORPAY PAYMENT
// POST /api/payment/verify
// =========================================================

const verifyPayment = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Incomplete payment verification data.",
      });
    }

    // =====================================================
    // SIGNATURE
    // =====================================================

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    const isValid =
      generatedSignature ===
      razorpay_signature;

    if (!isValid) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Invalid payment signature.",
      });
    }

    // =====================================================
    // UPDATE MONGO ORDER
    // =====================================================

    let updatedOrder = null;

    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        user: userId,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      order.paymentStatus = "PAID";

      // Add Razorpay IDs dynamically.
      // This works only if schema allows them.
      order.razorpayOrderId =
        razorpay_order_id;

      order.razorpayPaymentId =
        razorpay_payment_id;

      order.razorpaySignature =
        razorpay_signature;

      await order.save();

      updatedOrder = order;
    }

    return res.status(200).json({
      success: true,
      verified: true,
      message: "Payment verified successfully.",
      payment: {
        razorpayOrderId:
          razorpay_order_id,
        razorpayPaymentId:
          razorpay_payment_id,
      },
      order: updatedOrder,
    });

  } catch (error) {
    console.error(
      "Verify Razorpay payment error:",
      error
    );

    return res.status(500).json({
      success: false,
      verified: false,
      message: "Payment verification failed.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};


module.exports = {
  createPaymentOrder,
  verifyPayment,
};