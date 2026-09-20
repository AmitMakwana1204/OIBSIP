const express = require("express");

const {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} = require("../controllers/ingredientController");

const router = express.Router();

router.get("/", getIngredients);

router.post("/", createIngredient);

router.put("/:id", updateIngredient);

router.delete("/:id", deleteIngredient);

module.exports = router;