/**
 * api-test.js — Comprehensive CEMS API Test Suite
 * Tests all endpoints with real data. Reports PASS/FAIL for each.
 */

const BASE = "http://localhost:3000";

async function req(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  try {
    const resp = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await resp.json().catch(() => ({}));
    return { status: resp.status, data };
  } catch (e) {
    return { status: 0, data: { message: e.message } };
  }
}

const IDs = {}; // store created IDs for chaining
let TOKEN = "";

async function run() {
  let pass = 0, fail = 0;

  function log(label, status, expected, data) {
    const ok = expected.includes(status);
    if (ok) { pass++; console.log(`  PASS  [${status}] ${label}`); }
    else     { 
      fail++; 
      console.error(`  FAIL  [${status}] ${label}`);
      console.error(`        Error Data: ${JSON.stringify(data, null, 2)}`);
    }
    return ok;
  }

  // ─── 1. Auth ────────────────────────────────────────────────────────────────
  console.log("\n═══ 1. AUTH ═══");

  // Login as super_admin
  { const r = await req("POST", "/auth/login", { email: "superadmin@cems.test", password: "Admin@12345" });
    if (log("Login as super_admin", r.status, [200], r.data)) TOKEN = r.data.accessToken; }

  // Login with wrong password
  { const r = await req("POST", "/auth/login", { email: "superadmin@cems.test", password: "wrongpass" });
    log("Login wrong password → 401", r.status, [401], r.data); }

  // Register student
  { const r = await req("POST", "/auth/register", { name: "Test Student", email: `stu${Date.now()}@test.com`, phone: `9${Date.now().toString().slice(4)}`, password: "pass123" });
    log("Register new student → 201", r.status, [201], r.data); }

  // Login no token — protected route
  { const r = await req("GET", "/api/users/me");
    log("Protected route without token → 401", r.status, [401], r.data); }

  // ─── 2. Colleges ────────────────────────────────────────────────────────────
  console.log("\n═══ 2. COLLEGES ═══");
  const collegeBody = { 
    name: `Test College ${Date.now()}`, 
    short_name: "TC",
    email: `college${Date.now()}@test.com`,
    phone: "1234567890",
    city: "Test City",
    state: "Test State"
  };
  { const r = await req("POST", "/api/colleges", collegeBody, TOKEN);
    if (log("Create college → 201", r.status, [201], r.data)) IDs.college = r.data.data?._id; }
  { const r = await req("GET", "/api/colleges", null, TOKEN);
    log("Get all colleges → 200", r.status, [200], r.data); }
  if (IDs.college) {
    { const r = await req("GET", `/api/colleges/${IDs.college}`, null, TOKEN);
      log("Get college by ID → 200", r.status, [200], r.data); }
    { const r = await req("PUT", `/api/colleges/${IDs.college}`, { name: `Updated College ${Date.now()}` }, TOKEN);
      log("Update college → 200", r.status, [200], r.data); }
  }

  // ─── 3. Branches ────────────────────────────────────────────────────────────
  console.log("\n═══ 3. BRANCHES ═══");
  { const r = await req("POST", "/api/branches", { college_id: IDs.college, branch_name: `CS Department ${Date.now()}`, branch_code: `CS${Date.now().toString().slice(-4)}` }, TOKEN);
    if (log("Create branch → 201", r.status, [201], r.data)) IDs.branch = r.data.data?._id; }
  { const r = await req("GET", "/api/branches", null, TOKEN);
    log("Get all branches → 200", r.status, [200], r.data); }

  // ─── 4. Departments ─────────────────────────────────────────────────────────
  console.log("\n═══ 4. DEPARTMENTS ═══");
  { const r = await req("POST", "/api/departments", { branch_id: IDs.branch, department_name: `Software Eng ${Date.now()}`, department_code: `SE${Date.now().toString().slice(-4)}` }, TOKEN);
    if (log("Create department → 201", r.status, [201], r.data)) IDs.department = r.data.data?._id; }
  { const r = await req("GET", "/api/departments", null, TOKEN);
    log("Get all departments → 200", r.status, [200], r.data); }

  // ─── 5. Batches ─────────────────────────────────────────────────────────────
  console.log("\n═══ 5. BATCHES ═══");
  { const r = await req("POST", "/api/batches", { branch_id: IDs.branch, department_id: IDs.department, batch_name: "2024-2028", start_year: 2024, end_year: 2028 }, TOKEN);
    if (log("Create batch → 201", r.status, [201], r.data)) IDs.batch = r.data.data?._id; }
  { const r = await req("GET", "/api/batches", null, TOKEN);
    log("Get all batches → 200", r.status, [200], r.data); }

  // ─── 6. Users ───────────────────────────────────────────────────────────────
  console.log("\n═══ 6. USERS ═══");
  { const r = await req("GET", "/api/users/me", null, TOKEN);
    log("Get /me → 200", r.status, [200], r.data); }
  { const r = await req("GET", "/api/users", null, TOKEN);
    log("Get all users → 200", r.status, [200], r.data); }

  // ─── 7. Admins ──────────────────────────────────────────────────────────────
  console.log("\n═══ 7. ADMINS ═══");
  const adminBody = {
    name: "Test Admin", email: `adm${Date.now()}@cems.test`, phone: `8${Date.now().toString().slice(4)}`,
    password: "Admin@12345", college_id: IDs.college, branch_id: IDs.branch,
    employee_id: `EMP-A-${Date.now()}`, designation: "Branch Admin", joining_date: "2024-01-01",
  };
  { const r = await req("POST", "/api/admins", adminBody, TOKEN);
    if (log("Create admin (dual-collection) → 201", r.status, [201], r.data)) IDs.admin = r.data.data?.admin?._id; }
  { const r = await req("GET", "/api/admins", null, TOKEN);
    log("Get all admins → 200", r.status, [200], r.data); }
  if (IDs.admin) {
    { const r = await req("GET", `/api/admins/${IDs.admin}`, null, TOKEN);
      log("Get admin by ID → 200", r.status, [200], r.data); }
    { const r = await req("PUT", `/api/admins/${IDs.admin}`, { designation: "Senior Admin" }, TOKEN);
      log("Update admin → 200", r.status, [200], r.data); }
  }

  // ─── 8. HODs ────────────────────────────────────────────────────────────────
  console.log("\n═══ 8. HODs ═══");
  const hodBody = {
    name: "Test HOD", email: `hod${Date.now()}@cems.test`, phone: `7${Date.now().toString().slice(4)}`,
    password: "Hod@12345", branch_id: IDs.branch, department_id: IDs.department,
    employee_id: `EMP-H-${Date.now()}`, qualification: "PhD", joining_date: "2024-01-01",
  };
  { const r = await req("POST", "/api/hods", hodBody, TOKEN);
    if (log("Create HOD (dual-collection) → 201", r.status, [201], r.data)) IDs.hod = r.data.data?.hod?._id; }
  { const r = await req("GET", "/api/hods", null, TOKEN);
    log("Get all HODs → 200", r.status, [200], r.data); }

  // ─── 9. Students ────────────────────────────────────────────────────────────
  console.log("\n═══ 9. STUDENTS ═══");
  const studentBody = {
    name: "Test Student API", email: `std${Date.now()}@cems.test`, phone: `6${Date.now().toString().slice(4)}`,
    password: "Std@12345", branch_id: IDs.branch, department_id: IDs.department,
    batch_id: IDs.batch, enrollment_no: `EN${Date.now()}`, semester: 1, year: "1st Year", gender: "male",
  };
  { const r = await req("POST", "/api/students", studentBody, TOKEN);
    if (log("Create student (dual-collection) → 201", r.status, [201], r.data)) IDs.student = r.data.data?.student?._id; }
  { const r = await req("GET", "/api/students", null, TOKEN);
    log("Get all students → 200", r.status, [200], r.data); }
  if (IDs.student) {
    { const r = await req("GET", `/api/students/${IDs.student}`, null, TOKEN);
      log("Get student by ID → 200", r.status, [200], r.data); }
    { const r = await req("PUT", `/api/students/${IDs.student}`, { semester: 2 }, TOKEN);
      log("Update student → 200", r.status, [200], r.data); }
  }

  // ─── 10. Faculty ────────────────────────────────────────────────────────────
  console.log("\n═══ 10. FACULTY ═══");
  const facultyBody = {
    name: "Test Faculty", email: `fac${Date.now()}@cems.test`, phone: `5${Date.now().toString().slice(4)}`,
    password: "Fac@12345", branch_id: IDs.branch, department_id: IDs.department,
    employee_id: `EMP-F-${Date.now()}`, designation: "Assistant Professor", joining_date: "2024-01-01",
  };
  { const r = await req("POST", "/api/faculty", facultyBody, TOKEN);
    if (log("Create faculty (dual-collection) → 201", r.status, [201], r.data)) IDs.faculty = r.data.data?.faculty?._id; }
  { const r = await req("GET", "/api/faculty", null, TOKEN);
    log("Get all faculty → 200", r.status, [200], r.data); }

  // ─── 11. Events ─────────────────────────────────────────────────────────────
  console.log("\n═══ 11. EVENTS ═══");
  const meResp = await req("GET", "/api/users/me", null, TOKEN);
  const userId = meResp.data?.data?._id;
  const eventBody = {
    branch_id: IDs.branch, event_title: "Tech Fest 2025", event_type: "Technical",
    event_date: "2025-06-15", created_by: userId, created_by_role: "admin",
    description: "Annual technical festival",
  };
  { const r = await req("POST", "/api/events", eventBody, TOKEN);
    if (log("Create event → 201", r.status, [201], r.data)) IDs.event = r.data.data?._id; }
  { const r = await req("GET", "/api/events", null, TOKEN);
    log("Get all events → 200", r.status, [200], r.data); }
  if (IDs.event) {
    { const r = await req("GET", `/api/events/${IDs.event}`, null, TOKEN);
      log("Get event by ID → 200", r.status, [200], r.data); }
    { const r = await req("PUT", `/api/events/${IDs.event}`, { event_title: "Tech Fest 2025 Updated" }, TOKEN);
      log("Update event → 200", r.status, [200], r.data); }
  }

  // ─── 12. Event Categories ───────────────────────────────────────────────────
  console.log("\n═══ 12. EVENT CATEGORIES ═══");
  { const r = await req("POST", "/api/event-categories", { name: `Hackathon ${Date.now()}`, description: "Coding competition", created_by: userId }, TOKEN);
    if (log("Create event category → 201", r.status, [201], r.data)) IDs.eventCategory = r.data.data?._id; }
  { const r = await req("GET", "/api/event-categories", null, TOKEN);
    log("Get all event categories → 200", r.status, [200], r.data); }

  // ─── 13. Event Venues ────────────────────────────────────────────────────────
  console.log("\n═══ 13. EVENT VENUES ═══");
  { const r = await req("POST", "/api/event-venues", { branch_id: IDs.branch, venue_name: "Main Auditorium", capacity: 500 }, TOKEN);
    if (log("Create event venue → 201", r.status, [201], r.data)) IDs.venue = r.data.data?._id; }
  { const r = await req("GET", "/api/event-venues", null, TOKEN);
    log("Get all venues → 200", r.status, [200], r.data); }

  // ─── 14. Announcements ───────────────────────────────────────────────────────
  console.log("\n═══ 14. ANNOUNCEMENTS ═══");
  { const r = await req("POST", "/api/announcements", {
      title: "Welcome Announcement", message: "Welcome to new semester",
      branch_id: IDs.branch, publish_date: "2025-06-01", created_by: userId, created_by_role: "admin",
    }, TOKEN);
    if (log("Create announcement → 201", r.status, [201], r.data)) IDs.announcement = r.data.data?._id; }
  { const r = await req("GET", "/api/announcements", null, TOKEN);
    log("Get all announcements → 200", r.status, [200], r.data); }

  // ─── 15. Notifications ───────────────────────────────────────────────────────
  console.log("\n═══ 15. NOTIFICATIONS ═══");
  { const r = await req("POST", "/api/notifications", { user_id: userId, title: "Test Notif", message: "Hello!" }, TOKEN);
    if (log("Create notification → 201", r.status, [201], r.data)) IDs.notification = r.data.data?._id; }
  { const r = await req("GET", "/api/notifications", null, TOKEN);
    log("Get all notifications → 200", r.status, [200], r.data); }

  // ─── 16. Activity Logs ───────────────────────────────────────────────────────
  console.log("\n═══ 16. ACTIVITY LOGS ═══");
  { const r = await req("POST", "/api/activity-logs", { user_id: userId, action: "LOGIN", module: "AUTH" }, TOKEN);
    log("Create activity log → 201", r.status, [201], r.data); }
  { const r = await req("GET", "/api/activity-logs", null, TOKEN);
    log("Get all activity logs → 200", r.status, [200], r.data); }

  // ─── 17. Delete cleanup ──────────────────────────────────────────────────────
  console.log("\n═══ 17. DELETE CLEANUP ═══");
  if (IDs.event) {
    const r = await req("DELETE", `/api/events/${IDs.event}`, null, TOKEN);
    log("Delete event → 200", r.status, [200], r.data);
  }
  if (IDs.admin) {
    const r = await req("DELETE", `/api/admins/${IDs.admin}`, null, TOKEN);
    log("Delete admin + linked user → 200", r.status, [200], r.data);
  }
  if (IDs.hod) {
    const r = await req("DELETE", `/api/hods/${IDs.hod}`, null, TOKEN);
    log("Delete HOD + linked user → 200", r.status, [200], r.data);
  }
  if (IDs.student) {
    const r = await req("DELETE", `/api/students/${IDs.student}`, null, TOKEN);
    log("Delete student + linked user → 200", r.status, [200], r.data);
  }

  // ─── Final Report ────────────────────────────────────────────────────────────
  console.log(`\n${"═".repeat(50)}`);
  console.log(`  TOTAL: ${pass + fail} tests | ✅ PASS: ${pass} | ❌ FAIL: ${fail}`);
  console.log(`${"═".repeat(50)}\n`);
  
  if (fail > 0) process.exit(1);
}

run();
