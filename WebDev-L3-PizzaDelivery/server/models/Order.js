const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: () => `#PH${Math.floor(1000 + Math.random() * 9000)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        name: { type: String, default: "Custom Pizza" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    pizzaConfiguration: {
      base: {
        name: { type: String, default: "Classic Crust" },
        price: { type: Number, default: 0 },
      },
      sauce: {
        name: { type: String, default: "Classic Tomato" },
        price: { type: Number, default: 0 },
      },
      cheese: {
        name: { type: String, default: "Mozzarella" },
        price: { type: Number, default: 0 },
      },
      vegetables: [
        {
          name: { type: String },
          price: { type: Number, default: 0 },
        },
      ],
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PAID",
    },
    paymentId: {
      type: String,
      default: () => `PAY_${Date.now()}`,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    orderStatus: {
      type: String,
      enum: [
        "ORDER_RECEIVED",
        "IN_KITCHEN",
        "SENT_TO_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "ORDER_RECEIVED",
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        street: "221B Baker Street",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
        fullAddress: "221B Baker Street, Mumbai, Maharashtra 400001",
      }),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
