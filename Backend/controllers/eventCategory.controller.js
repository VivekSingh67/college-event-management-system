const mongoose = require("mongoose");
const EventCategory = require("../models/EventCategory.model");

// Create Event Category
const createEventCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "name is required" });
    }

    const existing = await EventCategory.findOne({ name });
    if (existing) {
      return res.status(409).json({ success: false, message: "Event category with this name already exists" });
    }

    const category = await EventCategory.create({ name, description, status, created_by: req.user._id });

    return res.status(201).json({ success: true, message: "Event category created successfully", data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Event Categories
const getAllEventCategories = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const categories = await EventCategory.find(filter)
      .populate("created_by", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EventCategory.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: categories.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Event Category by ID
const getEventCategoryById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Category ID" });
    }

    const category = await EventCategory.findById(req.params.id).populate("created_by", "name email role");

    if (!category) {
      return res.status(404).json({ success: false, message: "Event Category not found" });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Event Category
const updateEventCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Category ID" });
    }

    const allowedFields = ["name", "description", "status"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const category = await EventCategory.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("created_by", "name email role");

    if (!category) {
      return res.status(404).json({ success: false, message: "Event Category not found" });
    }

    return res.status(200).json({ success: true, message: "Event Category updated successfully", data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Event Category
const deleteEventCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Category ID" });
    }

    const category = await EventCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Event Category not found" });
    }

    return res.status(200).json({ success: true, message: "Event Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createEventCategory, getAllEventCategories, getEventCategoryById, updateEventCategory, deleteEventCategory };
