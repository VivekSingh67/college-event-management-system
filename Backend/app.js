const express = require("express");
const app = express();
const path = require("path");
const db = require("./config/db");
db();
const cookieParser = require("cookie-parser");

// ─── Core Middleware ───────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(cookieParser());

// ─── Route Imports ─────────────────────────────────────────
const authRouter              = require("./routes/auth.routes");
const collegeRoutes           = require("./routes/college.routes");
const branchRoutes            = require("./routes/branch.routes");
const userRoutes              = require("./routes/user.routes");
const adminRoutes             = require("./routes/admin.routes");
const studentRoutes           = require("./routes/student.routes");
const facultyRoutes           = require("./routes/faculty.routes");
const hodRoutes               = require("./routes/hod.routes");
const departmentRoutes        = require("./routes/department.routes");
const batchRoutes             = require("./routes/batch.routes");
const eventRoutes             = require("./routes/event.routes");
const eventApprovalRoutes     = require("./routes/eventApproval.routes");
const attendanceRoutes        = require("./routes/attendance.routes");
const eventCategoryRoutes     = require("./routes/eventCategory.routes");
const eventRegistrationRoutes = require("./routes/eventRegistration.routes");
const eventVenueRoutes        = require("./routes/eventVenue.routes");
const announcementRoutes      = require("./routes/announcement.routes");
const certificateRoutes       = require("./routes/certificate.routes");
const notificationRoutes      = require("./routes/notification.routes");
const queryRoutes             = require("./routes/query.routes");
const queryReplyRoutes        = require("./routes/queryReply.routes");
const activityLogRoutes       = require("./routes/activityLog.routes");

// ─── Error / 404 Middleware Imports ───────────────────────
const { notFound, errorHandler } = require("./middlewares/error.middleware");

// ─── Auth Routes ───────────────────────────────────────────
app.use("/auth", authRouter);

// ─── API Routes ────────────────────────────────────────────
app.use("/api/colleges",             collegeRoutes);
app.use("/api/branches",             branchRoutes);
app.use("/api/users",                userRoutes);
app.use("/api/admins",               adminRoutes);
app.use("/api/students",             studentRoutes);
app.use("/api/faculty",              facultyRoutes);
app.use("/api/hods",                 hodRoutes);
app.use("/api/departments",          departmentRoutes);
app.use("/api/batches",              batchRoutes);
app.use("/api/events",               eventRoutes);
app.use("/api/event-approvals",      eventApprovalRoutes);
app.use("/api/attendance",           attendanceRoutes);
app.use("/api/event-categories",     eventCategoryRoutes);
app.use("/api/event-registrations",  eventRegistrationRoutes);
app.use("/api/event-venues",         eventVenueRoutes);
app.use("/api/announcements",        announcementRoutes);
app.use("/api/certificates",         certificateRoutes);
app.use("/api/notifications",        notificationRoutes);
app.use("/api/queries",              queryRoutes);
app.use("/api/query-replies",        queryReplyRoutes);
app.use("/api/activity-logs",        activityLogRoutes);

// ─── 404 Handler (unknown routes) ──────────────────────────
app.use(notFound);

// ─── Centralized Error Handler ─────────────────────────────
// Must be LAST — catches all next(err) from routes/middleware
app.use(errorHandler);

module.exports = app;
