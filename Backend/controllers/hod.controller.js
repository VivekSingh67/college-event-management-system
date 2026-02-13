const hodModel = require("../models/hod.model");
const authModel = require("../models/auth.model");
const branchModel = require("../models/branch.model");
const departmentModel = require("../models/department.model");
const bcrypt = require("bcryptjs");

const createHod = async (req, res) => {
  try {
    let { branchId, departmentId, fullname, email, mobile, password, role } =
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
      branchId,
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
    let { branchId, departmentId } = req.query;
    const hod = await hodModel.find({
      branchId,
      departmentId,
    });

    return res.status(201).json({
      success: true,
      data: hod,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateData = async () => {
  try {
    let { branchId, departmentId, fullname, email, mobile, role } = req.body;

    const hod = await hodModel.findOneAndUpdate(
      { _id: req.params.id },
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

    const updateDatas = await hodModel.findOne(req.params.id);

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

module.exports = { createHod, getData, updateData };
