const express = require("express");
const router = express.Router();
const { createEventVenue, getAllEventVenues, getEventVenueById, updateEventVenue, deleteEventVenue } = require("../controllers/eventVenue.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly, adminOrHod } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/event-venues       — admin/hod
router.post("/", protect, adminOrHod, validate("eventVenue"), createEventVenue);

// GET    /api/event-venues       — public
router.get("/", getAllEventVenues);

// GET    /api/event-venues/:id   — public
router.get("/:id", getEventVenueById);

// PUT    /api/event-venues/:id   — admin/hod
router.put("/:id", protect, adminOrHod, updateEventVenue);

// DELETE /api/event-venues/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteEventVenue);

module.exports = router;
