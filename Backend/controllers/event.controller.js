const mongoose = require("mongoose");
const Event = require("../models/Event.model");

// Create Event
const createEvent = async (req, res) => {
  try {
    const {
      branch_id, department_id, event_title, event_type, event_description, event_banner,
      event_date, start_time, end_time, location, max_participants, registration_deadline,
      organizer_name, approval_status, event_status,
    } = req.body;

    if (!branch_id || !event_title || !event_type || !event_date) {
      return res.status(400).json({ success: false, message: "branch_id, event_title, event_type, and event_date are required" });
    }

    const event = await Event.create({
      branch_id, department_id, event_title, event_type, event_description, event_banner,
      event_date, start_time, end_time, location, max_participants, registration_deadline,
      organizer_name, 
      created_by: req.user._id, 
      created_by_role: req.user.role, 
      approval_status, event_status,
    });

    return res.status(201).json({ success: true, message: "Event created successfully", data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const { event_type, approval_status, event_status, branch_id, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (event_type) filter.event_type = event_type;
    if (approval_status) filter.approval_status = approval_status;
    if (event_status) filter.event_status = event_status;
    if (branch_id) filter.branch_id = branch_id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find(filter)
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .populate("created_by", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: events,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Event by ID
const getEventById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event ID" });
    }

    const event = await Event.findById(req.params.id)
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .populate("created_by", "name email role");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event ID" });
    }

    const allowedFields = [
      "department_id", "event_title", "event_type", "event_description", "event_banner",
      "event_date", "start_time", "end_time", "location", "max_participants",
      "registration_deadline", "organizer_name", "approval_status", "event_status",
    ];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .populate("created_by", "name email role");

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({ success: true, message: "Event updated successfully", data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event ID" });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent };
