const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Branch = require("../models/Branch.model");
const branchController = require("../controllers/branch.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly, superAdminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/branches                     — admin+
router.post("/", protect, adminOnly, validate("branch"), branchController.createBranch);

// GET    /api/branches                     — public
router.get("/", branchController.getAllBranches);

// GET    /api/branches/college/:college_id — public
router.get("/college/:college_id", branchController.getBranchesByCollege);

// GET    /api/branches/:id                 — public
router.get("/:id", branchController.getBranchById);

// PUT    /api/branches/:id                 — admin+
router.put("/:id", protect, adminOnly, branchController.updateBranch);

// DELETE /api/branches/:id                 — super_admin only
router.delete("/:id", protect, superAdminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Branch ID" });
    }
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ success: false, message: "Branch not found" });
    return res.status(200).json({ success: true, message: "Branch deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;