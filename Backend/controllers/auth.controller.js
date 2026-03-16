const userModel = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    let { name, email, phone, password, profile_image, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All Field Are Required",
      });
    }

    const isExistingData = await userModel.findOne({ email });
    if (isExistingData) {
      return res.status(400).json({
        message: "This Email Already Exist",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      phone,
      password: hashPassword,
      profile_image,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token);

    return res.status(201).json({
      success: true,
      message: "Create SuccessFully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All Field Are Required",
      });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "गलत email या password" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "आपका अकाउंट एक्टिव नहीं है" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "गलत email या password" });
    }

    // // 4. Tokens generate
    // const accessToken = generateAccessToken(user);
    // const refreshToken = generateRefreshToken(user);

    // // 5. Refresh token को httpOnly cookie में डालो (सुरक्षित)
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', // production में true
    //   sameSite: 'strict',
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 दिन
    // });

    const accessToken = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", accessToken);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_image: user.profile_image,
      is_verified: user.is_verified,
      last_login: user.last_login,
    };

    user.last_login = new Date();
    await user.save();
    return res.status(200).json({
      message: "लॉगिन सफल",
      accessToken,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

module.exports = { register, login };
