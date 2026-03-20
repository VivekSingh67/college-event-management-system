const mongoose = require("mongoose");
const Notification = require("../models/Notification.model");

// Create Notification
const createNotification = async (req, res) => {
  try {
    const { user_id, title, message, type, is_read } = req.body;

    if (!user_id || !title || !message) {
      return res.status(400).json({ success: false, message: "user_id, title, and message are required" });
    }

    const notification = await Notification.create({ user_id, title, message, type, is_read });

    return res.status(201).json({ success: true, message: "Notification created successfully", data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Notifications
const getAllNotifications = async (req, res) => {
  try {
    const { user_id, type, is_read, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (user_id) filter.user_id = user_id;
    if (type) filter.type = type;
    if (is_read !== undefined) filter.is_read = is_read === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const notifications = await Notification.find(filter)
      .populate("user_id", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: notifications,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Notification by ID
const getNotificationById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Notification ID" });
    }

    const notification = await Notification.findById(req.params.id).populate("user_id", "name email role");

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Notification
const updateNotification = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Notification ID" });
    }

    const allowedFields = ["title", "message", "type", "is_read"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const notification = await Notification.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("user_id", "name email role");

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({ success: true, message: "Notification updated successfully", data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Notification
const deleteNotification = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Notification ID" });
    }

    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    return res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification };
