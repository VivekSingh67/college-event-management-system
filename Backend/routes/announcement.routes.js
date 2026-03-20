const express = require("express");
const router = express.Router();
const { createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement } = require("../controllers/announcement.controller");
const { protect } = require("../middlewares/auth.middleware");
const { staffOnly, adminOrHod, adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/announcements       — staff (admin/hod/faculty) can post
router.post("/", protect, staffOnly, validate("announcement"), createAnnouncement);

// GET    /api/announcements       — public (everyone can see announcements)
router.get("/", getAllAnnouncements);

// GET    /api/announcements/:id   — public
router.get("/:id", getAnnouncementById);

// PUT    /api/announcements/:id   — admin/hod can edit
router.put("/:id", protect, adminOrHod, updateAnnouncement);

// DELETE /api/announcements/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteAnnouncement);

module.exports = router;
