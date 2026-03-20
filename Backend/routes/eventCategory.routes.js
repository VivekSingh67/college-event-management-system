const express = require("express");
const router = express.Router();
const { createEventCategory, getAllEventCategories, getEventCategoryById, updateEventCategory, deleteEventCategory } = require("../controllers/eventCategory.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly, adminOrHod } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/event-categories       — admin/hod
router.post("/", protect, adminOrHod, createEventCategory);

// GET    /api/event-categories       — public
router.get("/", getAllEventCategories);

// GET    /api/event-categories/:id   — public
router.get("/:id", getEventCategoryById);

// PUT    /api/event-categories/:id   — admin/hod
router.put("/:id", protect, adminOrHod, updateEventCategory);

// DELETE /api/event-categories/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteEventCategory);

module.exports = router;
