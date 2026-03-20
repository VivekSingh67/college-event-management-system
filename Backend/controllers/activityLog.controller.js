const mongoose = require("mongoose");
const ActivityLog = require("../models/ActivityLog.model");

const createActivityLog = async (req, res) => {
  try {
    const { user_id, action, module, description, ip_address } = req.body;
    if (!user_id || !action || !module) {
      return res.status(400).json({ success: false, message: "user_id, action, and module are required" });
    }
    const log = await ActivityLog.create({ user_id, action, module, description, ip_address });
    return res.status(201).json({ success: true, message: "Activity log created successfully", data: log });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getAllActivityLogs = async (req, res) => {
  try {
    const { user_id, action, module, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (user_id) filter.user_id = user_id;
    if (action) filter.action = { $regex: action, $options: "i" };
    if (module) filter.module = { $regex: module, $options: "i" };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const logs = await ActivityLog.find(filter)
      .populate("user_id", "name email role")
      .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await ActivityLog.countDocuments(filter);
    return res.status(200).json({ success: true, count: logs.length, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), data: logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getActivityLogById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Activity Log ID" });
    }
    const log = await ActivityLog.findById(req.params.id).populate("user_id", "name email role");
    if (!log) return res.status(404).json({ success: false, message: "Activity Log not found" });
    return res.status(200).json({ success: true, data: log });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateActivityLog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Activity Log ID" });
    }
    const allowedFields = ["action", "module", "description", "ip_address"];
    const updateData = {};
    allowedFields.forEach((field) => { if (req.body[field] !== undefined) updateData[field] = req.body[field]; });
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }
    const log = await ActivityLog.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("user_id", "name email role");
    if (!log) return res.status(404).json({ success: false, message: "Activity Log not found" });
    return res.status(200).json({ success: true, message: "Activity Log updated successfully", data: log });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteActivityLog = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Activity Log ID" });
    }
    const log = await ActivityLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: "Activity Log not found" });
    return res.status(200).json({ success: true, message: "Activity Log deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createActivityLog, getAllActivityLogs, getActivityLogById, updateActivityLog, deleteActivityLog };
