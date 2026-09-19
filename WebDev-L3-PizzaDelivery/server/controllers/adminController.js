const Admin = require("../models/Admin");
const Order = require("../models/Order");
const User = require("../models/User");
const Inventory = require("../models/Inventory");
const jwt = require("jsonwebtoken");

// ==========================================
// ADMIN LOGIN
// POST /api/admin/login
// ==========================================
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin login.",
    });
  }
};

// ==========================================
// GET ADMIN DASHBOARD STATS
// GET /api/admin/dashboard
// ==========================================
const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Revenue from paid/valid orders
    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: { $ne: "FAILED" },
          orderStatus: { $ne: "CANCELLED" },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // 2. Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Total Customers (registered users)
    const totalCustomers = await User.countDocuments();

    // 4. Low stock items (stock < threshold)
    const lowStockItems = await Inventory.countDocuments({
      $expr: { $lt: ["$stock", "$threshold"] },
    });

    // 5. Recent Orders (sorted newest first, limit 10)
    const recentOrdersRaw = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    const recentOrders = recentOrdersRaw.map((order) => {
      // Generate readable pizza name
      const base = order.pizzaConfiguration?.base?.name;
      const sauce = order.pizzaConfiguration?.sauce?.name;
      const cheese = order.pizzaConfiguration?.cheese?.name;
      const vegCount = order.pizzaConfiguration?.vegetables?.length || 0;
      let pizzaDescription = "Custom Pizza";
      if (base && cheese) {
        pizzaDescription = `${base} (${cheese}${vegCount > 0 ? ` + ${vegCount} Toppings` : ""})`;
      } else if (order.items?.[0]?.name) {
        pizzaDescription = order.items[0].name;
      }

      // Format time elapsed
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

      // Map status label
      const statusMap = {
        ORDER_RECEIVED: "Order Received",
        IN_KITCHEN: "In Kitchen",
        SENT_TO_DELIVERY: "Sent to Delivery",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled",
      };

      return {
        _id: order._id,
        id: order.orderId || `#PH${order._id.toString().slice(-4)}`,
        customer: order.user?.name || "Customer",
        email: order.user?.email || "customer@pizzahub.com",
        pizza: pizzaDescription,
        amount: `₹${order.totalAmount}`,
        rawAmount: order.totalAmount,
        time: timeText,
        status: statusMap[order.orderStatus] || order.orderStatus,
        rawStatus: order.orderStatus,
        createdAt: order.createdAt,
      };
    });

    // 6. Sales Overview grouped by day for current week (Mon-Sun)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();
    // Get start of the current week (Sunday or Monday)
    const currentDayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const weekOrders = await Order.find({
      createdAt: { $gte: startOfWeek },
      paymentStatus: { $ne: "FAILED" },
      orderStatus: { $ne: "CANCELLED" },
    });

    // Initialize 7 days
    const salesMap = {
      Mon: { day: "Mon", revenue: 0, orders: 0 },
      Tue: { day: "Tue", revenue: 0, orders: 0 },
      Wed: { day: "Wed", revenue: 0, orders: 0 },
      Thu: { day: "Thu", revenue: 0, orders: 0 },
      Fri: { day: "Fri", revenue: 0, orders: 0 },
      Sat: { day: "Sat", revenue: 0, orders: 0 },
      Sun: { day: "Sun", revenue: 0, orders: 0 },
    };

    weekOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const dName = dayNames[orderDate.getDay()];
      if (salesMap[dName]) {
        salesMap[dName].revenue += order.totalAmount;
        salesMap[dName].orders += 1;
      }
    });

    const salesOverview = [
      salesMap.Mon,
      salesMap.Tue,
      salesMap.Wed,
      salesMap.Thu,
      salesMap.Fri,
      salesMap.Sat,
      salesMap.Sun,
    ];

    // 7. Status distribution counts
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCountsMap = {
      DELIVERED: 0,
      IN_KITCHEN: 0,
      SENT_TO_DELIVERY: 0,
      CANCELLED: 0,
      ORDER_RECEIVED: 0,
    };

    statusCounts.forEach((sc) => {
      if (statusCountsMap[sc._id] !== undefined) {
        statusCountsMap[sc._id] = sc.count;
      }
    });

    // 8. Low stock alert inventory items
    const lowStockAlerts = await Inventory.find({
      $expr: { $lt: ["$stock", "$threshold"] },
    })
      .limit(6)
      .select("name stock unit threshold category");

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        lowStockItems,
        recentOrders,
        salesOverview,
        statusCounts: statusCountsMap,
        lowStockAlerts,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard statistics.",
    });
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
};
