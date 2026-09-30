const mongoose = require("mongoose");

const Order = require("../models/Order");
const Notification = require("../models/Notification");

// =========================================================
// MANUAL PAYMENT CONFIGURATION
// =========================================================
//
// This can later be moved to database or admin settings.
// For now, it is a clean configuration object.
//
// DO NOT put real bank credentials here.
// Use placeholders that admin/business can configure later.
//
// =========================================================

const MANUAL_PAYMENT_CONFIG = {
  title: "Manual Payment",
  accountName: "PizzaHub Payments",
  paymentMethod: "UPI / Bank Transfer",
  upiId: "pizzahub@upi",
  instructions:
    "Please make the payment using the above UPI ID or bank transfer. After payment, enter your Transaction/Reference ID below. Your payment will be verified by admin before the order is confirmed.",
};

// =========================================================
// GET PAYMENT CONFIG
// GET /api/payment/config
// Public - returns manual payment instructions
// =========================================================

const getPaymentConfig = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      config: MANUAL_PAYMENT_CONFIG,
    });
  } catch (error) {
    console.error("Get payment config error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get payment configuration.",
    });
  }
};

// =========================================================
// SUBMIT MANUAL PAYMENT
// POST /api/payment/manual
// User - submit transaction details for an order
// =========================================================

const submitManualPayment = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      orderId,
      transactionId,
      paymentDate,
      note,
    } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    if (!transactionId || !transactionId.trim()) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID / Reference ID is required.",
      });
    }

    const trimmedTxnId = transactionId.trim();

    if (trimmedTxnId.length < 3 || trimmedTxnId.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Transaction ID must be between 3 and 100 characters.",
      });
    }

    // =====================================================
    // FIND ORDER (user's own order)
    // =====================================================

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or you are not authorized.",
      });
    }

    // =====================================================
    // PAYMENT METHOD CHECK
    // =====================================================

    if (order.paymentMethod !== "MANUAL") {
      return res.status(400).json({
        success: false,
        message: "This order does not use manual payment.",
      });
    }

    // =====================================================
    // DUPLICATE CHECK
    // Already submitted transaction
    // =====================================================

    if (
      order.manualPayment?.transactionId &&
      order.manualPayment?.submittedAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment details have already been submitted for this order.",
      });
    }

    // =====================================================
    // ALREADY PAID CHECK
    // =====================================================

    if (order.paymentStatus === "PAID") {
      return res.status(400).json({
        success: false,
        message: "This order is already paid.",
      });
    }

    // =====================================================
    // SAVE MANUAL PAYMENT DETAILS
    // =====================================================

    order.manualPayment = {
      transactionId: trimmedTxnId,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      note: note ? note.trim().substring(0, 500) : null,
      submittedAt: new Date(),
      verifiedAt: null,
      verifiedBy: null,
    };

    // Keep payment status PENDING until admin verifies
    order.paymentStatus = "PENDING";

    await order.save();

    // =====================================================
    // ADMIN NOTIFICATION
    // =====================================================

    try {
      await Notification.create({
        title: "Manual Payment Submitted",

        message: `Manual payment submitted for order #${order._id
          .toString()
          .slice(-6)
          .toUpperCase()}. Transaction ID: ${trimmedTxnId}`,

        type: "payment",
        orderId: order._id,
        read: false,
      });
    } catch (notificationError) {
      console.error(
        "Manual payment notification error:",
        notificationError
      );
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    const populated = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product");

    return res.status(200).json({
      success: true,
      message:
        "Payment details submitted successfully. Your payment will be verified by admin.",
      order: populated,
    });
  } catch (error) {
    console.error("Submit manual payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit payment details.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// =========================================================
// GET MY PAYMENTS
// GET /api/payment/my-payments
// User - get logged-in user's payment information
// =========================================================

const getMyPayments = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const orders = await Order.find({ user: userId })
      .select(
        "orderId paymentMethod paymentStatus manualPayment total customer createdAt orderStatus"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      payments: orders,
    });
  } catch (error) {
    console.error("Get my payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments.",
    });
  }
};

// =========================================================
// ADMIN: GET ALL PAYMENTS
// GET /api/admin/payments
// =========================================================

const getAdminPayments = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    const payments = orders.map((order) => ({
      _id: order._id,

      orderId:
        order.orderId ||
        `#PH${order._id.toString().slice(-6).toUpperCase()}`,

      customer: order.customer?.name || order.user?.name || "Customer",
      email: order.user?.email || "",
      phone: order.customer?.phone || "",

      amount: order.total || 0,

      paymentMethod: order.paymentMethod || "COD",
      paymentStatus: order.paymentStatus || "PENDING",

      manualPayment: order.manualPayment || {},

      orderStatus: order.orderStatus,

      items: order.items || [],

      shippingAddress: order.shippingAddress,

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Admin get payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments.",
    });
  }
};

// =========================================================
// ADMIN: GET SINGLE PAYMENT
// GET /api/admin/payments/:id
// =========================================================

const getAdminPaymentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: order._id,

        orderId:
          order.orderId ||
          `#PH${order._id.toString().slice(-6).toUpperCase()}`,

        customer:
          order.customer?.name || order.user?.name || "Customer",
        email: order.user?.email || "",
        phone: order.customer?.phone || "",

        amount: order.total || 0,
        subtotal: order.subtotal || 0,
        deliveryFee: order.deliveryFee || 0,
        discount: order.discount || 0,

        paymentMethod: order.paymentMethod || "COD",
        paymentStatus: order.paymentStatus || "PENDING",

        manualPayment: order.manualPayment || {},

        orderStatus: order.orderStatus,
        items: order.items || [],
        shippingAddress: order.shippingAddress,

        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Admin get payment by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment details.",
    });
  }
};

// =========================================================
// ADMIN: UPDATE PAYMENT STATUS
// PATCH /api/admin/payments/:id/status
// =========================================================

const updateAdminPaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const adminEmail =
      req.admin?.email || "admin";

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required.",
      });
    }

    const normalizedStatus = paymentStatus
      .toString()
      .trim()
      .toUpperCase();

    if (!["PENDING", "PAID", "FAILED"].includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid payment status. Allowed values: PENDING, PAID, FAILED',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // =====================================================
    // PREVENT DUPLICATE VERIFICATION
    // =====================================================

    if (
      order.paymentStatus === normalizedStatus
    ) {
      return res.status(400).json({
        success: false,
        message: `Payment is already marked as ${normalizedStatus}.`,
      });
    }

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    order.paymentStatus = normalizedStatus;

    // If marking as PAID, record verification details
    if (normalizedStatus === "PAID") {
      if (!order.manualPayment) {
        order.manualPayment = {};
      }
      order.manualPayment.verifiedAt = new Date();
      order.manualPayment.verifiedBy = adminEmail;

      // Auto-confirm order if it's still PLACED
      if (order.orderStatus === "PLACED") {
        order.orderStatus = "CONFIRMED";
      }
    }

    await order.save();

    // =====================================================
    // NOTIFICATION
    // =====================================================

    try {
      const notifTitle =
        normalizedStatus === "PAID"
          ? "Payment Verified"
          : normalizedStatus === "FAILED"
          ? "Payment Failed"
          : "Payment Status Updated";

      const notifMessage =
        normalizedStatus === "PAID"
          ? `Payment verified for order #${order._id
              .toString()
              .slice(-6)
              .toUpperCase()}.`
          : normalizedStatus === "FAILED"
          ? `Manual payment failed for order #${order._id
              .toString()
              .slice(-6)
              .toUpperCase()}. Please contact support or resubmit payment.`
          : `Payment status for order #${order._id
              .toString()
              .slice(-6)
              .toUpperCase()} changed to ${normalizedStatus}.`;

      await Notification.create({
        title: notifTitle,
        message: notifMessage,
        type: "payment",
        orderId: order._id,
        read: false,
      });
    } catch (notificationError) {
      console.error(
        "Payment status notification error:",
        notificationError
      );
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    const populated = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product");

    return res.status(200).json({
      success: true,
      message: `Payment status updated to "${normalizedStatus}".`,
      data: populated,
    });
  } catch (error) {
    console.error("Admin update payment status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update payment status.",
    });
  }
};

// =========================================================
// ADMIN: GET PAYMENT STATS
// GET /api/admin/payments/stats
// =========================================================

const getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Order.countDocuments();

    const pendingPayments = await Order.countDocuments({
      paymentStatus: "PENDING",
    });

    const paidPayments = await Order.countDocuments({
      paymentStatus: "PAID",
    });

    const failedPayments = await Order.countDocuments({
      paymentStatus: "FAILED",
    });

    // Amounts
    const paidAmountResult = await Order.aggregate([
      { $match: { paymentStatus: "PAID" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const pendingAmountResult = await Order.aggregate([
      { $match: { paymentStatus: "PENDING" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const failedAmountResult = await Order.aggregate([
      { $match: { paymentStatus: "FAILED" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalPayments,
        pendingPayments,
        paidPayments,
        failedPayments,
        totalPaidAmount:
          paidAmountResult.length > 0
            ? paidAmountResult[0].total
            : 0,
        pendingAmount:
          pendingAmountResult.length > 0
            ? pendingAmountResult[0].total
            : 0,
        failedAmount:
          failedAmountResult.length > 0
            ? failedAmountResult[0].total
            : 0,
      },
    });
  } catch (error) {
    console.error("Payment stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment statistics.",
    });
  }
};

// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  getPaymentConfig,
  submitManualPayment,
  getMyPayments,
  getAdminPayments,
  getAdminPaymentById,
  updateAdminPaymentStatus,
  getPaymentStats,
};