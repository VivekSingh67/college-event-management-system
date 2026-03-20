const express = require("express");
const router = express.Router();
const { createBatch, getAllBatches, getBatchById, updateBatch, deleteBatch } = require("../controllers/batch.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOrHod, adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/batches       — admin/hod
router.post("/", protect, adminOrHod, validate("batch"), createBatch);

// GET    /api/batches       — public
router.get("/", getAllBatches);

// GET    /api/batches/:id   — public
router.get("/:id", getBatchById);

// PUT    /api/batches/:id   — admin/hod
router.put("/:id", protect, adminOrHod, updateBatch);

// DELETE /api/batches/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteBatch);

module.exports = router;
