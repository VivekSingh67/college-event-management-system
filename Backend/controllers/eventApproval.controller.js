const mongoose = require("mongoose");
const EventApproval = require("../models/EventApproval.model");

// Create Event Approval
const createEventApproval = async (req, res) => {
  try {
    const { event_id, approved_by, approver_role, approval_status, remarks, approval_date } = req.body;

    if (!event_id || !approved_by || !approver_role) {
      return res.status(400).json({ success: false, message: "event_id, approved_by, and approver_role are required" });
    }

    const approval = await EventApproval.create({ event_id, approved_by, approver_role, approval_status, remarks, approval_date });

    return res.status(201).json({ success: true, message: "Event approval created successfully", data: approval });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Event Approvals
const getAllEventApprovals = async (req, res) => {
  try {
    const { approval_status, approver_role, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (approval_status) filter.approval_status = approval_status;
    if (approver_role) filter.approver_role = approver_role;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const approvals = await EventApproval.find(filter)
      .populate("event_id", "event_title event_type event_date")
      .populate("approved_by", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await EventApproval.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: approvals.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: approvals,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Event Approval by ID
const getEventApprovalById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Approval ID" });
    }

    const approval = await EventApproval.findById(req.params.id)
      .populate("event_id", "event_title event_type event_date")
      .populate("approved_by", "name email role");

    if (!approval) {
      return res.status(404).json({ success: false, message: "Event Approval not found" });
    }

    return res.status(200).json({ success: true, data: approval });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Event Approval
const updateEventApproval = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Approval ID" });
    }

    const allowedFields = ["approval_status", "remarks", "approval_date"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const approval = await EventApproval.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("event_id", "event_title event_type event_date")
      .populate("approved_by", "name email role");

    if (!approval) {
      return res.status(404).json({ success: false, message: "Event Approval not found" });
    }

    return res.status(200).json({ success: true, message: "Event Approval updated successfully", data: approval });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Event Approval
const deleteEventApproval = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Event Approval ID" });
    }

    const approval = await EventApproval.findByIdAndDelete(req.params.id);
    if (!approval) {
      return res.status(404).json({ success: false, message: "Event Approval not found" });
    }

    return res.status(200).json({ success: true, message: "Event Approval deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createEventApproval, getAllEventApprovals, getEventApprovalById, updateEventApproval, deleteEventApproval };
