const jwt = require('jsonwebtoken');
const envConfig = require('../config/envConfig');

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    envConfig.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    envConfig.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
};