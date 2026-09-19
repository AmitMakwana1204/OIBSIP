const dotenv = require("dotenv");
const path = require("path");

// Load .env from server directory
dotenv.config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MONGO_URI is not defined in .env file.");
      process.exit(1);
    }

    const adminName = process.env.ADMIN_NAME || process.argv[2] || "Admin";
    const adminEmail = process.env.ADMIN_EMAIL || process.argv[3] || "admin@pizzahub.com";
    const adminPassword = process.env.ADMIN_PASSWORD || process.argv[4] || "admin123";

    if (!adminPassword || adminPassword.length < 6) {
      console.error("❌ ADMIN_PASSWORD must be at least 6 characters long.");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log(" Connected to MongoDB for Admin creation.");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: adminEmail.toLowerCase().trim(),
    });

    if (existingAdmin) {
      console.log(`ℹ️ Admin with email "${adminEmail}" already exists. Skipping creation.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin
    const newAdmin = await Admin.create({
      name: adminName.trim(),
      email: adminEmail.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin account created successfully!");
    console.log(`👤 Name: ${newAdmin.name}`);
    console.log(`📧 Email: ${newAdmin.email}`);
    console.log(`🔑 Role: ${newAdmin.role}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
