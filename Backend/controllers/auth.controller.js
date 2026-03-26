const userModel = require("../models/User.model");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { name, email, phone, password, profile_image, role } = req.body;

    const isExistingUser = await userModel.findOne({ email });
    if (isExistingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const isExistingPhone = await userModel.findOne({ phone });
    if (isExistingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await userModel.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      profile_image,
      role: role || "student",
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile_image: user.profile_image,
    };

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      accessToken,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ success: false, message: "Your account is not active" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
      success: true,
      message: "Login successful",
      accessToken,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect old password" });
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, logout, updatePassword };
