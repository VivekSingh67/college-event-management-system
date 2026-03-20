const mongoose = require("mongoose");
const QueryReply = require("../models/QueryReply.model");

const createQueryReply = async (req, res) => {
  try {
    const { query_id, replied_by, message } = req.body;
    if (!query_id || !replied_by || !message) {
      return res.status(400).json({ success: false, message: "query_id, replied_by, and message are required" });
    }
    const reply = await QueryReply.create({ query_id, replied_by, message });
    return res.status(201).json({ success: true, message: "Query reply created successfully", data: reply });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getAllQueryReplies = async (req, res) => {
  try {
    const { query_id, replied_by, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (query_id) filter.query_id = query_id;
    if (replied_by) filter.replied_by = replied_by;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const replies = await QueryReply.find(filter)
      .populate("query_id", "subject status priority")
      .populate("replied_by", "name email role")
      .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await QueryReply.countDocuments(filter);
    return res.status(200).json({ success: true, count: replies.length, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), data: replies });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getQueryReplyById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Query Reply ID" });
    }
    const reply = await QueryReply.findById(req.params.id)
      .populate("query_id", "subject status priority")
      .populate("replied_by", "name email role");
    if (!reply) return res.status(404).json({ success: false, message: "Query Reply not found" });
    return res.status(200).json({ success: true, data: reply });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateQueryReply = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Query Reply ID" });
    }
    if (!req.body.message) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }
    const reply = await QueryReply.findByIdAndUpdate(req.params.id, { message: req.body.message }, { new: true, runValidators: true })
      .populate("query_id", "subject status priority")
      .populate("replied_by", "name email role");
    if (!reply) return res.status(404).json({ success: false, message: "Query Reply not found" });
    return res.status(200).json({ success: true, message: "Query Reply updated successfully", data: reply });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteQueryReply = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Query Reply ID" });
    }
    const reply = await QueryReply.findByIdAndDelete(req.params.id);
    if (!reply) return res.status(404).json({ success: false, message: "Query Reply not found" });
    return res.status(200).json({ success: true, message: "Query Reply deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createQueryReply, getAllQueryReplies, getQueryReplyById, updateQueryReply, deleteQueryReply };
