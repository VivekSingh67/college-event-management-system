const express = require("express");
const router = express.Router();
const { createAttendance, getAllAttendance, getAttendanceById, updateAttendance, deleteAttendance, getMyAttendance } = require("../controllers/attendance.controller");
const { protect } = require("../middlewares/auth.middleware");
const { staffOnly, adminOrHod, adminOnly } = require("../middlewares/role.middleware");

// POST   /api/attendance       — staff marks attendance
router.post("/", protect, staffOnly, createAttendance);

// GET    /api/attendance/me    — get current student attendance
router.get("/me", protect, getMyAttendance);

// GET    /api/attendance/:id   — authenticated
router.get("/:id", protect, getAttendanceById);

// PUT    /api/attendance/:id   — admin/hod can correct attendance
router.put("/:id", protect, adminOrHod, updateAttendance);

// DELETE /api/attendance/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteAttendance);

module.exports = router;
