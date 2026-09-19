const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Inventory item name is required"],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: ["Pizza Base", "Sauce", "Cheese", "Vegetable", "Meat", "Beverage", "Other"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    threshold: {
      type: Number,
      required: [true, "Threshold is required"],
      min: [0, "Threshold cannot be negative"],
      default: 20,
    },
    unit: {
      type: String,
      default: "units",
      trim: true,
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);
