const authModel = require("../models/auth.model");
const studentModel = require("../models/student.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authRegister = async (req, res) => {
  let { fullname, email, role, password, branch, department, batch, year, mobile } = req.body;
  if (!fullname.firstname || !email || !password) {
    return res.status(401).json({
      message: "All Field Are Required",
    });
  }

  let isExists = await authModel.findOne({ email: email });
  if (isExists) {
    return res.status(401).json({
      message: "Email Already Exists",
    });
  }

  let hashPassword = await bcrypt.hash(password, 10);

  const user = await authModel.create({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    role,
    password: hashPassword,
  });

  await studentModel.create({
      userId: user._id,
      fullname,
      email,
      mobile,
      branch,
      department,
      batch,
      year,
    });

  let token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token);
  res.status(200).json({
    token,
    user,
  });
};

const authLogin = async (req, res) => {
  let { email, password } = req.body;

  let user = await authModel.findOne({ email: email });
  if (!user) {
    return res.status(401).json({
      message: "Invalid Email or Password",
    });
  }

  let comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return res.status(401).json({
      message: "Invalid Email or Password",
    });
  }

  let token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "Successfully Login",
    token,
    user,
  });
};

module.exports = { authRegister, authLogin };
