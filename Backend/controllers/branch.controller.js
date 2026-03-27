const Branch = require("../models/Branch.model");
const mongoose = require("mongoose");


const createBranch = async (req, res) => {
  try {
    const {
      college_id,
      branch_name,
      branch_code,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      campus_type,
      status,
    } = req.body;

    // Required fields check
    if (!college_id || !branch_name || !branch_code) {
      return res.status(400).json({
        success: false,
        message: "college_id, branch_name aur branch_code required hain",
      });
    }

    // Duplicate branch_code check
    const existing = await Branch.findOne({ branch_code });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Branch code '${branch_code}' pehle se exist karta hai`,
      });
    }

    const branch = await Branch.create({
      college_id,
      branch_name,
      branch_code,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      campus_type,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Branch successfully create ho gayi",
      data: branch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


const getAllBranches = async (req, res) => {
  try {
    // Optional query filters: ?status=active&campus_type=Main Campus
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.campus_type) filter.campus_type = req.query.campus_type;

    const branches = await Branch.find(filter)
      .populate("college_id", "name short_name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Branch ID",
      });
    }

    const branch = await Branch.findById(id).populate(
      "college_id",
      "name short_name"
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch nahi mili",
      });
    }

    return res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getBranchesByCollege = async (req, res) => {
  try {
    const { college_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(college_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid College ID",
      });
    }

    const branches = await Branch.find({ college_id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────
// PUT /api/branches/:id  →  Branch update karo
// ─────────────────────────────────────────────────
const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Branch ID",
      });
    }

    // Agar branch_code badal rahe hain toh duplicate check
    if (req.body.branch_code) {
      const duplicate = await Branch.findOne({
        branch_code: req.body.branch_code,
        _id: { $ne: id }, // apne aap ko exclude karo
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Branch code '${req.body.branch_code}' already kisi aur branch ke paas hai`,
        });
      }
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      id,
      { $set: req.body },
      {
        new: true,          
        runValidators: true, 
      }
    ).populate("college_id", "name short_name");

    if (!updatedBranch) {
      return res.status(404).json({
        success: false,
        message: "Branch nahi mili",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Branch successfully update ho gayi",
      data: updatedBranch,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  getBranchesByCollege,
  updateBranch,
};