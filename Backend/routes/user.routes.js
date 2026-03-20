const express = require("express");
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly, superAdminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/users        — super_admin only, with validation
router.post("/", protect, superAdminOnly, validate("user"), createUser);

// GET    /api/users        — admin+ can view all users
router.get("/", protect, adminOnly, getAllUsers);

// GET    /api/users/:id    — authenticated users can view profile
router.get("/:id", protect, getUserById);

// PUT    /api/users/:id    — super_admin or admin
router.put("/:id", protect, adminOnly, updateUser);

// DELETE /api/users/:id    — super_admin only
router.delete("/:id", protect, superAdminOnly, deleteUser);

module.exports = router;
