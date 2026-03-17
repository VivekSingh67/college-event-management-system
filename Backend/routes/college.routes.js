const express = require("express");
const router = express.Router();
const collegeController = require("../controllers/college.controller")
 
router.post("/", collegeController.createCollege);
router.get("/", collegeController.getAllColleges);
router.get("/:id", collegeController.getCollegeById);
router.get("/:id", collegeController.getCollegeById);
router.delete("/:id", collegeController.deleteCollege);
router.get("/status/:status ", collegeController.getCollegesByStatus);
 
module.exports = router;