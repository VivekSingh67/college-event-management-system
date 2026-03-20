const express = require("express");
const router = express.Router();
const { createHod, getAllHods, getHodById, updateHod, deleteHod } = require("../controllers/hod.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/hods       — admin only
router.post("/", protect, adminOnly, validate("hod"), createHod);

// GET    /api/hods       — authenticated
router.get("/", protect, getAllHods);

// GET    /api/hods/:id   — authenticated
router.get("/:id", protect, getHodById);

// PUT    /api/hods/:id   — admin only
router.put("/:id", protect, adminOnly, updateHod);

// DELETE /api/hods/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteHod);

module.exports = router;
