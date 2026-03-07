const branchModel = require('../models/branch.model');


const createBranch = async (req, res) => {
  try {
    const { branchName, city, address } = req.body;

    if (!branchName || !address) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const lastBranch = await branchModel.findOne().sort({ createdAt: -1 });
    let counter = 1;
    if (lastBranch && lastBranch.collegeId) {
      const lastId = lastBranch.collegeId.split('_')[1];
      counter = parseInt(lastId) + 1;
    }
    const collegeId = `COL_${counter.toString().padStart(6, '0')}`;

    const branch = await branchModel.create({
      collegeId: collegeId,
      branchName,
      city,
      address,
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

const getBranchData = async (req, res) => {
  try {
    let branch = await branchModel.find().populate('createdBy', 'fullname email')
    res.status(200).json({
      message: "Get Successfully branch Data",
      branch
    })
  } catch (error) {
    res.status(401).json({
      message: error.message
    })
  }
}

const deleteBranch = async (req, res) => {
  try {
    const branch = await branchModel.findOneAndDelete({ _id: req.params.id })

    res.status(200).json({
      branch
    })

  } catch (error) {
    res.status(401).json({
      message: error.message
    })
  }

}

const updateBranch = async (req, res) => {
  try {
    const { branchName, city, address } = req.body;
    let updateBranch = await branchModel.findOneAndUpdate({ _id: req.params.id }, { branchName, city, address })
    let branch = await branchModel.findById(req.params.id)
    res.status(200).json({
      message: "Branch Updated Successfully",
      branch
    })
  } catch (error) {
    res.status(401).json({
      message: error.message
    })
  }
}


module.exports = { createBranch, getBranchData, updateBranch, deleteBranch }