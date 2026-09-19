const express = require("express");
const router = express.Router();
const {
  getInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  updateInventoryStock,
  deleteInventoryItem,
} = require("../controllers/inventoryController");
const { adminProtect } = require("../middleware/adminMiddleware");

// All inventory operations are Admin protected
router.get("/", adminProtect, getInventory);
router.post("/", adminProtect, createInventoryItem);
router.get("/:id", adminProtect, getInventoryById);
router.patch("/:id", adminProtect, updateInventoryItem);
router.patch("/:id/stock", adminProtect, updateInventoryStock);
router.delete("/:id", adminProtect, deleteInventoryItem);

module.exports = router;
