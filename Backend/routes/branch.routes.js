const express = require("express");
const router = express.Router();
const collegeController = require("../controllers/branch.controller")
 
router.post("/", collegeController.createBranch);
 
module.exports = router;