const mongoose = require("mongoose");
const EventVenue = require("../models/EventVenue.model");

// Create Event Venue
const createEventVenue = async (req, res) => {
  try {
    const { branch_id, venue_name, location, capacity, description, status } = req.body;

    if (!branch_id || !venue_name) {
      return res.status(400).json({ success: false, message: "branch_id and venue_name are required" });
    }

    const venue = await EventVenue.create({ branch_id, venue_name, location, capacity, description, status });

    return res.status(201).json({ success: true, message: "Event Venue created successfully", data: venue });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Event Venues
const getAllEventVenues = async (req, res) => {
  try {
    const { status, branch_id, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (branch_id) filter.branch_id = branch_id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const venues = await EventVenue.find(filter)
      .populate("branch_id", "branch_name branch_code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EventVenue.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: venues.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: venues,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Event Venue by ID
const getEventVenueById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Venue ID" });
    }

    const venue = await EventVenue.findById(req.params.id).populate("branch_id", "branch_name branch_code");

    if (!venue) {
      return res.status(404).json({ success: false, message: "Event Venue not found" });
    }

    return res.status(200).json({ success: true, data: venue });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Event Venue
const updateEventVenue = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Venue ID" });
    }

    const allowedFields = ["branch_id", "venue_name", "location", "capacity", "description", "status"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const venue = await EventVenue.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("branch_id", "branch_name branch_code");

    if (!venue) {
      return res.status(404).json({ success: false, message: "Event Venue not found" });
    }

    return res.status(200).json({ success: true, message: "Event Venue updated successfully", data: venue });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Event Venue
const deleteEventVenue = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Venue ID" });
    }

    const venue = await EventVenue.findByIdAndDelete(req.params.id);
    if (!venue) {
      return res.status(404).json({ success: false, message: "Event Venue not found" });
    }

    return res.status(200).json({ success: true, message: "Event Venue deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createEventVenue, getAllEventVenues, getEventVenueById, updateEventVenue, deleteEventVenue };
