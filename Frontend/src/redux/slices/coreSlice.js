import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collegeService,
  branchService,
  departmentService,
  batchService,
  userService,
  studentService,
  facultyService,
  hodService,
  announcementService,
  notificationService,
  attendanceService,
  certificateService,
  activityLogService,
  queryService,
  adminService,
} from "@/services/core.service";
import { toast } from "sonner";

// ─── Helper — generic CRUD thunk factory ──────────────────────────────────────
// Avoids boilerplate for every resource.
const makeListThunk = (name, serviceCall) =>
  createAsyncThunk(name, async (params, { rejectWithValue }) => {
    try {
      const data = await serviceCall(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || `Failed to fetch ${name}`);
    }
  });

const makeCreateThunk = (name, serviceCall, successMsg) =>
  createAsyncThunk(name, async (payload, { rejectWithValue }) => {
    try {
      const data = await serviceCall(payload);
      toast.success(successMsg || "Created successfully");
      return data.data;
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Operation failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  });

const makeUpdateThunk = (name, serviceCall) =>
  createAsyncThunk(name, async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await serviceCall(id, data);
      toast.success("Updated successfully");
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  });

const makeDeleteThunk = (name, serviceCall) =>
  createAsyncThunk(name, async (id, { rejectWithValue }) => {
    try {
      await serviceCall(id);
      toast.success("Deleted successfully");
      return id;
    } catch (error) {
      const msg = error.response?.data?.message || "Delete failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  });

// ─── Colleges ────────────────────────────────────────────────────────────────
export const fetchColleges = makeListThunk("colleges/fetchAll", collegeService.getAll);
export const createCollege = makeCreateThunk("colleges/create", collegeService.create, "College created");
export const updateCollege = makeUpdateThunk("colleges/update", collegeService.update);
export const deleteCollege = makeDeleteThunk("colleges/delete", collegeService.remove);

// ─── Branches ────────────────────────────────────────────────────────────────
export const fetchBranches = makeListThunk("branches/fetchAll", branchService.getAll);
export const createBranch = makeCreateThunk("branches/create", branchService.create, "Branch created");
export const updateBranch = makeUpdateThunk("branches/update", branchService.update);
export const deleteBranch = makeDeleteThunk("branches/delete", branchService.remove);

// ─── Departments ─────────────────────────────────────────────────────────────
export const fetchDepartments = makeListThunk("departments/fetchAll", departmentService.getAll);
export const createDepartment = makeCreateThunk("departments/create", departmentService.create, "Department created");
export const updateDepartment = makeUpdateThunk("departments/update", departmentService.update);
export const deleteDepartment = makeDeleteThunk("departments/delete", departmentService.remove);

// ─── Batches ─────────────────────────────────────────────────────────────────
export const fetchBatches = makeListThunk("batches/fetchAll", batchService.getAll);
export const createBatch = makeCreateThunk("batches/create", batchService.create, "Batch created");
export const updateBatch = makeUpdateThunk("batches/update", batchService.update);
export const deleteBatch = makeDeleteThunk("batches/delete", batchService.remove);

// ─── Users ───────────────────────────────────────────────────────────────────
export const fetchUsers = makeListThunk("users/fetchAll", userService.getAll);
export const fetchMe = createAsyncThunk("users/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const data = await userService.getMe();
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
  }
});
export const updateUser = makeUpdateThunk("users/update", userService.update);

// ─── Students ────────────────────────────────────────────────────────────────
export const fetchStudents = makeListThunk("students/fetchAll", studentService.getAll);
export const fetchStudentMe = createAsyncThunk("students/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const data = await studentService.getMe();
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch student profile");
  }
});
export const createStudent = makeCreateThunk("students/create", studentService.create, "Student created");
export const updateStudent = makeUpdateThunk("students/update", studentService.update);
export const deleteStudent = makeDeleteThunk("students/delete", studentService.remove);

// ─── Faculty ─────────────────────────────────────────────────────────────────
export const fetchFaculty = makeListThunk("faculty/fetchAll", facultyService.getAll);
export const createFaculty = makeCreateThunk("faculty/create", facultyService.create, "Faculty created");
export const updateFaculty = makeUpdateThunk("faculty/update", facultyService.update);
export const deleteFaculty = makeDeleteThunk("faculty/delete", facultyService.remove);

// ─── HODs ────────────────────────────────────────────────────────────────────
export const fetchHods = makeListThunk("hods/fetchAll", hodService.getAll);
export const createHod = makeCreateThunk("hods/create", hodService.create, "HOD created");
export const updateHod = makeUpdateThunk("hods/update", hodService.update);
export const deleteHod = makeDeleteThunk("hods/delete", hodService.remove);

// ─── Admins ──────────────────────────────────────────────────────────────────
export const fetchAdmins = makeListThunk("admins/fetchAll", adminService.getAll);
export const createAdmin = makeCreateThunk("admins/create", adminService.create, "Admin created");
export const updateAdmin = makeUpdateThunk("admins/update", adminService.update);
export const deleteAdmin = makeDeleteThunk("admins/delete", adminService.remove);

// ─── Announcements ───────────────────────────────────────────────────────────
export const fetchAnnouncements = makeListThunk("announcements/fetchAll", announcementService.getAll);
export const createAnnouncement = makeCreateThunk("announcements/create", announcementService.create, "Announcement created");
export const updateAnnouncement = makeUpdateThunk("announcements/update", announcementService.update);
export const deleteAnnouncement = makeDeleteThunk("announcements/delete", announcementService.remove);

// ─── Notifications ───────────────────────────────────────────────────────────
export const fetchNotifications = makeListThunk("notifications/fetchAll", notificationService.getAll);

// ─── Attendance ──────────────────────────────────────────────────────────────
export const fetchAttendance = makeListThunk("attendance/fetchAll", attendanceService.getAll);
export const createAttendance = makeCreateThunk("attendance/create", attendanceService.create, "Attendance recorded");

// ─── Certificates ────────────────────────────────────────────────────────────
export const fetchCertificates = makeListThunk("certificates/fetchAll", certificateService.getAll);
export const createCertificate = makeCreateThunk("certificates/create", certificateService.create, "Certificate issued");
export const deleteCertificate = makeDeleteThunk("certificates/delete", certificateService.remove);

// ─── Activity Logs ───────────────────────────────────────────────────────────
export const fetchActivityLogs = makeListThunk("activityLogs/fetchAll", activityLogService.getAll);

// ─── Queries ─────────────────────────────────────────────────────────────────
export const fetchQueries = makeListThunk("queries/fetchAll", queryService.getAll);
export const createQuery = makeCreateThunk("queries/create", queryService.create, "Query submitted");

// ─── Helper — generic list reducer builder ──────────────────────────────────
const listReducer = (fieldName, fetchThunk, createThunk, updateThunk, deleteThunk) =>
  (builder) => {
    builder
      .addCase(fetchThunk.pending, (state) => { state[fieldName].isLoading = true; state[fieldName].error = null; })
      .addCase(fetchThunk.fulfilled, (state, action) => {
        state[fieldName].isLoading = false;
        state[fieldName].list = action.payload?.data || [];
        state[fieldName].total = action.payload?.total || 0;
      })
      .addCase(fetchThunk.rejected, (state, action) => {
        state[fieldName].isLoading = false;
        state[fieldName].error = action.payload;
      });

    if (createThunk) {
      builder.addCase(createThunk.fulfilled, (state, action) => {
        if (action.payload) state[fieldName].list.unshift(action.payload);
      });
    }
    if (updateThunk) {
      builder.addCase(updateThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state[fieldName].list.findIndex((i) => i._id === action.payload._id);
          if (idx !== -1) state[fieldName].list[idx] = action.payload;
        }
      });
    }
    if (deleteThunk) {
      builder.addCase(deleteThunk.fulfilled, (state, action) => {
        state[fieldName].list = state[fieldName].list.filter((i) => i._id !== action.payload);
      });
    }
  };

const makeResourceState = () => ({ list: [], total: 0, isLoading: false, error: null });

// ─── Slice ─────────────────────────────────────────────────────────────────────
const coreSlice = createSlice({
  name: "core",
  initialState: {
    colleges:      makeResourceState(),
    branches:      makeResourceState(),
    departments:   makeResourceState(),
    batches:       makeResourceState(),
    users:         makeResourceState(),
    studentProfile: null,
    students:      makeResourceState(),
    faculty:       makeResourceState(),
    hods:          makeResourceState(),
    admins:        makeResourceState(),
    announcements: makeResourceState(),
    notifications: makeResourceState(),
    attendance:    makeResourceState(),
    certificates:  makeResourceState(),
    activityLogs:  makeResourceState(),
    queries:       makeResourceState(),
  },
  reducers: {},
  extraReducers: (builder) => {
    // Colleges
    listReducer("colleges", fetchColleges, createCollege, updateCollege, deleteCollege)(builder);
    // Branches
    listReducer("branches", fetchBranches, createBranch, updateBranch, deleteBranch)(builder);
    // Departments
    listReducer("departments", fetchDepartments, createDepartment, updateDepartment, deleteDepartment)(builder);
    // Batches
    listReducer("batches", fetchBatches, createBatch, updateBatch, deleteBatch)(builder);
    // Users
    listReducer("users", fetchUsers, null, updateUser, null)(builder);
    // Students
    listReducer("students", fetchStudents, createStudent, updateStudent, deleteStudent)(builder);
    builder
      .addCase(fetchStudentMe.fulfilled, (state, action) => {
        state.studentProfile = action.payload;
      });
    // Faculty
    listReducer("faculty", fetchFaculty, createFaculty, updateFaculty, deleteFaculty)(builder);
    // HODs
    listReducer("hods", fetchHods, createHod, updateHod, deleteHod)(builder);
    // Admins
    listReducer("admins", fetchAdmins, createAdmin, updateAdmin, deleteAdmin)(builder);
    // Announcements
    listReducer("announcements", fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement)(builder);
    // Notifications
    listReducer("notifications", fetchNotifications, null, null, null)(builder);
    // Attendance
    listReducer("attendance", fetchAttendance, createAttendance, null, null)(builder);
    // Certificates
    listReducer("certificates", fetchCertificates, createCertificate, null, deleteCertificate)(builder);
    // Activity Logs
    listReducer("activityLogs", fetchActivityLogs, null, null, null)(builder);
    // Queries
    listReducer("queries", fetchQueries, createQuery, null, null)(builder);
  },
});

// ─── Selectors ─────────────────────────────────────────────────────────────────
export const selectColleges      = (state) => state.core.colleges;
export const selectBranches      = (state) => state.core.branches;
export const selectDepartments   = (state) => state.core.departments;
export const selectBatches       = (state) => state.core.batches;
export const selectUsers         = (state) => state.core.users;
export const selectStudents      = (state) => state.core.students;
export const selectStudentProfile = (state) => state.core.studentProfile;
export const selectFaculty       = (state) => state.core.faculty;
export const selectHods          = (state) => state.core.hods;
export const selectAdmins        = (state) => state.core.admins;
export const selectAnnouncements = (state) => state.core.announcements;
export const selectNotifications = (state) => state.core.notifications;
export const selectAttendance    = (state) => state.core.attendance;
export const selectCertificates  = (state) => state.core.certificates;
export const selectActivityLogs  = (state) => state.core.activityLogs;
export const selectQueries       = (state) => state.core.queries;

export default coreSlice.reducer;
