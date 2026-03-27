const mongoose = require("mongoose");
const Hod = require("../models/HOD.model");
const User = require("../models/User.model");
const { hashPassword } = require("../utils/hashPassword");
const { sendCredentialsEmail } = require("../utils/email.utils");

// ─── Create HOD ───────────────────────────────────────────────────────────────
const createHod = async (req, res) => {
  try {
    const {
      name, email, phone, password,
      branch_id, department_id, employee_id, qualification, experience_years, joining_date, status,
    } = req.body;

    console.log("Creating HOD with body:", req.body);

    const finalPassword = password || "1";

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "name, email, and phone are required" });
    }
    if (!branch_id || !department_id || !employee_id || !joining_date) {
      return res.status(400).json({ success: false, message: "branch_id, department_id, employee_id, and joining_date are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "A user with this email or phone already exists" });
    }

    const existingHod = await Hod.findOne({ employee_id });
    if (existingHod) {
      return res.status(409).json({ success: false, message: "HOD with this employee_id already exists" });
    }

    // 1. Create User record
    const hashedPassword = await hashPassword(finalPassword);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "hod",
    });

    // 2. Create HOD profile
    const hod = await Hod.create({
      user_id: user._id,
      branch_id,
      department_id,
      employee_id,
      qualification,
      experience_years,
      joining_date,
      status: status || "active",
    });

    // 3. Send credentials email (non-blocking)
    sendCredentialsEmail({ to: email, name, role: "hod", password: finalPassword });

    return res.status(201).json({
      success: true,
      message: "HOD created successfully. Login credentials have been emailed.",
      data: {
        user: { _id: user._id, name, email: user.email, role: user.role },
        hod,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── Get All HODs ─────────────────────────────────────────────────────────────
const getAllHods = async (req, res) => {
  try {
    const { status, branch_id, department_id, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (branch_id) filter.branch_id = branch_id;
    if (department_id) filter.department_id = department_id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const hods = await Hod.find(filter)
      .populate("user_id", "name email phone profile_image status")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Hod.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: hods.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: hods,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── Get HOD by ID ────────────────────────────────────────────────────────────
const getHodById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid HOD ID" });
    }

    const hod = await Hod.findById(req.params.id)
      .populate("user_id", "name email phone profile_image")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code");

    if (!hod) {
      return res.status(404).json({ success: false, message: "HOD not found" });
    }

    return res.status(200).json({ success: true, data: hod });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── Update HOD ───────────────────────────────────────────────────────────────
const updateHod = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid HOD ID" });
    }

    const allowedFields = ["branch_id", "department_id", "employee_id", "qualification", "experience_years", "joining_date", "status"];
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

    const hod = await Hod.findById(req.params.id);
    if (!hod) {
      return res.status(404).json({ success: false, message: "HOD not found" });
    }

    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(hod.user_id, userUpdate, { runValidators: true });
    }

    const updatedHod = await Hod.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("user_id", "name email phone profile_image")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code");

    return res.status(200).json({ success: true, message: "HOD updated successfully", data: updatedHod });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── Delete HOD ───────────────────────────────────────────────────────────────
const deleteHod = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid HOD ID" });
    }

    const hod = await Hod.findByIdAndDelete(req.params.id);
    if (!hod) {
      return res.status(404).json({ success: false, message: "HOD not found" });
    }

    await User.findByIdAndDelete(hod.user_id);

    return res.status(200).json({ success: true, message: "HOD and linked user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createHod, getAllHods, getHodById, updateHod, deleteHod };
