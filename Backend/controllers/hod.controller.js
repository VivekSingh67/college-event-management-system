const hodModels = require("../models/hod.model");

const createHod = (req, res) => {
  try {
    let {branchId, departmentId, fullname, email, mobile} = req.body;
  } catch (error) {}
};

module.exports = { createHod };
