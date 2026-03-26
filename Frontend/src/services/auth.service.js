import apiClient from "@/lib/apiClient";

/**
 * Auth Service — wraps all /auth API calls.
 * Components must never call apiClient directly; use these helpers instead.
 */

export const authService = {
  /**
   * POST /auth/login
   * @param {{ email: string, password: string }} credentials
   */
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data; // { success, message, accessToken, user }
  },

  /**
   * POST /auth/register
   * NOTE: role is always forced to "student" — other roles are blocked.
   * @param {{ name, email, phone, password }} userData
   */
  register: async (userData) => {
    const payload = { ...userData, role: "student" };
    const response = await apiClient.post("/auth/register", payload);
    return response.data; // { success, message, accessToken, user }
  },

  /**
   * POST /auth/logout
   */
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  /** PUT /auth/update-password */
  updatePassword: async (data) => {
    const response = await apiClient.put("/auth/update-password", data);
    return response.data;
  },
};
