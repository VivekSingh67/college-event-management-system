const express = require("express");
const router = express.Router();
const { createCertificate, getAllCertificates, getCertificateById, updateCertificate, deleteCertificate } = require("../controllers/certificate.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOrHod, adminOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/certificates       — admin/hod issues certificates
router.post("/", protect, adminOrHod, validate("certificate"), createCertificate);

// GET    /api/certificates       — admin/hod can see all
router.get("/", protect, adminOrHod, getAllCertificates);

// GET    /api/certificates/:id   — authenticated (students can view own)
router.get("/:id", protect, getCertificateById);

// PUT    /api/certificates/:id   — admin/hod can update
router.put("/:id", protect, adminOrHod, updateCertificate);

// DELETE /api/certificates/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteCertificate);

module.exports = router;
