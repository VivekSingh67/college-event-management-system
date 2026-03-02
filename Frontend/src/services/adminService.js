import axios from "axios";

export const createAdmin = (adminData) => {
  return axios.post("http://localhost:3000/admin/create", adminData, {
    withCredentials: true,
  });
};

export const getAdminData = (branchId) => {
  return axios.get("http://localhost:3000/admin/getData", {
    params: branchId ? { branchId } : {},
    withCredentials: true,
  });
};

export const updateAdmin = (id, adminData) => {
  return axios.put(`http://localhost:3000/admin/update/${id}`, adminData, {
    withCredentials: true,
  });
};

export const updateStatus = (id, isActive) => {
  return axios.patch(
    `http://localhost:3000/admin/status/${id}`,
    { isActive },
    { withCredentials: true },
  );
};
