const batchModel = require("../models/batch.model");
const departmentModel = require("../models/department.model");
const branchModel = require("../models/branch.model");

const createBatch = async (req, res) => {
  try {
    let { branchId, departmentId, batchName } = req.body;
    const branch = await branchModel.findById(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    const department = await departmentModel.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    const existingBatch = await batchModel.findOne({
      branchId,
      departmentId,
      batchName,
    });

    if (existingBatch) {
      return res.status(404).json({
        success: false,
        message: "Batch already exists in this department",
      });
    }

    const batch = await batchModel.create({
      branchId,
      departmentId,
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

const getData = async (req, res) => {
  try {
    const { branchId, departmentId } = req.query;
    const batchs = await batchModel.find({
      branchId,
      departmentId,
    });
    return res.status(201).json({
      success: true,
      count: batchs.length,
      data: batchs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBatch = async (req, res) => {
  try {
    let { branchId, departmentId, batchName } = req.body;
    const batch = await batchModel.findOneAndUpdate(
      { _id: req.params.id },
      { branchId, departmentId, batchName },
    );

    const updateBatchData = await batchModel.findOne({ _id: req.params.id });

    return res.status(201).json({
      success: true,
      data: updateBatchData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBatch = async (req, res) => {
  try {
    const { branchId, departmentId } = req.query;
    const deleteBatch = await batchModel.findOneAndDelete({
      _id: req.params.id,
    });
    const batchs = await batchModel.find({
      branchId,
      departmentId,
    });
    return res.status(201).json({
      success: true,
      data: batchs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createBatch, getData, updateBatch, deleteBatch };
