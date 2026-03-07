const departmentModel = require("../models/department.model");
const branchModel = require("../models/branch.model");
const adminModel = require("../models/admin.model");

const createDepartment = async (req, res) => {
  try {
    let { branchId, adminId, departmentName, description } = req.body;

    const branch = await branchModel.findById(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    const admin = await adminModel.findOne({ userId: adminId });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const existingDepartment = await departmentModel.findOne({
      branchId,
      adminId,
      departmentName,
      description
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: "Department already exists in this branch",
      });
    }

    const department = await departmentModel.create({
      branchId,
      adminId,
      departmentName,
      description,
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
    let { branchId } = req.query;

    // Create query object
    let query = {};

    // If branchId is provided in query, add it to filter
    if (branchId) {
      query.branchId = branchId;
    }

    const departments = await departmentModel
      .find(query)
      .populate("branchId", "branchName")
      .populate("adminId", "fullname")
      .populate('createdBy', 'fullname email');

    return res.status(200).json({
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
    let { departmentName, description } = req.body;

    let department = await departmentModel.findOneAndUpdate(
      { _id: req.params.id },
      { departmentName, description },
    );

    let updateDepartmentData = await departmentModel.findOne({
      _id: req.params.id,
    });
    return res.status(201).json({
      success: true,
      data: updateDepartmentData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    let department = await departmentModel.findOneAndDelete({
      _id: req.params.id,
    });
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

module.exports = {
  createDepartment,
  getDepartmentData,
  updateDepartment,
  deleteDepartment,
};
