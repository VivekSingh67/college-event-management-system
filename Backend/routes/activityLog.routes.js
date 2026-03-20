const express = require("express");
const router = express.Router();
const { createActivityLog, getAllActivityLogs, getActivityLogById, updateActivityLog, deleteActivityLog } = require("../controllers/activityLog.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/activity-logs       — system/admin logs activities
router.post("/", protect, validate("activityLog"), createActivityLog);

// GET    /api/activity-logs       — admin only (audit trail)
router.get("/", protect, adminOnly, getAllActivityLogs);

// GET    /api/activity-logs/:id   — admin only
router.get("/:id", protect, adminOnly, getActivityLogById);

// PUT    /api/activity-logs/:id   — admin only
router.put("/:id", protect, adminOnly, updateActivityLog);

// DELETE /api/activity-logs/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteActivityLog);

module.exports = router;
