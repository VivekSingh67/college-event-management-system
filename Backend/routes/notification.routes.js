const express = require("express");
const router = express.Router();
const { createNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification } = require("../controllers/notification.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly, adminOrHod } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/notifications       — admin/hod can send notifications
router.post("/", protect, adminOrHod, validate("notification"), createNotification);

// GET    /api/notifications       — admin can see all; users see their own (handled in controller)
router.get("/", protect, getAllNotifications);

// GET    /api/notifications/:id   — authenticated
router.get("/:id", protect, getNotificationById);

// PUT    /api/notifications/:id   — authenticated (mark as read, or admin edits)
router.put("/:id", protect, updateNotification);

// DELETE /api/notifications/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteNotification);

module.exports = router;
