const Inventory = require("../models/Inventory");

// ==========================================
// GET ALL INVENTORY ITEMS
// GET /api/inventory
// ==========================================
const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Get inventory error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory items.",
    });
  }
};

// ==========================================
// GET SINGLE INVENTORY ITEM
// GET /api/inventory/:id
// ==========================================
const getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get inventory by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory item.",
    });
  }
};

// ==========================================
// CREATE INVENTORY ITEM
// POST /api/inventory
// ==========================================
const createInventoryItem = async (req, res) => {
  try {
    const { name, category, stock, threshold, unit, price } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Item name is required.",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Item category is required.",
      });
    }

    const numStock = Number(stock);
    const numThreshold = Number(threshold);
    const numPrice = price !== undefined ? Number(price) : 0;

    if (isNaN(numStock) || numStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative number.",
      });
    }

    if (isNaN(numThreshold) || numThreshold < 0) {
      return res.status(400).json({
        success: false,
        message: "Threshold must be a non-negative number.",
      });
    }

    if (isNaN(numPrice) || numPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a non-negative number.",
      });
    }

    const existing = await Inventory.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `An inventory item with the name "${name.trim()}" already exists.`,
      });
    }

    const newItem = await Inventory.create({
      name: name.trim(),
      category: category.trim(),
      stock: numStock,
      threshold: numThreshold,
      unit: unit ? unit.trim() : "units",
      price: numPrice,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Inventory item created successfully.",
      data: newItem,
    });
  } catch (error) {
    console.error("Create inventory error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create inventory item.",
    });
  }
};

// ==========================================
// UPDATE INVENTORY ITEM
// PATCH /api/inventory/:id
// ==========================================
const updateInventoryItem = async (req, res) => {
  try {
    const { name, category, stock, threshold, unit, price, isActive } = req.body;

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found.",
      });
    }

    if (name && name.trim()) {
      const duplicate = await Inventory.findOne({
        _id: { $ne: item._id },
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Another item with the name "${name.trim()}" already exists.`,
        });
      }
      item.name = name.trim();
    }

    if (category && category.trim()) item.category = category.trim();
    if (stock !== undefined) {
      const numStock = Number(stock);
      if (isNaN(numStock) || numStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative number.",
        });
      }
      item.stock = numStock;
    }

    if (threshold !== undefined) {
      const numThreshold = Number(threshold);
      if (isNaN(numThreshold) || numThreshold < 0) {
        return res.status(400).json({
          success: false,
          message: "Threshold must be a non-negative number.",
        });
      }
      item.threshold = numThreshold;
    }

    if (unit !== undefined) item.unit = unit.trim();
    if (price !== undefined) {
      const numPrice = Number(price);
      if (isNaN(numPrice) || numPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a non-negative number.",
        });
      }
      item.price = numPrice;
    }

    if (isActive !== undefined) item.isActive = Boolean(isActive);

    const updated = await item.save();

    return res.status(200).json({
      success: true,
      message: "Inventory item updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Update inventory error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update inventory item.",
    });
  }
};

// ==========================================
// UPDATE STOCK ONLY
// PATCH /api/inventory/:id/stock
// ==========================================
const updateInventoryStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative number.",
      });
    }

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found.",
      });
    }

    item.stock = numStock;
    const updated = await item.save();

    return res.status(200).json({
      success: true,
      message: `Stock for "${updated.name}" updated to ${updated.stock}.`,
      data: updated,
    });
  } catch (error) {
    console.error("Update stock error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update stock quantity.",
    });
  }
};

// ==========================================
// DELETE INVENTORY ITEM
// DELETE /api/inventory/:id
// ==========================================
const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found.",
      });
    }

    await Inventory.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: `Item "${item.name}" deleted successfully.`,
    });
  } catch (error) {
    console.error("Delete inventory error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete inventory item.",
    });
  }
};

module.exports = {
  getInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  updateInventoryStock,
  deleteInventoryItem,
};
