const mongoose = require("mongoose");
const EventRegistration = require("../models/EventRegistration.model");

// Create Event Registration
const createEventRegistration = async (req, res) => {
  try {
    const { event_id, student_id, team_name, payment_status, attendance_status, status } = req.body;

    if (!event_id || !student_id) {
      return res.status(400).json({ success: false, message: "event_id and student_id are required" });
    }

    const existing = await EventRegistration.findOne({ event_id, student_id });
    if (existing) {
      return res.status(409).json({ success: false, message: "Student is already registered for this event" });
    }

    const registration = await EventRegistration.create({ event_id, student_id, team_name, payment_status, attendance_status, status });

    return res.status(201).json({ success: true, message: "Event registration created successfully", data: registration });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Event Registrations
const getAllEventRegistrations = async (req, res) => {
  try {
    const { event_id, student_id, status, payment_status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (event_id) filter.event_id = event_id;
    if (student_id) filter.student_id = student_id;
    if (status) filter.status = status;
    if (payment_status) filter.payment_status = payment_status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const registrations = await EventRegistration.find(filter)
      .populate("event_id", "event_title event_type event_date")
      .populate("student_id", "enrollment_no year semester")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EventRegistration.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: registrations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Event Registration by ID
const getEventRegistrationById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Registration ID" });
    }

    const registration = await EventRegistration.findById(req.params.id)
      .populate("event_id", "event_title event_type event_date")
      .populate("student_id", "enrollment_no year semester");

    if (!registration) {
      return res.status(404).json({ success: false, message: "Event Registration not found" });
    }

    return res.status(200).json({ success: true, data: registration });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Event Registration
const updateEventRegistration = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Registration ID" });
    }

    const allowedFields = ["team_name", "payment_status", "attendance_status", "status"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const registration = await EventRegistration.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("event_id", "event_title event_type event_date")
      .populate("student_id", "enrollment_no year semester");

    if (!registration) {
      return res.status(404).json({ success: false, message: "Event Registration not found" });
    }

    return res.status(200).json({ success: true, message: "Event Registration updated successfully", data: registration });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Event Registration
const deleteEventRegistration = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Registration ID" });
    }

    const registration = await EventRegistration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: "Event Registration not found" });
    }

    return res.status(200).json({ success: true, message: "Event Registration deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const student = await mongoose.model("Student").findOne({ user_id: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student profile not found" });
    }

    const registrations = await EventRegistration.find({ student_id: student._id })
      .populate("event_id", "event_title event_type event_date location")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createEventRegistration, getAllEventRegistrations, getEventRegistrationById, updateEventRegistration, deleteEventRegistration, getMyRegistrations };
