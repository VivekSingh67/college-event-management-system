const express = require("express");
const router = express.Router();
const { createFaculty, getAllFaculty, getFacultyById, updateFaculty, deleteFaculty } = require("../controllers/faculty.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly, adminOrHod } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/faculty       — admin/hod
router.post("/", protect, adminOrHod, validate("faculty"), createFaculty);

// GET    /api/faculty       — authenticated users
router.get("/", protect, getAllFaculty);

// GET    /api/faculty/:id   — authenticated users
router.get("/:id", protect, getFacultyById);

// PUT    /api/faculty/:id   — admin/hod
router.put("/:id", protect, adminOrHod, updateFaculty);

// DELETE /api/faculty/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteFaculty);

module.exports = router;
