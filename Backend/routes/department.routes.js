const express = require("express");
const router = express.Router();
const { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require("../controllers/department.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOrHod, adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/departments       — admin/hod
router.post("/", protect, adminOrHod, validate("department"), createDepartment);

// GET    /api/departments       — public
router.get("/", getAllDepartments);

// GET    /api/departments/:id   — public
router.get("/:id", getDepartmentById);

// PUT    /api/departments/:id   — admin/hod
router.put("/:id", protect, adminOrHod, updateDepartment);

// DELETE /api/departments/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteDepartment);

module.exports = router;
