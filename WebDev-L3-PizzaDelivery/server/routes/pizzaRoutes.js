const express = require("express");

const {
  getPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
} = require("../controllers/pizzaController");

const router = express.Router();

router.get("/", getPizzas);

router.get("/:id", getPizzaById);

router.post("/", createPizza);

router.put("/:id", updatePizza);

router.delete("/:id", deletePizza);

module.exports = router;