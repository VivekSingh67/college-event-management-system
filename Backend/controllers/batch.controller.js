const batchModel = require("../models/batch.model");
const departmentModel = require("../models/department.model");
const branchModel = require("../models/branch.model");

const createBatch = async (req, res) => {
  try {
    let { branchId, departmentID, batchName } = req.body;
    const branch = await branchModel.findById(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    const department = await departmentModel.findById(departmentID);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const existingBatch = await batchModel.findOne({
        branchId,
        departmentID,
        batchName
    })

    if(existingBatch){
        return res.status(404).json({
        success: false,
        message: "Batch already exists in this department",
      });
    }

    const batch = await batchModel.create({
      branchId,
      departmentID,
      batchName,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createBatch };
