const mongoose = require("mongoose");
const Admin = require("../models/Admin.model");
const User = require("../models/User.model");
const { hashPassword } = require("../utils/hashPassword");
const { sendCredentialsEmail } = require("../utils/email.utils");

// ─── Create Admin ─────────────────────────────────────────────────────────────
// Creates a User record + an Admin profile record in one atomic-like operation.
// Body should include user fields (name, email, phone, password) + admin fields.
const createAdmin = async (req, res) => {
  try {
    const {
      // User fields
      name, email, phone, password,
      // Admin-specific fields
      college_id, branch_id, employee_id, designation, joining_date, address, status,
    } = req.body;

    const finalPassword = password || "1";
    const finalDesignation = designation || "admin";

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "name, email, and phone are required" });
    }
    if (!college_id || !branch_id || !employee_id || !joining_date) {
      return res.status(400).json({ success: false, message: "college_id, branch_id, employee_id, and joining_date are required" });
    }

    // Check uniqueness across User collection
    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "A user with this email or phone already exists" });
    }

    // Check duplicate employee_id in admins collection
    const existingAdmin = await Admin.findOne({ employee_id });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: "Admin with this employee_id already exists" });
    }

    // 1. Create User record
    const hashedPassword = await hashPassword(finalPassword);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "admin",
    });

    // 2. Create Admin profile linked to the new User
    const admin = await Admin.create({
      user_id: user._id,
      college_id,
      branch_id,
      employee_id,
      designation: finalDesignation,
      joining_date,
      address,
      status: status || "active",
    });

    // 3. Send credentials email (non-blocking)
    sendCredentialsEmail({ to: email, name, role: "admin", password: finalPassword });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully. Login credentials have been emailed.",
      data: {
        user: { _id: user._id, name, email: user.email, role: user.role },
        admin,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── Get All Admins ───────────────────────────────────────────────────────────
const getAllAdmins = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const admins = await Admin.find(filter)
      .populate("user_id", "name email phone role profile_image status")
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

// ─── Get Admin by ID ──────────────────────────────────────────────────────────
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

// ─── Update Admin ─────────────────────────────────────────────────────────────
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

    // Also allow updating User fields (name, phone, profile_image)
    const userFields = ["name", "phone", "profile_image"];
    const userUpdate = {};
    userFields.forEach((field) => {
      if (req.body[field] !== undefined) userUpdate[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0 && Object.keys(userUpdate).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Update User record if user fields provided
    if (Object.keys(userUpdate).length > 0) {
      await User.findByIdAndUpdate(admin.user_id, userUpdate, { runValidators: true });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("user_id", "name email phone role")
      .populate("college_id", "name short_name")
      .populate("branch_id", "branch_name branch_code");

    return res.status(200).json({ success: true, message: "Admin updated successfully", data: updatedAdmin });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ─── Delete Admin ─────────────────────────────────────────────────────────────
const deleteAdmin = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Admin ID" });
    }

    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // Also delete the linked user
    await User.findByIdAndDelete(admin.user_id);

    return res.status(200).json({ success: true, message: "Admin and linked user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createAdmin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin };
