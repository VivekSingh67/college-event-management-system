const mongoose = require("mongoose");
const Query = require("../models/Query.model");

const createQuery = async (req, res) => {
  try {
    const { student_id, subject, message, priority, status, reply } = req.body;
    if (!student_id || !subject || !message) {
      return res.status(400).json({ success: false, message: "student_id, subject, and message are required" });
    }
    const query = await Query.create({ student_id, subject, message, priority, status, reply });
    return res.status(201).json({ success: true, message: "Query created successfully", data: query });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getAllQueries = async (req, res) => {
  try {
    const { student_id, priority, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (student_id) filter.student_id = student_id;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const queries = await Query.find(filter)
      .populate("student_id", "enrollment_no year semester")
      .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Query.countDocuments(filter);
    return res.status(200).json({ success: true, count: queries.length, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), data: queries });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getQueryById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Query ID" });
    }
    const query = await Query.findById(req.params.id).populate("student_id", "enrollment_no year semester");
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });
    return res.status(200).json({ success: true, data: query });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateQuery = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Query ID" });
    }
    const allowedFields = ["subject", "message", "priority", "status", "reply"];
    const updateData = {};
    allowedFields.forEach((field) => { if (req.body[field] !== undefined) updateData[field] = req.body[field]; });
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }
    const query = await Query.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("student_id", "enrollment_no year semester");
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });
    return res.status(200).json({ success: true, message: "Query updated successfully", data: query });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteQuery = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Query ID" });
    }
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) return res.status(404).json({ success: false, message: "Query not found" });
    return res.status(200).json({ success: true, message: "Query deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createQuery, getAllQueries, getQueryById, updateQuery, deleteQuery };
