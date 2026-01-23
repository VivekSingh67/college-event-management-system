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

const getBranchData = async (req, res) => {
  try {
    let branch = await branchModel.find()
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
     const {branchName, branchAddress} = req.body;
    let branch = await branchModel.findOneAndUpdate({_id: req.params.id}, {branchName, branchAddress})
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