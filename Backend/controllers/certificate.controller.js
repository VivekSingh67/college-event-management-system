const mongoose = require("mongoose");
const Certificate = require("../models/Certificate.model");

// Create Certificate
const createCertificate = async (req, res) => {
  try {
    const { event_id, student_id, certificate_title, certificate_file, issued_by, issued_date } = req.body;

    if (!event_id || !student_id || !certificate_title || !issued_by) {
      return res.status(400).json({ success: false, message: "event_id, student_id, certificate_title, and issued_by are required" });
    }

    const certificate = await Certificate.create({ event_id, student_id, certificate_title, certificate_file, issued_by, issued_date });

    return res.status(201).json({ success: true, message: "Certificate created successfully", data: certificate });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get All Certificates
const getAllCertificates = async (req, res) => {
  try {
    const { event_id, student_id, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (event_id) filter.event_id = event_id;
    if (student_id) filter.student_id = student_id;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const certificates = await Certificate.find(filter)
      .populate("event_id", "event_title event_type event_date")
      .populate("student_id", "enrollment_no year")
      .populate("issued_by", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Certificate.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: certificates.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      data: certificates,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get Certificate by ID
const getCertificateById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Certificate ID" });
    }

    const certificate = await Certificate.findById(req.params.id)
      .populate("event_id", "event_title event_type event_date")
      .populate("student_id", "enrollment_no year")
      .populate("issued_by", "name email role");

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    return res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Certificate
const updateCertificate = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Certificate ID" });
    }

    const allowedFields = ["certificate_title", "certificate_file", "issued_date"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const certificate = await Certificate.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate("event_id", "event_title event_type event_date")
      .populate("student_id", "enrollment_no year")
      .populate("issued_by", "name email role");

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    return res.status(200).json({ success: true, message: "Certificate updated successfully", data: certificate });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Certificate
const deleteCertificate = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Certificate ID" });
    }

    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    return res.status(200).json({ success: true, message: "Certificate deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { createCertificate, getAllCertificates, getCertificateById, updateCertificate, deleteCertificate };
