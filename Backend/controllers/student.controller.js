const mongoose = require("mongoose");
const Student = require("../models/Student.model");

// Create Student
const createStudent = async (req, res) => {
  try {
    const { user_id, branch_id, department_id, batch_id, enrollment_no, semester, year, gender, dob, address, status } = req.body;

    if (!user_id || !branch_id || !department_id || !batch_id || !enrollment_no || !semester) {
      return res.status(400).json({ success: false, message: "user_id, branch_id, department_id, batch_id, enrollment_no, and semester are required" });
    }

    const existing = await Student.findOne({ enrollment_no });
    if (existing) {
      return res.status(409).json({ success: false, message: "Student with this enrollment_no already exists" });
    }

    const student = await Student.create({ user_id, branch_id, department_id, batch_id, enrollment_no, semester, year, gender, dob, address, status });

    return res.status(201).json({ success: true, message: "Student created successfully", data: student });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Students
const getAllStudents = async (req, res) => {
  try {
    const { status, branch_id, department_id, batch_id, year, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (branch_id) filter.branch_id = branch_id;
    if (department_id) filter.department_id = department_id;
    if (batch_id) filter.batch_id = batch_id;
    if (year) filter.year = year;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const students = await Student.find(filter)
      .populate("user_id", "name email phone profile_image")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .populate("batch_id", "batch_name start_year end_year")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: students.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: students,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Student by ID
const getStudentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Student ID" });
    }

    const student = await Student.findById(req.params.id)
      .populate("user_id", "name email phone profile_image")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .populate("batch_id", "batch_name start_year end_year");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Student
const updateStudent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Student ID" });
    }

    const allowedFields = ["branch_id", "department_id", "batch_id", "enrollment_no", "semester", "year", "gender", "dob", "address", "status"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("user_id", "name email phone profile_image")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .populate("batch_id", "batch_name start_year end_year");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.status(200).json({ success: true, message: "Student updated successfully", data: student });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Student
const deleteStudent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Student ID" });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.id })
      .populate("user_id", "name email phone profile_image")
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .populate("batch_id", "batch_name start_year end_year");
    
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }
    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, getStudentProfile };
