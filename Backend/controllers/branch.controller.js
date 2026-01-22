const branchModel = require('../models/branch.model');


const createBranch = async (req, res) => {
  try {
    const { branchName, branchAddress } = req.body;

    if (!branchName || !branchAddress) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const branch = await branchModel.create({
      branchName,
      branchAddress,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });

    res.status(201).json({
      message: "Branch successfully created",
      branch
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



module.exports = { createBranch }