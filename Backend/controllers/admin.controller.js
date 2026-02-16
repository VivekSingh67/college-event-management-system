const adminModel = require("../models/admin.model");
const authModel = require("../models/auth.model");
const branchModel = require("../models/branch.model");

const createAdmin = async (req, res) => {
  try {
    let { branchId, fullname, email, mobile, role } = req.body;
    const auth = await authModel.create({
      fullname: {
        firstname: fullname.firstname,
        lastname: firstname.lastname,
      },
      email,
      role,
    });

    const branch = await branchModel.findById(branchId);
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    const admin = await adminModel.create({
      branchId,
      userId: auth._id,
      fullname: {
        firstname: fullname.firstname,
        lastname: firstname.lastname,
      },
      email,
      mobile,
    });

    return res.status(201).json({
        success: true,
        message: "Admin Created Successfully",
        admin
    })
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message
    })
  }
};

const getData = async (req, res) => {
  try {
    const admin = await adminModel.find({ branchId: req.qurey });
    return res.status(201).json({
      success: true,
      message: "Fetch Admin Data",
      admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDataById = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.params.id);
    return res.status(201).json({
      success: true,
      message: "Fetch Particular Admin Data",
      admin,
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
    let { branchId, fullname, email, mobile } = req.body;
    const auth = await authModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        fullname: {
          firstname: fullname.firstname,
          lastname: fullname.lastname,
        },
        email,
      },
    );
    const admin = await adminModel.findOneAndUpdate(
      { userId: req.body.id },
      {
        branchId,
        fullname: {
          firstname: fullname.firstname,
          lastname: fullname.lastname,
        },
        email,
        mobile,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Data Updated Successfully",
      admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {createAdmin, getData, getDataById, updateData };
