
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

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

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
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
        mongoose.Types.ObjectId.isValid(String(rawProductId));

      return {
        product: isValidObjectId ? rawProductId : null,
        name: item.name || "Pizza",
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        image: item.image || "",
      };
    });

    // ==========================================
    // INVENTORY CHECK
    // ==========================================

    for (const item of normalizedItems) {
      const inventoryItem = await Inventory.findOne({
        name: {
          $regex: new RegExp(
            `^${item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i"
          ),
        },
      });

      if (inventoryItem) {
        const requiredQty = item.quantity;

        if (inventoryItem.stock < requiredQty) {
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
      const inventoryItem = await Inventory.findOne({
        name: {
          $regex: new RegExp(
            `^${item.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
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

    const paymentStatus =
      paymentMethod === "COD" ? "PENDING" : "PENDING";

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

      paymentMethod,
      paymentStatus,

      orderStatus: "PLACED",

      subtotal: Number(subtotal) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      discount: Number(discount) || 0,
      total: Number(total) || 0,
    });

    // ==========================================
    // POPULATE USER
    // ==========================================

    const populatedOrder = await Order.findById(
      newOrder._id
    ).populate("user", "name email");

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order: populatedOrder,
      data: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error:
        process.env.NODE_ENV === "development"
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
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const orders = await Order.find({
      user: userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
      data: orders,
    });
  } catch (error) {
    console.error("Get user orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// ==========================================
// USER: CANCEL ORDER
// PUT /api/orders/my-orders/:orderId/cancel
// ==========================================

const cancelUserOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { orderId } = req.params;

    console.log("========== CANCEL DEBUG ==========");
    console.log("req.params:", req.params);
    console.log("orderId:", orderId);
    console.log("req.user:", req.user);
    console.log("userId:", userId);
    console.log("user._id:", req.user?._id);
    console.log("=================================");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid MongoDB order ID.",
      });
    }

    // ==========================================
    // FIND ORDER BY MONGODB ID, THEN VERIFY OWNERSHIP
    // ==========================================

    const orderById = await Order.findById(orderId);

    console.log("ORDER BY ID:", orderById);

    if (!orderById) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    });

    console.log("ORDER WITH USER:", order);

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order.",
      });
    }

    // ==========================================
    // CHECK CANCELLATION STATUS
    // ==========================================

    if (!["PLACED", "CONFIRMED"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "This order cannot be cancelled now. Orders can only be cancelled before preparation starts.",
      });
    }

      // Claim the transition atomically so a repeated request cannot restore stock twice.
      const cancelledOrder = await Order.findOneAndUpdate(
        {
          _id: orderId,
          user: userId,
          orderStatus: { $in: ["PLACED", "CONFIRMED"] },
        },
        { $set: { orderStatus: "CANCELLED" } },
        { returnDocument: "after", runValidators: true }
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
    // Since inventory was decreased when order was created,
    // restore the quantity when user cancels the order.

    for (const item of cancelledOrder.items) {
      const inventoryItem = await Inventory.findOne({
        name: {
          $regex: new RegExp(
            `^${(item.name || "").replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            )}$`,
            "i"
          ),
        },
      });

      if (inventoryItem) {
        inventoryItem.stock += Number(item.quantity) || 0;

        await inventoryItem.save();
      }
    }

    // ==========================================
    // POPULATE UPDATED ORDER
    // ==========================================

    const populatedOrder = await Order.findById(
      cancelledOrder._id
    )
      .populate("user", "name email")
      .populate("items.product");

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order: populatedOrder,
      data: populatedOrder,
    });
  } catch (error) {
    console.error("Cancel user order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order.",
      error:
        process.env.NODE_ENV === "development"
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
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => ({
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

      pizza:
        order.items
          ?.map(
            (item) =>
              `${item.name} x${item.quantity}`
          )
          .join(", ") || "Pizza",

      amount: order.total,

      paymentStatus: order.paymentStatus,

      paymentMethod: order.paymentMethod,

      status:
        STATUS_MAP[order.orderStatus] ||
        order.orderStatus,

      rawStatus: order.orderStatus,

      time: order.createdAt,

      shippingAddress: order.shippingAddress,

      createdAt: order.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// ==========================================
// ADMIN: GET SINGLE ORDER
// GET /api/admin/orders/:id
// ==========================================

const getOrderById = async (req, res) => {
  try {
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
      data: order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details.",
    });
  }
};

// ==========================================
// ADMIN: UPDATE ORDER STATUS
// PATCH /api/admin/orders/:id/status
// ==========================================

const updateOrderStatus = async (req, res) => {
  try {
    let { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required.",
      });
    }

    const reverseStatusMap = {
      "order placed": "PLACED",
      "order received": "PLACED",
      confirmed: "CONFIRMED",
      "in kitchen": "PREPARING",
      preparing: "PREPARING",
      "sent to delivery": "OUT_FOR_DELIVERY",
      "out for delivery": "OUT_FOR_DELIVERY",
      delivered: "DELIVERED",
      cancelled: "CANCELLED",
      placed: "PLACED",
      order_received: "PLACED",
      in_kitchen: "PREPARING",
      sent_to_delivery: "OUT_FOR_DELIVERY",

      "Order Placed": "PLACED",
      "Order Received": "PLACED",
      Confirmed: "CONFIRMED",
      "In Kitchen": "PREPARING",
      Preparing: "PREPARING",
      "Sent to Delivery": "OUT_FOR_DELIVERY",
      "Out for Delivery": "OUT_FOR_DELIVERY",
      Delivered: "DELIVERED",
      Cancelled: "CANCELLED",

      PLACED: "PLACED",
      CONFIRMED: "CONFIRMED",
      PREPARING: "PREPARING",
      OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
      DELIVERED: "DELIVERED",
      CANCELLED: "CANCELLED",
    };

    const normalizedStatus =
      reverseStatusMap[status] ||
      reverseStatusMap[status.toString().trim()] ||
      reverseStatusMap[
        status.toString().trim().toLowerCase()
      ];

    if (
      !normalizedStatus ||
      !ALLOWED_STATUSES.includes(normalizedStatus)
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

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // ==========================================
    // UPDATE STATUS
    // ==========================================

    order.orderStatus = normalizedStatus;

    if (normalizedStatus === "DELIVERED") {
      order.paymentStatus = "PAID";
    }

    const updatedOrder = await order.save();

    // ==========================================
    // POPULATE UPDATED ORDER
    // ==========================================

    const populated = await Order.findById(
      updatedOrder._id
    )
      .populate("user", "name email")
      .populate("items.product");

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${STATUS_MAP[normalizedStatus]}".`,
      data: populated,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
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
};
