const mongoose = require("mongoose");
const EventAttendance = require("../models/EventAttendance.model");

// Create Attendance
const createAttendance = async (req, res) => {
  try {
    const { event_id, student_id, attendance_status, marked_by, marked_at } = req.body;

    if (!event_id || !student_id || !marked_by) {
      return res.status(400).json({ success: false, message: "event_id, student_id, and marked_by are required" });
    }

    const attendance = await EventAttendance.create({ event_id, student_id, attendance_status, marked_by, marked_at });

    return res.status(201).json({ success: true, message: "Attendance marked successfully", data: attendance });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Attendance
const getAllAttendance = async (req, res) => {
  try {
    const { event_id, student_id, attendance_status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (event_id) filter.event_id = event_id;
    if (student_id) filter.student_id = student_id;
    if (attendance_status !== undefined) filter.attendance_status = attendance_status === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const records = await EventAttendance.find(filter)
      .populate("event_id", "event_title event_date")
      .populate("student_id", "enrollment_no")
      .populate("marked_by", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EventAttendance.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: records.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: records,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Attendance by ID
const getAttendanceById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Attendance ID" });
    }

    const record = await EventAttendance.findById(req.params.id)
      .populate("event_id", "event_title event_date")
      .populate("student_id", "enrollment_no")
      .populate("marked_by", "name email role");

    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    return res.status(200).json({ success: true, data: record });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Attendance
const updateAttendance = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Attendance ID" });
    }

    const allowedFields = ["attendance_status", "marked_at"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const record = await EventAttendance.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("event_id", "event_title event_date")
      .populate("student_id", "enrollment_no")
      .populate("marked_by", "name email role");

    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    return res.status(200).json({ success: true, message: "Attendance updated successfully", data: record });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Attendance
const deleteAttendance = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Attendance ID" });
    }

    const record = await EventAttendance.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    return res.status(200).json({ success: true, message: "Attendance record deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createAttendance, getAllAttendance, getAttendanceById, updateAttendance, deleteAttendance };
