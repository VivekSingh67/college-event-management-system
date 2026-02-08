const departmentModel = require("../models/department.model");
const branchModel = require("../models/branch.model");

const createDepartment = async (req, res) => {
  try {
    let { branchId, departmentName } = req.body;

    const branch = await branchModel.findById(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    const existingDepartment = await departmentModel.findOne({
      branchId,
      departmentName,
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department already exists in this branch",
      });
    }

    const department = await departmentModel.create({
      branchId,
      departmentName,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDepartmentData = async (req, res) => {
  try {
    let { branchId } = req.params;
    const departments = await departmentModel
      .find({ branchId })
      .populate("branchId", "branchName");
    return res.status(201).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDepartment = async (req, res) => {
  try {
    let { departmentName } = req.body;

    let department = await departmentModel.findOneAndUpdate(
      { _id: req.params.id },
      { departmentName },
    );

    return res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createDepartment, getDepartmentData, updateDepartment };
