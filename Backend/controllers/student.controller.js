<<<<<<< HEAD
const studentModel = require("../models/student.model");

const getData = async (req, res) => {
    try {
        const students = await studentModel.find({
            branch: req.query.branchId,
            department: req.query.departmentId,
            batch: req.query.batchId,
            year: req.query.year
        }).populate("branch").populate("department").populate("batch");
        res.status(200).json({
            success: true,
            data: students,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getDataById = async (req, res) => {
    try {
         const students = await studentModel.findOne({ _id: req.params.id }).populate("branch").populate("department").populate("batch");
        res.status(200).json({
            success: true,
            data: students,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = { getData, getDataById }
=======
const authModel = require("../models/auth.model");
const studentModel = require("../models/student.model");

const getData = async (req, res) => {
  try {
    const students = await studentModel
      .find({
        branch: req.query.branchId,
        department: req.query.departmentId,
        batch: req.query.batchId,
        year: req.query.year,
      })
      .populate("branch")
      .populate("department")
      .populate("batch");
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDataById = async (req, res) => {
  try {
    const students = await studentModel
      .findOne({ _id: req.params.id })
      .populate("branch")
      .populate("department")
      .populate("batch");
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateData = async (req, res) => {
  try {
    let { fullname, email, branch, department, batch, year, mobile, isActive } = req.body;
    const auth = await authModel.findOneAndUpdate({_id: req.params.id}, {isActive: isActive})
    const student = await studentModel.findOneAndUpdate(
      { userId: req.params.id },
      {
        fullname: {
          firstname: fullname.firstname,
          lastname: fullname.lastname,
        },
        email,
        mobile,
        branch,
        department,
        batch,
        year,
      },
    );

    return res.status(201).json({
        success: true,
        message: "Update Successfully",
        student
    })
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message
    })
  }
};

module.exports = { getData, getDataById, updateData };
>>>>>>> dfc5e3e (feb16)
