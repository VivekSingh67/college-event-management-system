const express = require("express");
const router = express.Router();
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, getStudentProfile } = require("../controllers/student.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly, adminOrHod, staffOnly } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");

// POST   /api/students       — admin/hod can add students
router.post("/", protect, adminOrHod, validate("student"), createStudent);

// GET    /api/students       — staff can view all students
router.get("/", protect, staffOnly, getAllStudents);

// GET    /api/students/me     — get current student profile
router.get("/me", protect, getStudentProfile);

// GET    /api/students/:id   — authenticated users (students can view their own profile)
router.get("/:id", protect, getStudentById);

// PUT    /api/students/:id   — admin/hod
router.put("/:id", protect, adminOrHod, updateStudent);

// DELETE /api/students/:id   — admin only
router.delete("/:id", protect, adminOnly, deleteStudent);

module.exports = router;
