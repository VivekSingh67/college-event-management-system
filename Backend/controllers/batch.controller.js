const mongoose = require("mongoose");
const Batch = require("../models/Batch.model");

// Create Batch
const createBatch = async (req, res) => {
  try {
    const { branch_id, department_id, batch_name, start_year, end_year, total_students, current_semester, status } = req.body;

    if (!branch_id || !department_id || !batch_name || !start_year || !end_year) {
      return res.status(400).json({ success: false, message: "branch_id, department_id, batch_name, start_year, and end_year are required" });
    }

    const batch = await Batch.create({ branch_id, department_id, batch_name, start_year, end_year, total_students, current_semester, status });

    return res.status(201).json({ success: true, message: "Batch created successfully", data: batch });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate field value", error: error.message });
    }
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Batches
const getAllBatches = async (req, res) => {
  try {
    const { status, branch_id, department_id, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (branch_id) filter.branch_id = branch_id;
    if (department_id) filter.department_id = department_id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const batches = await Batch.find(filter)
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Batch.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: batches.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: batches,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Batch by ID
const getBatchById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Batch ID" });
    }

    const batch = await Batch.findById(req.params.id)
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code");

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    return res.status(200).json({ success: true, data: batch });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Batch
const updateBatch = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Batch ID" });
    }

    const allowedFields = ["branch_id", "department_id", "batch_name", "start_year", "end_year", "total_students", "current_semester", "status"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const batch = await Batch.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("branch_id", "branch_name branch_code")
      .populate("department_id", "department_name department_code");

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    return res.status(200).json({ success: true, message: "Batch updated successfully", data: batch });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Batch
const deleteBatch = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Batch ID" });
    }

    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    return res.status(200).json({ success: true, message: "Batch deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createBatch, getAllBatches, getBatchById, updateBatch, deleteBatch };
