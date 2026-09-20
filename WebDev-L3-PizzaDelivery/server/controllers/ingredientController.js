const Ingredient = require("../models/Ingredient");

const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({
      isAvailable: true,
    }).sort({
      type: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      ingredients,
    });
  } catch (error) {
    console.error(
      "Get ingredients error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch ingredients",
    });
  }
};

const createIngredient = async (req, res) => {
  try {
    const ingredient =
      await Ingredient.create(req.body);

    res.status(201).json({
      success: true,
      message:
        "Ingredient created successfully",
      ingredient,
    });
  } catch (error) {
    console.error(
      "Create ingredient error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create ingredient",
    });
  }
};

const updateIngredient = async (req, res) => {
  try {
    const ingredient =
      await Ingredient.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: "Ingredient not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Ingredient updated successfully",
      ingredient,
    });
  } catch (error) {
    console.error(
      "Update ingredient error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update ingredient",
    });
  }
};

const deleteIngredient = async (req, res) => {
  try {
    const ingredient =
      await Ingredient.findByIdAndDelete(
        req.params.id
      );

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: "Ingredient not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Ingredient deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete ingredient error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete ingredient",
    });
  }
};

module.exports = {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};