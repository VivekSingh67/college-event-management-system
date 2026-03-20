const express = require("express");
const router = express.Router();
const { createEventRegistration, getAllEventRegistrations, getEventRegistrationById, updateEventRegistration, deleteEventRegistration } = require("../controllers/eventRegistration.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOrHod, adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/event-registrations       — any authenticated user (students register themselves)
router.post("/", protect, validate("eventRegistration"), createEventRegistration);

// GET    /api/event-registrations       — staff can see all registrations
router.get("/", protect, adminOrHod, getAllEventRegistrations);

// GET    /api/event-registrations/:id   — authenticated
router.get("/:id", protect, getEventRegistrationById);

// PUT    /api/event-registrations/:id   — admin/hod (update status, payment)
router.put("/:id", protect, adminOrHod, updateEventRegistration);

// DELETE /api/event-registrations/:id   — admin only (cancel registration)
router.delete("/:id", protect, adminOnly, deleteEventRegistration);

module.exports = router;
