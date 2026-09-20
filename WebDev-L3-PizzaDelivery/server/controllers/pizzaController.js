const Pizza = require("../models/Pizza");

// GET all pizzas
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({
      isAvailable: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      pizzas,
    });
  } catch (error) {
    console.error("Get pizzas error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pizzas",
    });
  }
};


// GET single pizza
const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    res.status(200).json({
      success: true,
      pizza,
    });
  } catch (error) {
    console.error("Get pizza error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch pizza",
    });
  }
};


// CREATE pizza
const createPizza = async (req, res) => {
  try {
    const pizza = await Pizza.create(req.body);

    res.status(201).json({
      success: true,
      message: "Pizza created successfully",
      pizza,
    });
  } catch (error) {
    console.error("Create pizza error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create pizza",
    });
  }
};


// UPDATE pizza
const updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pizza updated successfully",
      pizza,
    });
  } catch (error) {
    console.error("Update pizza error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update pizza",
    });
  }
};


// DELETE pizza
const deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: "Pizza not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Pizza deleted successfully",
    });
  } catch (error) {
    console.error("Delete pizza error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete pizza",
    });
  }
};


module.exports = {
  getPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
};