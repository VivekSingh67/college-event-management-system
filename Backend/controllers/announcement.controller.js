const mongoose = require("mongoose");
const Announcement = require("../models/Announcement.model");

// Create Announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, branch_id, department_id, announcement_type, publish_date, expiry_date, created_by, created_by_role, attachment, status } = req.body;

    if (!title || !message || !branch_id || !publish_date || !created_by || !created_by_role) {
      return res.status(400).json({ success: false, message: "title, message, branch_id, publish_date, created_by, and created_by_role are required" });
    }

    const announcement = await Announcement.create({ title, message, branch_id, department_id, announcement_type, publish_date, expiry_date, created_by, created_by_role, attachment, status });

    return res.status(201).json({ success: true, message: "Announcement created successfully", data: announcement });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const { status, announcement_type, branch_id, department_id, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (announcement_type) filter.announcement_type = announcement_type;
    if (branch_id) filter.branch_id = branch_id;
    if (department_id) filter.department_id = department_id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const announcements = await Announcement.find(filter)
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .populate("created_by", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Announcement.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: announcements.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: announcements,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Announcement ID" });
    }

    const announcement = await Announcement.findById(req.params.id)
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .populate("created_by", "name email role");

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    return res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Announcement
const updateAnnouncement = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Announcement ID" });
    }

    const allowedFields = ["title", "message", "department_id", "announcement_type", "publish_date", "expiry_date", "attachment", "status"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const announcement = await Announcement.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .populate("created_by", "name email role");

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    return res.status(200).json({ success: true, message: "Announcement updated successfully", data: announcement });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Announcement
const deleteAnnouncement = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Announcement ID" });
    }

    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    return res.status(200).json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement };
