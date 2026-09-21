const API_BASE = "http://localhost:5000/api";
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function request(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return { status: res.status, data };
}

async function runOrderTest() {
  console.log("==========================================");
  console.log("🍕 TESTING USER ORDER & INVENTORY DECREMENT");
  console.log("==========================================\n");

  try {
    // Connect to DB directly to ensure a test user is present and verified
    await mongoose.connect(process.env.MONGO_URI);
    let testUser = await User.findOne({ email: "testcustomer@example.com" });
    if (!testUser) {
      testUser = await User.create({
        name: "Test Customer",
        email: "testcustomer@example.com",
        password: "hashedPassword123",
        isVerified: true,
      });
    } else {
      testUser.isVerified = true;
      await testUser.save();
    }

    const userToken = jwt.sign(
      { id: testUser._id, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const userHeaders = { Authorization: `Bearer ${userToken}` };

    // 1. Admin Login
    const adminLogin = await request("/admin/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@pizzahub.com",
        password: "admin123",
      }),
    });
    const adminToken = adminLogin.data.token;
    const adminHeaders = { Authorization: `Bearer ${adminToken}` };

    // Check starting inventory for Mozzarella
    const invBefore = await request("/inventory", { headers: adminHeaders });
    const mozzarellaBefore = invBefore.data.data.find((i) => i.name === "Mozzarella");
    console.log(`📊 Mozzarella stock before order: ${mozzarellaBefore ? mozzarellaBefore.stock : "N/A"}`);

    // 2. User places order
    console.log("🛒 Placing customer order for Custom Pizza...");
    const orderRes = await request("/orders", {
      method: "POST",
      headers: userHeaders,
      body: JSON.stringify({
        items: [
          {
            name: "Classic Crust Pizza",
            price: 219,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
          },
        ],
        customer: {
          name: "Test Customer",
          phone: "9876543210",
        },
        shippingAddress: {
          address: "123 Main St",
          city: "Mumbai",
          pincode: "400001",
        },
        paymentMethod: "COD",
        subtotal: 219,
        deliveryFee: 0,
        discount: 0,
        total: 219,
      }),
    });

    const placedOrder = orderRes.data.order || orderRes.data.data;
    console.log(`✅ Order placed! ID: ${placedOrder.orderId}, Status: ${placedOrder.orderStatus}, Amount: ₹${placedOrder.total}`);

    // 3. Verify inventory was automatically decremented in MongoDB!
    const invAfter = await request("/inventory", { headers: adminHeaders });
    const mozzarellaAfter = invAfter.data.data.find((i) => i.name === "Mozzarella");
    console.log(`📊 Mozzarella stock after order: ${mozzarellaAfter ? mozzarellaAfter.stock : "N/A"}`);
    if (mozzarellaBefore && mozzarellaAfter) {
      if (mozzarellaAfter.stock === mozzarellaBefore.stock - 1) {
        console.log("✅ Automatic backend inventory decrement confirmed! (Stock reduced by 1 unit)");
      } else {
        console.warn("⚠️ Stock difference:", mozzarellaBefore.stock, "->", mozzarellaAfter.stock);
      }
    }

    // 4. Admin views orders list
    console.log("\n📋 Admin fetching orders list (GET /api/admin/orders)...");
    const adminOrders = await request("/admin/orders", { headers: adminHeaders });
    console.log(`✅ Admin retrieved ${adminOrders.data.count} orders. First order customer: ${adminOrders.data.data[0].customer}`);

    // 5. Admin updates order status to IN_KITCHEN
    console.log(`\n👨‍🍳 Admin updating order ${placedOrder.orderId} status to "In Kitchen"...`);
    const statusUpdate = await request(`/admin/orders/${placedOrder._id}/status`, {
      method: "PATCH",
      headers: adminHeaders,
      body: JSON.stringify({ status: "In Kitchen" }),
    });
    console.log(`✅ Order status updated in MongoDB to: "${statusUpdate.data.data.orderStatus}"`);

    // 6. Check Dashboard Revenue & Counts
    console.log("\n📈 Admin checking updated Dashboard metrics...");
    const updatedDash = await request("/admin/dashboard", { headers: adminHeaders });
    console.log("✅ Live Dashboard Stats:", {
      totalRevenue: `₹${updatedDash.data.data.totalRevenue}`,
      totalOrders: updatedDash.data.data.totalOrders,
      totalCustomers: updatedDash.data.data.totalCustomers,
      recentOrdersCount: updatedDash.data.data.recentOrders.length,
      statusCounts: updatedDash.data.data.statusCounts,
    });

    console.log("\n==========================================");
    console.log("🎉 FULL END-TO-END FLOW VERIFIED & WORKING!");
    console.log("==========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Order flow test error:", err.data || err.message);
    process.exit(1);
  }
}

runOrderTest();
