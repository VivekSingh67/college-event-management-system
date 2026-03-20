const express = require("express");
const router = express.Router();
const { createCollege, getAllColleges, getCollegeById, updateCollege, deleteCollege, getCollegesByStatus } = require("../controllers/college.controller");
const { protect } = require("../middlewares/auth.middleware");
const { superAdminOnly, adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/colleges          — super_admin only
router.post("/", protect, superAdminOnly, validate("college"), createCollege);

// GET    /api/colleges          — public
router.get("/", getAllColleges);

// GET    /api/colleges/status/:status — public filter
router.get("/status/:status", getCollegesByStatus);

// GET    /api/colleges/:id      — public
router.get("/:id", getCollegeById);

// PUT    /api/colleges/:id      — super_admin or admin
router.put("/:id", protect, adminOnly, updateCollege);

// DELETE /api/colleges/:id      — super_admin only
router.delete("/:id", protect, superAdminOnly, deleteCollege);

module.exports = router;