const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

/**
 * protect — Verify JWT and attach user to req.user
 * Reads token from:
 *   1. Authorization: Bearer <token>  (header)
 *   2. req.cookies.accessToken        (cookie fallback)
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Fallback: cookie
    else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided. Please log in.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET);

    // Fetch fresh user data (check if still active)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists.",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact the administrator.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token has expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
    }
    return res.status(500).json({ success: false, message: "Authentication error.", error: error.message });
  }
};

/**
 * optionalAuth — Attach user if token present, but do not block if absent.
 * Useful for routes that are public but can have richer responses for logged-in users.
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user && user.status === "active") {
        req.user = user;
      }
    }
    next();
  } catch {
    // Token invalid — treat as unauthenticated
    next();
  }
};

module.exports = { protect, optionalAuth };
