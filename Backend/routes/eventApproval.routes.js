const express = require("express");
const router = express.Router();
const { createEventApproval, getAllEventApprovals, getEventApprovalById, updateEventApproval, deleteEventApproval } = require("../controllers/eventApproval.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly, adminOrHod } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/event-approvals       — admin or hod can approve/reject
router.post("/", protect, adminOrHod, validate("eventApproval"), createEventApproval);

// GET    /api/event-approvals       — any staff (or specifically admin/hod) can view
router.get("/", protect, adminOrHod, getAllEventApprovals);

// GET    /api/event-approvals/:id   — admin or hod
router.get("/:id", protect, adminOrHod, getEventApprovalById);

// PUT    /api/event-approvals/:id   — admin or hod (update approval decision)
router.put("/:id", protect, adminOrHod, updateEventApproval);

// DELETE /api/event-approvals/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteEventApproval);

module.exports = router;
