const dotenv = require("dotenv");
const path = require("path");

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const Inventory = require("../models/Inventory");
const Order = require("../models/Order");

const clearDemoData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MONGO_URI is not defined in .env file.");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log(" Connected to MongoDB for controlled demo cleanup.");

    // Delete ONLY Inventory and Orders collections
    const deletedInventory = await Inventory.deleteMany({});
    const deletedOrders = await Order.deleteMany({});

    console.log(" Controlled cleanup completed:");
    console.log(`- Inventory items cleared: ${deletedInventory.deletedCount}`);
    console.log(`- Orders cleared: ${deletedOrders.deletedCount}`);
    console.log("ℹ️ Users and Admins collections were preserved untouched.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during demo data cleanup:", error);
    process.exit(1);
  }
};

clearDemoData();
