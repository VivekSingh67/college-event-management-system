const hodModel = require("../models/hod.model");
const authModel = require("../models/auth.model");
const branchModel = require("../models/branch.model");
const departmentModel = require("../models/department.model");
const bcrypt = require("bcryptjs");

const createHod = async (req, res) => {
  try {
    let { branchId, adminId, departmentId, fullname, email, mobile, password, role } =
      req.body;

    const hashPassword = await bcrypt.hash(password, 10);

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

    const existingHod = await hodModel.findOne({
      branchId,
      adminId,
      departmentId,
    });

    if (existingHod) {
      return res.status(400).json({
        success: false,
        message: "This Hod already exists",
      });
    }

    const auth = await authModel.create({
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      email,
      password: hashPassword,
      role,
    });

    const hod = await hodModel.create({
      userId: auth._id,
      branchId,
      adminId,
      departmentId,
      fullname,
      email,
      mobile,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    return res.status(200).json({
      success: true,
      message: "Hod created successfully",
      data: hod,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};


const getData = async (req, res) => {
  try {
    let { branchId, departmentId, adminId } = req.query;

    // Build filter object dynamically
    let filter = {};

    // Add filters only if they are provided
    if (branchId) {
      filter.branchId = branchId;
    }

    if (departmentId) {
      filter.departmentId = departmentId;
    }

    if (adminId) {
      filter.adminId = adminId;
    }


    const hod = await hodModel.find(filter)
      .populate('branchId', 'branchName')
      .populate('departmentId', 'departmentName')
      .populate('adminId', 'fullname email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: hod,
      filters: {              // Send back applied filters for reference
        branchId: branchId || null,
        departmentId: departmentId || null,
        adminId: adminId || null
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateData = async (req, res) => {
  try {
    let { branchId, departmentId, fullname, email, mobile, role, isActive } = req.body;

    const auth = await authModel.findOneAndUpdate({ _id: req.params.id }, {
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      email,
      role,
      isActive
    });

    const hod = await hodModel.findOneAndUpdate(
      { userId: req.params.id },
      {
        branchId,
        departmentId,
        fullname: {
          firstname: fullname.firstname,
          lastname: fullname.lastname,
        },
        email,
        mobile,
        role,
      },
    );

    const updateDatas = await hodModel.findOne({ userId: req.params.id });

    return res.status(201).json({
      success: true,
      data: updateDatas,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deactivateHod = async (req, res) => {
  try {
    const { id } = req.params;  // This is the userId
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Check if HOD exists
    const hod = await hodModel.findOne({ userId: id });
    if (!hod) {
      return res.status(404).json({
        success: false,
        message: "HOD not found"
      });
    }

    // Check if already deactivated
    const authUser = await authModel.findById(id);
    if (!authUser.isActive) {
      return res.status(400).json({
        success: false,
        message: "HOD is already deactivated"
      });
    }

    // Deactivate the user in auth model
    const deactivatedUser = await authModel.findByIdAndUpdate(
      id,
      {
        isActive: false
      },
      { new: true }
    );

    // Update hod model with deactivation info
    await hodModel.findOneAndUpdate(
      { userId: id },
      {
        updatedBy: req.user.id
      }
    );

    return res.status(200).json({
      success: true,
      message: "HOD deactivated successfully",
      data: {
        userId: id,
        fullname: deactivatedUser.fullname,
        email: deactivatedUser.email,
        isActive: deactivatedUser.isActive,
        role: deactivatedUser.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = { createHod, getData, updateData, deactivateHod }; 