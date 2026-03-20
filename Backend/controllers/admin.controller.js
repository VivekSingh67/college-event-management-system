const mongoose = require("mongoose");
const Admin = require("../models/Admin.model");

// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { user_id, college_id, branch_id, employee_id, designation, joining_date, address, status } = req.body;

    if (!user_id || !college_id || !branch_id || !employee_id || !joining_date) {
      return res.status(400).json({ success: false, message: "user_id, college_id, branch_id, employee_id, and joining_date are required" });
    }

    const existing = await Admin.findOne({ employee_id });
    if (existing) {
      return res.status(409).json({ success: false, message: "Admin with this employee_id already exists" });
    }

    const admin = await Admin.create({ user_id, college_id, branch_id, employee_id, designation, joining_date, address, status });

    return res.status(201).json({ success: true, message: "Admin created successfully", data: admin });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const admins = await Admin.find(filter)
      .populate("user_id", "name email phone role profile_image")
      .populate("college_id", "name short_name")
      .populate("branch_id", "branch_name branch_code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Admin.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: admins.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: admins,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Admin by ID
const getAdminById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Admin ID" });
    }

    const admin = await Admin.findById(req.params.id)
      .populate("user_id", "name email phone role profile_image")
      .populate("college_id", "name short_name")
      .populate("branch_id", "branch_name branch_code");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    return res.status(200).json({ success: true, data: admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Admin
const updateAdmin = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Admin ID" });
    }

    const allowedFields = ["college_id", "branch_id", "employee_id", "designation", "joining_date", "address", "status"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("user_id", "name email phone role")
      .populate("college_id", "name short_name")
      .populate("branch_id", "branch_name branch_code");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    return res.status(200).json({ success: true, message: "Admin updated successfully", data: admin });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Admin ID" });
    }

    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    return res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createAdmin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin };
