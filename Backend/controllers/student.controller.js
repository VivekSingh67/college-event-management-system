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