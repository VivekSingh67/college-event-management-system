const mongoose = require("mongoose");
const Faculty = require("../models/Faculty.model");

// Create Faculty
const createFaculty = async (req, res) => {
  try {
    const { user_id, branch_id, department_id, employee_id, designation, qualification, experience_years, joining_date, status } = req.body;

    if (!user_id || !branch_id || !department_id || !employee_id || !joining_date) {
      return res.status(400).json({ success: false, message: "user_id, branch_id, department_id, employee_id, and joining_date are required" });
    }

    const existing = await Faculty.findOne({ employee_id });
    if (existing) {
      return res.status(409).json({ success: false, message: "Faculty with this employee_id already exists" });
    }

    const faculty = await Faculty.create({ user_id, branch_id, department_id, employee_id, designation, qualification, experience_years, joining_date, status });

    return res.status(201).json({ success: true, message: "Faculty created successfully", data: faculty });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Faculty
const getAllFaculty = async (req, res) => {
  try {
    const { status, branch_id, department_id, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (branch_id) filter.branch_id = branch_id;
    if (department_id) filter.department_id = department_id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const faculty = await Faculty.find(filter)
      .populate("user_id", "name email phone profile_image")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Faculty.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: faculty.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: faculty,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Faculty by ID
const getFacultyById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Faculty ID" });
    }

    const faculty = await Faculty.findById(req.params.id)
      .populate("user_id", "name email phone profile_image")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code");

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    return res.status(200).json({ success: true, data: faculty });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Faculty
const updateFaculty = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Faculty ID" });
    }

    const allowedFields = ["branch_id", "department_id", "employee_id", "designation", "qualification", "experience_years", "joining_date", "status"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const faculty = await Faculty.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("user_id", "name email phone profile_image")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code");

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    return res.status(200).json({ success: true, message: "Faculty updated successfully", data: faculty });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Faculty
const deleteFaculty = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Faculty ID" });
    }

    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    return res.status(200).json({ success: true, message: "Faculty deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createFaculty, getAllFaculty, getFacultyById, updateFaculty, deleteFaculty };
