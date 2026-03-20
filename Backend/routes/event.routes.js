const express = require("express");
const router = express.Router();
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/event.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOrHod, adminOnly, staffOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/events       — admin, hod, or faculty (staff who create events)
router.post("/", protect, staffOnly, validate("event"), createEvent);

// GET    /api/events       — PUBLIC (students and everyone can browse events)
router.get("/", getAllEvents);

// GET    /api/events/:id   — PUBLIC
router.get("/:id", getEventById);

// PUT    /api/events/:id   — admin or hod can update/edit events
router.put("/:id", protect, adminOrHod, updateEvent);

// DELETE /api/events/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
