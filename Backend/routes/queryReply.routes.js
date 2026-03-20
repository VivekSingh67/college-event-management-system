const express = require("express");
const router = express.Router();
const { createQueryReply, getAllQueryReplies, getQueryReplyById, updateQueryReply, deleteQueryReply } = require("../controllers/queryReply.controller");
const { protect } = require("../middlewares/auth.middleware");
const { staffOnly, adminOrHod, adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/query-replies       — staff replies to student queries
router.post("/", protect, staffOnly, validate("queryReply"), createQueryReply);

// GET    /api/query-replies       — staff can see all replies
router.get("/", protect, staffOnly, getAllQueryReplies);

// GET    /api/query-replies/:id   — authenticated
router.get("/:id", protect, getQueryReplyById);

// PUT    /api/query-replies/:id   — admin/hod can edit reply
router.put("/:id", protect, adminOrHod, updateQueryReply);

// DELETE /api/query-replies/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteQueryReply);

module.exports = router;
