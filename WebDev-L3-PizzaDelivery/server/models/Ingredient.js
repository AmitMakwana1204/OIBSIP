const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "base",
        "sauce",
        "cheese",
        "topping",
      ],
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    icon: {
      type: String,
      default: "🍕",
    },

    description: {
      type: String,
      default: "",
    },

    popular: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Ingredient",
  ingredientSchema
);