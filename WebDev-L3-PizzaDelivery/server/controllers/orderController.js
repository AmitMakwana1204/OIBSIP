const mongoose = require("mongoose");

const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const Notification = require("../models/Notification");

// ==========================================
// ORDER STATUS
// ==========================================

const ALLOWED_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_MAP = {
  PLACED: "Order Placed",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// ==========================================
// PAYMENT STATUS
// ==========================================

const ALLOWED_PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "FAILED",
];

// ==========================================
// CREATE USER ORDER
// POST /api/orders
// ==========================================

const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to place an order.",
      });
    }

    const {
      items,
      customer,
      shippingAddress,
      paymentMethod = "COD",
      subtotal = 0,
      deliveryFee = 0,
      discount = 0,
      total = 0,
    } = req.body;

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item.",
      });
    }

    if (!customer?.name || !customer?.phone) {
      return res.status(400).json({
        success: false,
        message: "Customer name and phone are required.",
      });
    }

    if (
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address is required.",
      });
    }

    // ==========================================
    // PAYMENT METHOD VALIDATION
    // COD + MANUAL ONLY
    // ==========================================

    const normalizedPaymentMethod =
      paymentMethod.toString().trim().toUpperCase();

    if (!["COD", "MANUAL"].includes(normalizedPaymentMethod)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment method. Allowed methods are COD or MANUAL.",
      });
    }

    if (Number(total) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount for the order.",
      });
    }

    // ==========================================
    // NORMALIZE ITEMS
    // ==========================================

    const normalizedItems = items.map((item) => {
      const rawProductId =
        item.product ||
        item.productId ||
        item._id ||
        item.id ||
        null;

      const isValidObjectId =
        rawProductId &&
        mongoose.Types.ObjectId.isValid(
          String(rawProductId)
        );

      return {
        product: isValidObjectId
          ? rawProductId
          : null,

        name: item.name || "Pizza",

        price: Number(item.price) || 0,

        quantity: Math.max(
          1,
          Number(item.quantity) || 1
        ),

        image: item.image || "",
      };
    });

    // ==========================================
    // INVENTORY CHECK
    // ==========================================

    for (const item of normalizedItems) {
      const escapedName = item.name.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const inventoryItem =
        await Inventory.findOne({
          name: {
            $regex: new RegExp(
              `^${escapedName}$`,
              "i"
            ),
          },
        });

      if (inventoryItem) {
        const requiredQty = item.quantity;

        if (
          inventoryItem.stock < requiredQty
        ) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${inventoryItem.name}". Only ${inventoryItem.stock} available.`,
          });
        }
      }
    }

    // ==========================================
    // DECREMENT INVENTORY
    // ==========================================

    for (const item of normalizedItems) {
      const escapedName = item.name.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const inventoryItem =
        await Inventory.findOne({
          name: {
            $regex: new RegExp(
              `^${escapedName}$`,
              "i"
            ),
          },
        });

      if (inventoryItem) {
        inventoryItem.stock = Math.max(
          0,
          inventoryItem.stock - item.quantity
        );

        await inventoryItem.save();
      }
    }

    // ==========================================
    // PAYMENT STATUS
    // ==========================================
    // COD     -> PENDING
    // MANUAL  -> PENDING
    //
    // Admin will later change:
    // PENDING -> PAID / FAILED
    // ==========================================

    const paymentStatus = "PENDING";

    // ==========================================
    // CREATE ORDER
    // ==========================================

    const newOrder = await Order.create({
      user: userId,

      items: normalizedItems,

      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
      },

      shippingAddress: {
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        pincode: shippingAddress.pincode.trim(),
      },

      paymentMethod:
        normalizedPaymentMethod,

      paymentStatus,

      orderStatus: "PLACED",

      subtotal: Number(subtotal) || 0,

      deliveryFee:
        Number(deliveryFee) || 0,

      discount:
        Number(discount) || 0,

      total:
        Number(total) || 0,
    });

    // ==========================================
    // ADMIN NOTIFICATION
    // NEW ORDER
    // ==========================================

    try {
      await Notification.create({
        title: "New Order Received",

        message: `New order #${newOrder._id
          .toString()
          .slice(-6)
          .toUpperCase()} has been placed by ${
          customer.name
        }. Payment: ${normalizedPaymentMethod}.`,

        type: "order",

        orderId: newOrder._id,

        read: false,
      });
    } catch (notificationError) {
      console.error(
        "New order notification error:",
        notificationError
      );
    }

    // ==========================================
    // POPULATE USER
    // ==========================================

    const populatedOrder =
      await Order.findById(
        newOrder._id
      ).populate(
        "user",
        "name email"
      );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,

      message:
        "Order placed successfully.",

      order: populatedOrder,

      data: populatedOrder,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to create order.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

// ==========================================
// GET USER ORDERS
// GET /api/orders/my-orders
// ==========================================

const getUserOrders = async (req, res) => {
  try {
    const userId =
      req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const orders = await Order.find({
      user: userId,
    })
      .populate("items.product")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      count: orders.length,

      orders,

      data: orders,
    });
  } catch (error) {
    console.error(
      "Get user orders error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch orders.",
    });
  }
};

// ==========================================
// USER: CANCEL ORDER
// PUT /api/orders/my-orders/:orderId/cancel
// ==========================================

const cancelUserOrder = async (req, res) => {
  try {
    const userId =
      req.user?.id || req.user?._id;

    const { orderId } = req.params;

    console.log(
      "========== CANCEL DEBUG =========="
    );

    console.log(
      "req.params:",
      req.params
    );

    console.log(
      "orderId:",
      orderId
    );

    console.log(
      "req.user:",
      req.user
    );

    console.log(
      "userId:",
      userId
    );

    console.log(
      "================================="
    );

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    // ==========================================
    // ORDER ID VALIDATION
    // ==========================================

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID is required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        orderId
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid MongoDB order ID.",
      });
    }

    // ==========================================
    // FIND ORDER BY ID
    // ==========================================

    const orderById =
      await Order.findById(orderId);

    if (!orderById) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    // ==========================================
    // VERIFY OWNERSHIP
    // ==========================================

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to cancel this order.",
      });
    }

    // ==========================================
    // CHECK CANCELLATION STATUS
    // ==========================================

    if (
      !["PLACED", "CONFIRMED"].includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order cannot be cancelled now. Orders can only be cancelled before preparation starts.",
      });
    }

    // ==========================================
    // ATOMIC CANCEL
    // ==========================================

    const cancelledOrder =
      await Order.findOneAndUpdate(
        {
          _id: orderId,
          user: userId,

          orderStatus: {
            $in: [
              "PLACED",
              "CONFIRMED",
            ],
          },
        },

        {
          $set: {
            orderStatus:
              "CANCELLED",
          },
        },

        {
          returnDocument: "after",
          runValidators: true,
        }
      );

    if (!cancelledOrder) {
      return res.status(400).json({
        success: false,
        message:
          "This order cannot be cancelled now. Orders can only be cancelled before preparation starts.",
      });
    }

    // ==========================================
    // RESTORE INVENTORY
    // ==========================================

    for (const item of cancelledOrder.items) {
      const escapedName = (
        item.name || ""
      ).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const inventoryItem =
        await Inventory.findOne({
          name: {
            $regex: new RegExp(
              `^${escapedName}$`,
              "i"
            ),
          },
        });

      if (inventoryItem) {
        inventoryItem.stock +=
          Number(item.quantity) || 0;

        await inventoryItem.save();
      }
    }

    // ==========================================
    // ADMIN NOTIFICATION
    // ORDER CANCELLED
    // ==========================================

    try {
      await Notification.create({
        title: "Order Cancelled",

        message: `Order #${cancelledOrder._id
          .toString()
          .slice(-6)
          .toUpperCase()} was cancelled by ${
          cancelledOrder.customer?.name ||
          "Customer"
        }.`,

        type: "cancel",

        orderId:
          cancelledOrder._id,

        read: false,
      });
    } catch (notificationError) {
      console.error(
        "Order cancellation notification error:",
        notificationError
      );
    }

    // ==========================================
    // POPULATE UPDATED ORDER
    // ==========================================

    const populatedOrder =
      await Order.findById(
        cancelledOrder._id
      )
        .populate(
          "user",
          "name email"
        )
        .populate(
          "items.product"
        );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "Order cancelled successfully.",

      order: populatedOrder,

      data: populatedOrder,
    });
  } catch (error) {
    console.error(
      "Cancel user order error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to cancel order.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

// ==========================================
// ADMIN: GET ALL ORDERS
// GET /api/admin/orders
// ==========================================

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .populate("items.product")
      .sort({
        createdAt: -1,
      });

    const formattedOrders =
      orders.map((order) => ({
        _id: order._id,

        id:
          order.orderId ||
          `#PH${order._id
            .toString()
            .slice(-6)
            .toUpperCase()}`,

        customer:
          order.customer?.name ||
          order.user?.name ||
          "Customer",

        email:
          order.user?.email ||
          "customer@pizzahub.com",

        phone:
          order.customer?.phone ||
          "",

        pizza:
          order.items
            ?.map(
              (item) =>
                `${item.name} x${item.quantity}`
            )
            .join(", ") ||
          "Pizza",

        amount: order.total,

        paymentStatus:
          order.paymentStatus,

        paymentMethod:
          order.paymentMethod,

        manualPayment:
          order.manualPayment || {},

        status:
          STATUS_MAP[
            order.orderStatus
          ] ||
          order.orderStatus,

        rawStatus:
          order.orderStatus,

        time:
          order.createdAt,

        shippingAddress:
          order.shippingAddress,

        createdAt:
          order.createdAt,
      }));

    return res.status(200).json({
      success: true,

      count:
        formattedOrders.length,

      data: formattedOrders,
    });
  } catch (error) {
    console.error(
      "Get all orders error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch orders.",
    });
  }
};

// ==========================================
// ADMIN: GET SINGLE ORDER
// GET /api/admin/orders/:id
// ==========================================

const getOrderById = async (req, res) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email"
        )
        .populate(
          "items.product"
        );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(
      "Get order by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch order details.",
    });
  }
};

// ==========================================
// ADMIN: UPDATE ORDER STATUS
// PATCH /api/admin/orders/:id/status
// ==========================================

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message:
          "Order status is required.",
      });
    }

    // ==========================================
    // STATUS NORMALIZATION
    // ==========================================

    const reverseStatusMap = {
      "order placed": "PLACED",
      "order received": "PLACED",

      confirmed: "CONFIRMED",

      "in kitchen": "PREPARING",
      preparing: "PREPARING",

      "sent to delivery":
        "OUT_FOR_DELIVERY",

      "out for delivery":
        "OUT_FOR_DELIVERY",

      delivered: "DELIVERED",

      cancelled: "CANCELLED",

      placed: "PLACED",

      order_received: "PLACED",

      in_kitchen: "PREPARING",

      sent_to_delivery:
        "OUT_FOR_DELIVERY",

      "Order Placed": "PLACED",
      "Order Received": "PLACED",

      Confirmed: "CONFIRMED",

      "In Kitchen": "PREPARING",
      Preparing: "PREPARING",

      "Sent to Delivery":
        "OUT_FOR_DELIVERY",

      "Out for Delivery":
        "OUT_FOR_DELIVERY",

      Delivered: "DELIVERED",

      Cancelled: "CANCELLED",

      PLACED: "PLACED",
      CONFIRMED: "CONFIRMED",
      PREPARING: "PREPARING",

      OUT_FOR_DELIVERY:
        "OUT_FOR_DELIVERY",

      DELIVERED: "DELIVERED",
      CANCELLED: "CANCELLED",
    };

    const normalizedStatus =
      reverseStatusMap[status] ||
      reverseStatusMap[
        status
          .toString()
          .trim()
      ] ||
      reverseStatusMap[
        status
          .toString()
          .trim()
          .toLowerCase()
      ];

    if (
      !normalizedStatus ||
      !ALLOWED_STATUSES.includes(
        normalizedStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(
          ", "
        )}`,
      });
    }

    // ==========================================
    // FIND ORDER
    // ==========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order ID.",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    order.orderStatus =
      normalizedStatus;

    // IMPORTANT:
    // DELIVERED no longer automatically
    // changes payment status to PAID.
    //
    // Payment is controlled separately
    // by admin using updatePaymentStatus().
    // ==========================================

    const updatedOrder =
      await order.save();

    // ==========================================
    // POPULATE UPDATED ORDER
    // ==========================================

    const populated =
      await Order.findById(
        updatedOrder._id
      )
        .populate(
          "user",
          "name email"
        )
        .populate(
          "items.product"
        );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message: `Order status updated to "${STATUS_MAP[normalizedStatus]}".`,

      data: populated,
    });
  } catch (error) {
    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update order status.",
    });
  }
};

// ==========================================
// ADMIN: UPDATE PAYMENT STATUS
// PATCH /api/admin/orders/:id/payment-status
// ==========================================

const updatePaymentStatus = async (
  req,
  res
) => {
  try {
    const { paymentStatus } =
      req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,

        message:
          "Payment status is required.",
      });
    }

    // ==========================================
    // NORMALIZE PAYMENT STATUS
    // ==========================================

    const normalizedPaymentStatus =
      paymentStatus
        .toString()
        .trim()
        .toUpperCase();

    if (
      !ALLOWED_PAYMENT_STATUSES.includes(
        normalizedPaymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,

        message: `Invalid payment status. Allowed values: ${ALLOWED_PAYMENT_STATUSES.join(
          ", "
        )}`,
      });
    }

    // ==========================================
    // VALIDATE ORDER ID
    // ==========================================

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid order ID.",
      });
    }

    // ==========================================
    // FIND ORDER
    // ==========================================

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found.",
      });
    }

    // ==========================================
    // UPDATE PAYMENT STATUS
    // ==========================================

    order.paymentStatus =
      normalizedPaymentStatus;

    const updatedOrder =
      await order.save();

    // ==========================================
    // POPULATE UPDATED ORDER
    // ==========================================

    const populated =
      await Order.findById(
        updatedOrder._id
      )
        .populate(
          "user",
          "name email"
        )
        .populate(
          "items.product"
        );

    // ==========================================
    // NOTIFICATION
    // ==========================================

    try {
      await Notification.create({
        title:
          "Payment Status Updated",

        message: `Payment status for order #${updatedOrder._id
          .toString()
          .slice(-6)
          .toUpperCase()} changed to ${normalizedPaymentStatus}.`,

        type: "payment",

        orderId:
          updatedOrder._id,

        read: false,
      });
    } catch (notificationError) {
      console.error(
        "Payment notification error:",
        notificationError
      );
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message: `Payment status updated to "${normalizedPaymentStatus}".`,

      data: populated,
    });
  } catch (error) {
    console.error(
      "Update payment status error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to update payment status.",
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  createOrder,

  getUserOrders,

  cancelUserOrder,

  getAllOrders,

  getOrderById,

  updateOrderStatus,

  updatePaymentStatus,
};