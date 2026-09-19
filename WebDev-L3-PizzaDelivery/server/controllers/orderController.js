const Order = require("../models/Order");
const Inventory = require("../models/Inventory");
const User = require("../models/User");

// Allowed order statuses
const ALLOWED_STATUSES = [
  "ORDER_RECEIVED",
  "IN_KITCHEN",
  "SENT_TO_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

// Status display map
const STATUS_MAP = {
  ORDER_RECEIVED: "Order Received",
  IN_KITCHEN: "In Kitchen",
  SENT_TO_DELIVERY: "Sent to Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// ==========================================
// CREATE USER ORDER WITH INVENTORY DECREMENT
// POST /api/orders
// ==========================================
const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      pizzaConfiguration,
      quantity = 1,
      totalAmount,
      deliveryAddress,
      paymentId,
      items,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to place an order.",
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount for the order.",
      });
    }

    const orderQty = Math.max(1, Number(quantity) || 1);

    // ==========================================
    // INVENTORY STOCK CHECK & DECREMENT
    // ==========================================
    const ingredientsNeeded = [];

    if (pizzaConfiguration) {
      if (pizzaConfiguration.base?.name) {
        ingredientsNeeded.push({
          name: pizzaConfiguration.base.name.trim(),
          qty: 1 * orderQty,
        });
      }
      if (pizzaConfiguration.sauce?.name) {
        ingredientsNeeded.push({
          name: pizzaConfiguration.sauce.name.trim(),
          qty: 1 * orderQty,
        });
      }
      if (pizzaConfiguration.cheese?.name) {
        ingredientsNeeded.push({
          name: pizzaConfiguration.cheese.name.trim(),
          qty: 1 * orderQty,
        });
      }
      if (Array.isArray(pizzaConfiguration.vegetables)) {
        pizzaConfiguration.vegetables.forEach((veg) => {
          if (veg?.name) {
            ingredientsNeeded.push({
              name: veg.name.trim(),
              qty: 1 * orderQty,
            });
          }
        });
      }
    }

    // Check inventory items if they exist in DB
    const inventoryItemsToUpdate = [];

    for (const reqItem of ingredientsNeeded) {
      const invDoc = await Inventory.findOne({
        name: { $regex: new RegExp(`^${reqItem.name}$`, "i") },
      });

      if (invDoc) {
        if (invDoc.stock < reqItem.qty) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for "${invDoc.name}". Only ${invDoc.stock} available.`,
          });
        }
        inventoryItemsToUpdate.push({
          doc: invDoc,
          decrementBy: reqItem.qty,
        });
      }
    }

    // Decrement stock for all matched ingredients
    for (const item of inventoryItemsToUpdate) {
      item.doc.stock = Math.max(0, item.doc.stock - item.decrementBy);
      await item.doc.save();
    }

    // Create Order in MongoDB
    const newOrder = await Order.create({
      user: userId,
      items: items || [
        {
          name: "Custom Pizza",
          quantity: orderQty,
          price: totalAmount,
        },
      ],
      pizzaConfiguration: pizzaConfiguration || {},
      quantity: orderQty,
      totalAmount,
      paymentStatus: "PAID",
      paymentId: paymentId || `PAY_${Date.now()}`,
      orderStatus: "ORDER_RECEIVED",
      deliveryAddress: deliveryAddress || {
        street: "221B Baker Street",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
        fullAddress: "221B Baker Street, Mumbai, Maharashtra 400001",
      },
    });

    const populatedOrder = await Order.findById(newOrder._id).populate(
      "user",
      "name email"
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
    });
  }
};

// ==========================================
// GET USER'S OWN ORDERS
// GET /api/orders/my-orders
// ==========================================
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
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
// ADMIN: GET ALL ORDERS
// GET /api/admin/orders
// ==========================================
const getAllOrders = async (req, res) => {
  try {
    const ordersRaw = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const formattedOrders = ordersRaw.map((order) => {
      const base = order.pizzaConfiguration?.base?.name;
      const sauce = order.pizzaConfiguration?.sauce?.name;
      const cheese = order.pizzaConfiguration?.cheese?.name;
      const vegList =
        order.pizzaConfiguration?.vegetables?.map((v) => v.name).join(", ") ||
        "";

      let pizzaDescription = "Custom Veg Pizza";
      if (base && cheese) {
        pizzaDescription = `${base} (${cheese}${vegList ? `, ${vegList}` : ""})`;
      } else if (order.items?.[0]?.name) {
        pizzaDescription = order.items[0].name;
      }

      // Elapsed time
      const diffMs = Date.now() - new Date(order.createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      let timeText = "Just now";
      if (diffMins < 60) {
        timeText = `${diffMins} min ago`;
      } else if (diffMins < 1440) {
        timeText = `${Math.floor(diffMins / 60)}h ago`;
      } else {
        timeText = `${Math.floor(diffMins / 1440)}d ago`;
      }

      return {
        _id: order._id,
        id: order.orderId || `#PH${order._id.toString().slice(-4)}`,
        customer: order.user?.name || "Customer",
        email: order.user?.email || "customer@pizzahub.com",
        pizza: pizzaDescription,
        amount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        status: STATUS_MAP[order.orderStatus] || order.orderStatus,
        rawStatus: order.orderStatus,
        time: timeText,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt,
      };
    });

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
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

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

    // Map UI friendly labels to DB enum if necessary
    const reverseStatusMap = {
      "Order Received": "ORDER_RECEIVED",
      "In Kitchen": "IN_KITCHEN",
      "Sent to Delivery": "SENT_TO_DELIVERY",
      Delivered: "DELIVERED",
      Cancelled: "CANCELLED",
      ORDER_RECEIVED: "ORDER_RECEIVED",
      IN_KITCHEN: "IN_KITCHEN",
      SENT_TO_DELIVERY: "SENT_TO_DELIVERY",
      DELIVERED: "DELIVERED",
      CANCELLED: "CANCELLED",
    };

    const normalizedStatus = reverseStatusMap[status];

    if (!normalizedStatus || !ALLOWED_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = normalizedStatus;
    const updatedOrder = await order.save();

    const populated = await Order.findById(updatedOrder._id).populate(
      "user",
      "name email"
    );

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

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
