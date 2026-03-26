const mongoose = require("mongoose");
const Faculty = require("../models/Faculty.model");
const User = require("../models/User.model");
const { hashPassword } = require("../utils/hashPassword");
const { sendCredentialsEmail } = require("../utils/email.utils");

// ─── Create Faculty ───────────────────────────────────────────────────────────
const createFaculty = async (req, res) => {
  try {
    const {
      name, email, phone, password,
      branch_id, department_id, employee_id, designation, qualification, experience_years, joining_date, status,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "name, email, phone, and password are required" });
    }
    if (!branch_id || !department_id || !employee_id || !joining_date) {
      return res.status(400).json({ success: false, message: "branch_id, department_id, employee_id, and joining_date are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "A user with this email or phone already exists" });
    }

    const existingFaculty = await Faculty.findOne({ employee_id });
    if (existingFaculty) {
      return res.status(409).json({ success: false, message: "Faculty with this employee_id already exists" });
    }

    // 1. Create User record
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "faculty",
    });

    // 2. Create Faculty profile
    const faculty = await Faculty.create({
      user_id: user._id,
      branch_id,
      department_id,
      employee_id,
      designation,
      qualification,
      experience_years,
      joining_date,
      status: status || "active",
    });

    // 3. Send credentials email (non-blocking)
    sendCredentialsEmail({ to: email, name, role: "faculty", password });

    return res.status(201).json({
      success: true,
      message: "Faculty created successfully. Login credentials have been emailed.",
      data: {
        user: { _id: user._id, name, email: user.email, role: user.role },
        faculty,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── Get All Faculty ──────────────────────────────────────────────────────────
const getAllFaculty = async (req, res) => {
  try {
    const { status, branch_id, department_id, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (branch_id) filter.branch_id = branch_id;
    if (department_id) filter.department_id = department_id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const faculty = await Faculty.find(filter)
      .populate("user_id", "name email phone profile_image status")
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

// ─── Get Faculty by ID ────────────────────────────────────────────────────────
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

// ─── Update Faculty ───────────────────────────────────────────────────────────
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

    const userFields = ["name", "phone", "profile_image"];
    const userUpdate = {};
    userFields.forEach((field) => {
      if (req.body[field] !== undefined) userUpdate[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0 && Object.keys(userUpdate).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(faculty.user_id, userUpdate, { runValidators: true });
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("user_id", "name email phone profile_image")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code");

    return res.status(200).json({ success: true, message: "Faculty updated successfully", data: updatedFaculty });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── Delete Faculty ───────────────────────────────────────────────────────────
const deleteFaculty = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Faculty ID" });
    }

    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    await User.findByIdAndDelete(faculty.user_id);

    return res.status(200).json({ success: true, message: "Faculty and linked user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createFaculty, getAllFaculty, getFacultyById, updateFaculty, deleteFaculty };
