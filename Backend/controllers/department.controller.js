const mongoose = require("mongoose");
const Department = require("../models/Department.model");

// Create Department
const createDepartment = async (req, res) => {
  try {
    const { branch_id, department_name, department_code, description, total_faculty, status } = req.body;

    if (!branch_id || !department_name || !department_code) {
      return res.status(400).json({ success: false, message: "branch_id, department_name, and department_code are required" });
    }

    const existing = await Department.findOne({ department_code });
    if (existing) {
      return res.status(409).json({ success: false, message: "Department with this department_code already exists" });
    }

    const department = await Department.create({ branch_id, department_name, department_code, description, total_faculty, status });

    return res.status(201).json({ success: true, message: "Department created successfully", data: department });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Departments
const getAllDepartments = async (req, res) => {
  try {
    const { status, branch_id, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (branch_id) filter.branch_id = branch_id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const departments = await Department.find(filter)
      .populate("branch_id", "branch_name branch_code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Department.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: departments.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: departments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Department by ID
const getDepartmentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Department ID" });
    }

    const department = await Department.findById(req.params.id).populate("branch_id", "branch_name branch_code");

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({ success: true, data: department });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Department
const updateDepartment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Department ID" });
    }

    const allowedFields = ["branch_id", "department_name", "department_code", "description", "total_faculty", "status"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const department = await Department.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("branch_id", "branch_name branch_code");

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({ success: true, message: "Department updated successfully", data: department });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Department
const deleteDepartment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Department ID" });
    }

    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    return res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment };
