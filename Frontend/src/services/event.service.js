import apiClient from "@/lib/apiClient";

/**
 * Event Service — wraps all /api/events API calls.
 */
export const eventService = {
  /** GET /api/events */
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/events", { params });
    return response.data; // { success, data, total }
  },

  /** GET /api/events/:id */
  getById: async (id) => {
    const response = await apiClient.get(`/api/events/${id}`);
    return response.data;
  },

  /** POST /api/events  (admin/hod/faculty only) */
  create: async (eventData) => {
    const response = await apiClient.post("/api/events", eventData);
    return response.data;
  },

  /** PUT /api/events/:id  (admin/hod only) */
  update: async (id, eventData) => {
    const response = await apiClient.put(`/api/events/${id}`, eventData);
    return response.data;
  },

  /** DELETE /api/events/:id  (admin only) */
  remove: async (id) => {
    const response = await apiClient.delete(`/api/events/${id}`);
    return response.data;
  },
};

/**
 * Event Registration Service — wraps all /api/event-registrations API calls.
 */
export const eventRegistrationService = {
  /** GET /api/event-registrations */
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/event-registrations", { params });
    return response.data;
  },

  /** GET /api/event-registrations/me */
  getMine: async (params = {}) => {
    const response = await apiClient.get("/api/event-registrations/me", { params });
    return response.data;
  },

  /** POST /api/event-registrations */
  register: async (data) => {
    const response = await apiClient.post("/api/event-registrations", data);
    return response.data;
  },

  /** DELETE /api/event-registrations/:id */
  cancel: async (id) => {
    const response = await apiClient.delete(`/api/event-registrations/${id}`);
    return response.data;
  },
};

/**
 * Event Approval Service
 */
export const eventApprovalService = {
  /** GET /api/event-approvals */
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/event-approvals", { params });
    return response.data;
  },

  /** POST /api/event-approvals */
  approve: async (data) => {
    const response = await apiClient.post("/api/event-approvals", data);
    return response.data;
  },

  /** PUT /api/event-approvals/:id */
  update: async (id, data) => {
    const response = await apiClient.put(`/api/event-approvals/${id}`, data);
    return response.data;
  },
};

/**
 * Event Category Service
 */
export const eventCategoryService = {
  /** GET /api/event-categories */
  getAll: async () => {
    const response = await apiClient.get("/api/event-categories");
    return response.data;
  },

  /** POST /api/event-categories */
  create: async (data) => {
    const response = await apiClient.post("/api/event-categories", data);
    return response.data;
  },

  /** PUT /api/event-categories/:id */
  update: async (id, data) => {
    const response = await apiClient.put(`/api/event-categories/${id}`, data);
    return response.data;
  },

  /** DELETE /api/event-categories/:id */
  remove: async (id) => {
    const response = await apiClient.delete(`/api/event-categories/${id}`);
    return response.data;
  },
};

/**
 * Event Venue Service
 */
export const eventVenueService = {
  /** GET /api/event-venues */
  getAll: async (params = {}) => {
    const response = await apiClient.get("/api/event-venues", { params });
    return response.data;
  },

  /** POST /api/event-venues */
  create: async (data) => {
    const response = await apiClient.post("/api/event-venues", data);
    return response.data;
  },

  /** PUT /api/event-venues/:id */
  update: async (id, data) => {
    const response = await apiClient.put(`/api/event-venues/${id}`, data);
    return response.data;
  },

  /** DELETE /api/event-venues/:id */
  remove: async (id) => {
    const response = await apiClient.delete(`/api/event-venues/${id}`);
    return response.data;
  },
};
