/**
 * Role-Based Access Control (RBAC) Middleware
 *
 * User roles (from User.model.js):
 *   super_admin | admin | hod | coordinator | faculty | student
 *
 * Usage:
 *   router.post("/", protect, authorize("admin", "hod"), createEvent);
 */

/**
 * authorize(...roles) — Allow only specified roles to access the route.
 * Must be used AFTER protect middleware (which sets req.user).
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in first.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): [${roles.join(", ")}]. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

// ─── Convenience shorthand middlewares ───────────────────────────────────────

/** Only super_admin */
const superAdminOnly = authorize("super_admin");

/** Only admin or super_admin */
const adminOnly = authorize("super_admin", "admin");

/** admin, super_admin, or hod */
const adminOrHod = authorize("super_admin", "admin", "hod");

/** admin, super_admin, hod, or coordinator */
const adminOrCoordinator = authorize("super_admin", "admin", "hod", "coordinator");

/** admin, super_admin, hod, coordinator, or faculty — staff members */
const staffOnly = authorize("super_admin", "admin", "hod", "coordinator", "faculty");

/** Only students */
const studentOnly = authorize("student");

module.exports = {
  authorize,
  superAdminOnly,
  adminOnly,
  adminOrHod,
  adminOrCoordinator,
  staffOnly,
  studentOnly,
};
