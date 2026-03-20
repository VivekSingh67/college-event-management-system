const express = require("express");
const router = express.Router();
const { createQuery, getAllQueries, getQueryById, updateQuery, deleteQuery } = require("../controllers/query.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOrHod, adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/queries       — authenticated student posts a query
router.post("/", protect, validate("query"), createQuery);

// GET    /api/queries       — admin/hod sees all queries
router.get("/", protect, adminOrHod, getAllQueries);

// GET    /api/queries/:id   — authenticated (students see own, staff see all)
router.get("/:id", protect, getQueryById);

// PUT    /api/queries/:id   — admin/hod updates query status/reply
router.put("/:id", protect, adminOrHod, updateQuery);

// DELETE /api/queries/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteQuery);

module.exports = router;
