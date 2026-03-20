const express = require("express");
const router = express.Router();
const { createAdmin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin } = require("../controllers/admin.controller");
const { protect } = require("../middlewares/auth.middleware");
const { superAdminOnly, adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/admins       — super_admin only
router.post("/", protect, superAdminOnly, validate("admin"), createAdmin);

// GET    /api/admins       — admin+
router.get("/", protect, adminOnly, getAllAdmins);

// GET    /api/admins/:id   — admin+
router.get("/:id", protect, adminOnly, getAdminById);

// PUT    /api/admins/:id   — super_admin only
router.put("/:id", protect, superAdminOnly, updateAdmin);

// DELETE /api/admins/:id   — super_admin only
router.delete("/:id", protect, superAdminOnly, deleteAdmin);

module.exports = router;
