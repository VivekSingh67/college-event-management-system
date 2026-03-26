import apiClient from "@/lib/apiClient";

/**
 * College Service — wraps all /api/colleges API calls.
 */
export const collegeService = {
  getAll: async () => {
    const response = await apiClient.get("/api/colleges");
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/colleges/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/colleges", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/colleges/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/colleges/${id}`);
    return response.data;
  },
};

/**
 * Branch Service — wraps all /api/branches API calls.
 */
export const branchService = {
  getAll: async () => {
    const response = await apiClient.get("/api/branches");
    return response.data;
  },
  getByCollege: async (collegeId) => {
    const response = await apiClient.get(`/api/branches/college/${collegeId}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/branches/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/branches", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/branches/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/branches/${id}`);
    return response.data;
  },
};

/**
 * Department Service — wraps all /api/departments API calls.
 */
export const departmentService = {
  getAll: async () => {
    const response = await apiClient.get("/api/departments");
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/departments/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/departments", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/departments/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/departments/${id}`);
    return response.data;
  },
};

/**
 * Batch Service — wraps all /api/batches API calls.
 */
export const batchService = {
  getAll: async () => {
    const response = await apiClient.get("/api/batches");
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/batches/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/batches", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/batches/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/batches/${id}`);
    return response.data;
  },
};

/**
 * User Service — wraps all /api/users API calls.
 */
export const userService = {
  getAll: async () => {
    const response = await apiClient.get("/api/users");
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/api/users/me");
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/users/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/users/${id}`);
    return response.data;
  },
};

/**
 * Student Service — wraps all /api/students API calls.
 */
export const studentService = {
  getAll: async () => {
    const response = await apiClient.get("/api/students");
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/api/students/me");
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/students/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/students", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/students/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/students/${id}`);
    return response.data;
  },
};

/**
 * Faculty Service
 */
export const facultyService = {
  getAll: async () => {
    const response = await apiClient.get("/api/faculty");
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/faculty/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/faculty", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/faculty/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/faculty/${id}`);
    return response.data;
  },
};

/**
 * HOD Service
 */
export const hodService = {
  getAll: async () => {
    const response = await apiClient.get("/api/hods");
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/hods/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/hods", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/hods/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/hods/${id}`);
    return response.data;
  },
};

/**
 * Branch Admin Service
 */
export const adminService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/admins", { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/admins/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/admins", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/admins/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/admins/${id}`);
    return response.data;
  },
};

/**
 * Attendance Service
 */
export const attendanceService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/attendance", { params });
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/attendance", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/attendance/${id}`, data);
    return response.data;
  },
};

/**
 * Certificate Service
 */
export const certificateService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/certificates", { params });
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/certificates", data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/certificates/${id}`);
    return response.data;
  },
};

/**
 * Announcement Service
 */
export const announcementService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/announcements", { params });
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/announcements", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/api/announcements/${id}`, data);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/api/announcements/${id}`);
    return response.data;
  },
};

/**
 * Notification Service
 */
export const notificationService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/notifications", { params });
    return response.data;
  },
  markRead: async (id) => {
    const response = await apiClient.put(`/api/notifications/${id}`, { is_read: true });
    return response.data;
  },
};

/**
 * Query (Support) Service
 */
export const queryService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/queries", { params });
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post("/api/queries", data);
    return response.data;
  },
  getById: async (id) => {
    const response = await apiClient.get(`/api/queries/${id}`);
    return response.data;
  },
};

/**
 * Activity Log Service
 */
export const activityLogService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/activity-logs", { params });
    return response.data;
  },
};
