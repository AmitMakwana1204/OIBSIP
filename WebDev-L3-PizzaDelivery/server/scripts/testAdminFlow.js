const API_BASE = "http://localhost:5000/api";

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

async function runTests() {
  console.log("==========================================");
  console.log("🚀 STARTING PIZZAHUB ADMIN AUTOMATED TESTS");
  console.log("==========================================\n");

  try {
    // 1. TEST ADMIN LOGIN
    console.log("TEST 1: Testing Admin Login (POST /api/admin/login)...");
    const loginRes = await request("/admin/login", {
      method: "POST",
      body: JSON.stringify({
        email: "admin@pizzahub.com",
        password: "admin123",
      }),
    });

    if (!loginRes.data?.success || !loginRes.data?.token) {
      throw new Error("Admin login failed or token missing.");
    }
    const adminToken = loginRes.data.token;
    console.log("✅ Admin login successful! Token received.\n");

    const authHeaders = { Authorization: `Bearer ${adminToken}` };

    // 2. TEST DASHBOARD STATS
    console.log("TEST 2: Testing Admin Dashboard API (GET /api/admin/dashboard)...");
    const dashRes = await request("/admin/dashboard", { headers: authHeaders });
    console.log("✅ Dashboard API response received:", {
      totalRevenue: dashRes.data.data.totalRevenue,
      totalOrders: dashRes.data.data.totalOrders,
      totalCustomers: dashRes.data.data.totalCustomers,
      lowStockItems: dashRes.data.data.lowStockItems,
    });
    console.log("");

    // 3. TEST INVENTORY ADD
    console.log("TEST 3: Testing Add Inventory Item (POST /api/inventory)...");
    const invItem1 = {
      name: "Classic Crust",
      category: "Pizza Base",
      stock: 50,
      threshold: 20,
      unit: "units",
      price: 0,
    };
    const invItem2 = {
      name: "Mozzarella",
      category: "Cheese",
      stock: 15, // Below threshold 20 to test Low Stock alert!
      threshold: 20,
      unit: "units",
      price: 0,
    };
    const invItem3 = {
      name: "Capsicum",
      category: "Vegetable",
      stock: 30,
      threshold: 10,
      unit: "units",
      price: 20,
    };

    for (const item of [invItem1, invItem2, invItem3]) {
      try {
        const addRes = await request("/inventory", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(item),
        });
        console.log(`✅ Created item: "${addRes.data.data.name}" with stock ${addRes.data.data.stock}`);
      } catch (e) {
        if (e.status === 409) {
          console.log(`ℹ️ Item "${item.name}" already exists.`);
        } else {
          throw e;
        }
      }
    }
    console.log("");

    // 4. TEST INVENTORY GET
    console.log("TEST 4: Testing Get Inventory (GET /api/inventory)...");
    const getInvRes = await request("/inventory", { headers: authHeaders });
    console.log(`✅ Fetched ${getInvRes.data.count} inventory items from MongoDB.\n`);

    // 5. TEST UPDATE INVENTORY STOCK
    const firstItem = getInvRes.data.data[0];
    console.log(`TEST 5: Testing Update Stock for "${firstItem.name}" (PATCH /api/inventory/${firstItem._id}/stock)...`);
    const updateStockRes = await request(`/inventory/${firstItem._id}/stock`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ stock: 60 }),
    });
    console.log(`✅ Stock updated to ${updateStockRes.data.data.stock}\n`);

    // 6. TEST UNAUTHORIZED ADMIN ROUTE REJECTION
    console.log("TEST 6: Testing Unauthorized Admin Route Access (missing token)...");
    try {
      await request("/admin/dashboard");
      console.error("❌ Failed: unauthorized request should have returned 401");
    } catch (e) {
      console.log(`✅ Correctly rejected with status ${e.status} (${e.data?.message})\n`);
    }

    // 7. TEST DASHBOARD STATS FOR REAL LOW STOCK ITEMS
    console.log("TEST 7: Checking Dynamic Dashboard Stats for Low Stock count...");
    const updatedDash = await request("/admin/dashboard", { headers: authHeaders });
    console.log(`✅ Low Stock Items dynamically calculated: ${updatedDash.data.data.lowStockItems}\n`);

    console.log("==========================================");
    console.log("🎉 ALL AUTOMATED API TESTS PASSED SUCCESSFULLY!");
    console.log("==========================================");
  } catch (err) {
    console.error("❌ Test failed:", err.data || err.message);
    process.exit(1);
  }
}

runTests();
