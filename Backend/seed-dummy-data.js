/**
 * seed-dummy-data.js
 * Automatically populates the CEMS database with a full ecosystem of dummy data
 * for all roles (Admin, HOD, Faculty, Student) using the actual API endpoints.
 */
const BASE_AUTH = "http://localhost:3000/auth";
const BASE_API = "http://localhost:3000/api";

async function checkRes(res, label) {
  const data = await res.json();
  if (!res.ok || !data.success) {
    console.error(`❌ ${label} failed [${res.status}]`);
    console.error(JSON.stringify(data, null, 2));
    throw new Error(`${label} failed`);
  }
  return data;
}

async function run() {
  console.log("🚀 Starting Dummy Data Seeding...");

  const suffix = Date.now();
  
  try {
    // 1. LOGIN AS SUPER_ADMIN
    console.log("\n🔑 Logging in as Super Admin...");
    const loginRes = await fetch(`${BASE_AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "superadmin@cems.test", password: "Admin@12345" })
    });
    const loginData = await checkRes(loginRes, "Login");
    const TOKEN = loginData.accessToken;
    const authHeader = { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json" };

    // 2. CREATE COLLEGE
    console.log("\n🏫 Creating College...");
    const collegeRes = await fetch(`${BASE_API}/colleges`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({
        name: `Dummy University ${suffix}`, short_name: `DU${suffix % 1000}`,
        email: `uni${suffix}@dummy.com`, phone: `9${suffix.toString().slice(-9)}`,
        city: "Test City", state: "Test State"
      })
    });
    const collegeData = await checkRes(collegeRes, "College Creation");
    const college_id = collegeData.data._id;

    // 3. CREATE BRANCH
    console.log("🌲 Creating Branch...");
    const branchRes = await fetch(`${BASE_API}/branches`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({ college_id, branch_name: "Computer Science", branch_code: "CS" + (suffix % 1000) })
    });
    const branchData = await checkRes(branchRes, "Branch Creation");
    const branch_id = branchData.data._id;

    // 4. CREATE DEPARTMENT
    console.log("🏢 Creating Department...");
    const deptRes = await fetch(`${BASE_API}/departments`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({ branch_id, department_name: "Software Engineering", department_code: "SE" + (suffix % 1000) })
    });
    const deptData = await checkRes(deptRes, "Department Creation");
    const department_id = deptData.data._id;

    // 5. CREATE BATCH
    console.log("📅 Creating Batch...");
    const batchRes = await fetch(`${BASE_API}/batches`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({ branch_id, department_id, batch_name: "2024-2028", start_year: 2024, end_year: 2028 })
    });
    const batchData = await checkRes(batchRes, "Batch Creation");
    const batch_id = batchData.data._id;

    // 6. CREATE ADMIN (Dual Storage)
    console.log("\n👤 Creating ADMIN...");
    const adminRes = await fetch(`${BASE_API}/admins`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({
        name: "Demo Admin", email: `admin${suffix}@test.com`, phone: `7${suffix.toString().slice(-9)}`,
        password: "Admin@12345", college_id, branch_id, employee_id: "A1-" + suffix, joining_date: "2024-01-01"
      })
    });
    await checkRes(adminRes, "Admin Creation");

    // 7. CREATE HOD (Dual Storage)
    console.log("👤 Creating HOD...");
    const hodRes = await fetch(`${BASE_API}/hods`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({
        name: "Demo HOD", email: `hod${suffix}@test.com`, phone: `8${suffix.toString().slice(-9)}`,
        password: "Hod@12345", branch_id, department_id, employee_id: "H1-" + suffix, joining_date: "2024-01-01"
      })
    });
    await checkRes(hodRes, "HOD Creation");

    // 8. CREATE FACULTY (Dual Storage)
    console.log("👤 Creating FACULTY...");
    const facRes = await fetch(`${BASE_API}/faculty`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({
        name: "Demo Faculty", email: `fac${suffix}@test.com`, phone: `9${suffix.toString().slice(-9)}`,
        password: "Fac@12345", branch_id, department_id, employee_id: "F1-" + suffix, joining_date: "2024-01-01"
      })
    });
    await checkRes(facRes, "Faculty Creation");

    // 9. CREATE STUDENT (Dual Storage)
    console.log("👤 Creating STUDENT...");
    const stuRes = await fetch(`${BASE_API}/students`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify({
        name: "Demo Student", email: `stu${suffix}@test.com`, phone: `6${suffix.toString().slice(-9)}`,
        password: "Stu@12345", branch_id, department_id, batch_id, enrollment_no: "S1-" + suffix,
        semester: 1, year: "1st Year", gender: "male"
      })
    });
    await checkRes(stuRes, "Student Creation");

  console.log("\n✨ Seeding Complete!");
  } catch (err) {
    console.error("\n❌ Seeding Failed!");
    console.error(err);
    if (err.stack) console.error(err.stack);
  }
}

run().catch(console.error);
