/**
 * Validation Middleware for CEMS
 *
 * Provides field-level validation for each model before it reaches the controller.
 * Returns 422 with an array of {field, message} on failure.
 *
 * Usage in routes:
 *   router.post("/", protect, validate("event"), createEvent);
 */

const isValidObjectId = (v) => /^[a-f\d]{24}$/i.test(v);
const isValidEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone    = (v) => /^\d{10}$/.test(v);

const validate = (schemaName) => {
  return (req, res, next) => {
    const errors = [];
    const body = req.body;

    switch (schemaName) {
      case "user": {
        if (!body.name || !body.name.trim()) errors.push({ field: "name", message: "name is required" });
        if (!body.email || !isValidEmail(body.email)) errors.push({ field: "email", message: "A valid email is required" });
        if (!body.phone || !isValidPhone(body.phone)) errors.push({ field: "phone", message: "A valid 10-digit phone is required" });
        if (!body.password || body.password.length < 6) errors.push({ field: "password", message: "password must be at least 6 characters" });
        if (body.role) {
          const validRoles = ["super_admin", "admin", "hod", "coordinator", "faculty", "student"];
          if (!validRoles.includes(body.role)) errors.push({ field: "role", message: `role must be one of: ${validRoles.join(", ")}` });
        }
        break;
      }
      case "register": {
        if (!body.name || !body.name.trim()) errors.push({ field: "name", message: "name is required" });
        if (!body.email || !isValidEmail(body.email)) errors.push({ field: "email", message: "A valid email is required" });
        if (!body.phone || !isValidPhone(body.phone)) errors.push({ field: "phone", message: "A valid 10-digit phone is required" });
        if (!body.password || body.password.length < 6) errors.push({ field: "password", message: "password must be at least 6 characters" });
        break;
      }
      case "login": {
        if (!body.email || !isValidEmail(body.email)) errors.push({ field: "email", message: "A valid email is required" });
        if (!body.password) errors.push({ field: "password", message: "password is required" });
        break;
      }
      case "college": {
        if (!body.name || !body.name.trim()) errors.push({ field: "name", message: "college name is required" });
        if (!body.short_name || !body.short_name.trim()) errors.push({ field: "short_name", message: "short_name is required" });
        break;
      }
      case "branch": {
        if (!body.college_id || !isValidObjectId(body.college_id)) errors.push({ field: "college_id", message: "A valid college_id (ObjectId) is required" });
        if (!body.branch_name || !body.branch_name.trim()) errors.push({ field: "branch_name", message: "branch_name is required" });
        if (!body.branch_code || !body.branch_code.trim()) errors.push({ field: "branch_code", message: "branch_code is required" });
        break;
      }
      case "department": {
        if (!body.branch_id || !isValidObjectId(body.branch_id)) errors.push({ field: "branch_id", message: "A valid branch_id is required" });
        if (!body.department_name || !body.department_name.trim()) errors.push({ field: "department_name", message: "department_name is required" });
        if (!body.department_code || !body.department_code.trim()) errors.push({ field: "department_code", message: "department_code is required" });
        break;
      }
      case "batch": {
        if (!body.branch_id || !isValidObjectId(body.branch_id)) errors.push({ field: "branch_id", message: "A valid branch_id is required" });
        if (!body.department_id || !isValidObjectId(body.department_id)) errors.push({ field: "department_id", message: "A valid department_id is required" });
        if (!body.batch_name || !body.batch_name.trim()) errors.push({ field: "batch_name", message: "batch_name is required" });
        if (!body.start_year || isNaN(body.start_year)) errors.push({ field: "start_year", message: "start_year (number) is required" });
        if (!body.end_year || isNaN(body.end_year)) errors.push({ field: "end_year", message: "end_year (number) is required" });
        break;
      }
      case "student": {
        ["user_id", "branch_id", "department_id", "batch_id"].forEach((ref) => {
          if (!body[ref] || !isValidObjectId(body[ref])) errors.push({ field: ref, message: `A valid ${ref} (ObjectId) is required` });
        });
        if (!body.enrollment_no || !body.enrollment_no.trim()) errors.push({ field: "enrollment_no", message: "enrollment_no is required" });
        if (!body.semester || isNaN(body.semester)) errors.push({ field: "semester", message: "semester (number) is required" });
        break;
      }
      case "faculty": {
        ["user_id", "branch_id", "department_id"].forEach((ref) => {
          if (!body[ref] || !isValidObjectId(body[ref])) errors.push({ field: ref, message: `A valid ${ref} (ObjectId) is required` });
        });
        if (!body.employee_id || !body.employee_id.trim()) errors.push({ field: "employee_id", message: "employee_id is required" });
        if (!body.joining_date) errors.push({ field: "joining_date", message: "joining_date is required" });
        break;
      }
      case "hod": {
        ["user_id", "branch_id", "department_id"].forEach((ref) => {
          if (!body[ref] || !isValidObjectId(body[ref])) errors.push({ field: ref, message: `A valid ${ref} (ObjectId) is required` });
        });
        if (!body.employee_id || !body.employee_id.trim()) errors.push({ field: "employee_id", message: "employee_id is required" });
        if (!body.joining_date) errors.push({ field: "joining_date", message: "joining_date is required" });
        break;
      }
      case "admin": {
        ["user_id", "college_id", "branch_id"].forEach((ref) => {
          if (!body[ref] || !isValidObjectId(body[ref])) errors.push({ field: ref, message: `A valid ${ref} (ObjectId) is required` });
        });
        if (!body.employee_id || !body.employee_id.trim()) errors.push({ field: "employee_id", message: "employee_id is required" });
        if (!body.joining_date) errors.push({ field: "joining_date", message: "joining_date is required" });
        break;
      }
      case "event": {
        if (!body.branch_id || !isValidObjectId(body.branch_id)) errors.push({ field: "branch_id", message: "A valid branch_id is required" });
        if (!body.event_title || !body.event_title.trim()) errors.push({ field: "event_title", message: "event_title is required" });
        if (!body.event_type) {
          errors.push({ field: "event_type", message: "event_type is required" });
        } else {
          const validTypes = ["Sports", "Technical", "Cultural", "Workshop", "Seminar"];
          if (!validTypes.includes(body.event_type)) errors.push({ field: "event_type", message: `event_type must be one of: ${validTypes.join(", ")}` });
        }
        if (!body.event_date) errors.push({ field: "event_date", message: "event_date is required" });
        if (!body.created_by || !isValidObjectId(body.created_by)) errors.push({ field: "created_by", message: "A valid created_by (ObjectId) is required" });
        if (!body.created_by_role) {
          errors.push({ field: "created_by_role", message: "created_by_role is required" });
        } else {
          if (!["admin", "hod", "faculty"].includes(body.created_by_role)) errors.push({ field: "created_by_role", message: "created_by_role must be admin, hod, or faculty" });
        }
        break;
      }
      case "eventRegistration": {
        if (!body.event_id || !isValidObjectId(body.event_id)) errors.push({ field: "event_id", message: "A valid event_id is required" });
        if (!body.student_id || !isValidObjectId(body.student_id)) errors.push({ field: "student_id", message: "A valid student_id is required" });
        break;
      }
      case "eventApproval": {
        if (!body.event_id || !isValidObjectId(body.event_id)) errors.push({ field: "event_id", message: "A valid event_id is required" });
        if (!body.approved_by || !isValidObjectId(body.approved_by)) errors.push({ field: "approved_by", message: "A valid approved_by is required" });
        if (!body.approver_role) errors.push({ field: "approver_role", message: "approver_role is required" });
        break;
      }
      case "eventVenue": {
        if (!body.branch_id || !isValidObjectId(body.branch_id)) errors.push({ field: "branch_id", message: "A valid branch_id is required" });
        if (!body.venue_name || !body.venue_name.trim()) errors.push({ field: "venue_name", message: "venue_name is required" });
        break;
      }
      case "announcement": {
        if (!body.title || !body.title.trim()) errors.push({ field: "title", message: "title is required" });
        if (!body.message || !body.message.trim()) errors.push({ field: "message", message: "message is required" });
        if (!body.branch_id || !isValidObjectId(body.branch_id)) errors.push({ field: "branch_id", message: "A valid branch_id is required" });
        if (!body.publish_date) errors.push({ field: "publish_date", message: "publish_date is required" });
        if (!body.created_by || !isValidObjectId(body.created_by)) errors.push({ field: "created_by", message: "A valid created_by is required" });
        if (!body.created_by_role) errors.push({ field: "created_by_role", message: "created_by_role is required" });
        break;
      }
      case "certificate": {
        if (!body.event_id || !isValidObjectId(body.event_id)) errors.push({ field: "event_id", message: "A valid event_id is required" });
        if (!body.student_id || !isValidObjectId(body.student_id)) errors.push({ field: "student_id", message: "A valid student_id is required" });
        if (!body.certificate_title || !body.certificate_title.trim()) errors.push({ field: "certificate_title", message: "certificate_title is required" });
        if (!body.issued_by || !isValidObjectId(body.issued_by)) errors.push({ field: "issued_by", message: "A valid issued_by is required" });
        break;
      }
      case "notification": {
        if (!body.user_id || !isValidObjectId(body.user_id)) errors.push({ field: "user_id", message: "A valid user_id is required" });
        if (!body.title || !body.title.trim()) errors.push({ field: "title", message: "title is required" });
        if (!body.message || !body.message.trim()) errors.push({ field: "message", message: "message is required" });
        break;
      }
      case "query": {
        if (!body.student_id || !isValidObjectId(body.student_id)) errors.push({ field: "student_id", message: "A valid student_id is required" });
        if (!body.subject || !body.subject.trim()) errors.push({ field: "subject", message: "subject is required" });
        if (!body.message || !body.message.trim()) errors.push({ field: "message", message: "message is required" });
        break;
      }
      case "queryReply": {
        if (!body.query_id || !isValidObjectId(body.query_id)) errors.push({ field: "query_id", message: "A valid query_id is required" });
        if (!body.replied_by || !isValidObjectId(body.replied_by)) errors.push({ field: "replied_by", message: "A valid replied_by is required" });
        if (!body.message || !body.message.trim()) errors.push({ field: "message", message: "message is required" });
        break;
      }
      case "activityLog": {
        if (!body.user_id || !isValidObjectId(body.user_id)) errors.push({ field: "user_id", message: "A valid user_id is required" });
        if (!body.action || !body.action.trim()) errors.push({ field: "action", message: "action is required" });
        if (!body.module || !body.module.trim()) errors.push({ field: "module", message: "module is required" });
        break;
      }
      default:
        break;
    }

    if (errors.length > 0) {
      return res.status(422).json({ success: false, message: "Validation failed", errors });
    }
    next();
  };
};

module.exports = { validate };
