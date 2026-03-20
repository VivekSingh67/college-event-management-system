const express = require("express");
const router = express.Router();
const { createEventApproval, getAllEventApprovals, getEventApprovalById, updateEventApproval, deleteEventApproval } = require("../controllers/eventApproval.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/event-approvals       — admin only (approves/rejects events)
router.post("/", protect, adminOnly, validate("eventApproval"), createEventApproval);

// GET    /api/event-approvals       — admin only
router.get("/", protect, adminOnly, getAllEventApprovals);

// GET    /api/event-approvals/:id   — admin only
router.get("/:id", protect, adminOnly, getEventApprovalById);

// PUT    /api/event-approvals/:id   — admin only (update approval decision)
router.put("/:id", protect, adminOnly, updateEventApproval);

// DELETE /api/event-approvals/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteEventApproval);

module.exports = router;
