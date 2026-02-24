import axios from "axios";

export const createAdmin = (adminData) => {
  return axios.post("http://localhost:3000/admin/create", adminData, {
    withCredentials: true,
  });
};

export const getAdminData = (branchId) => {
  return axios.get("http://localhost:3000/admin/getData", {
    params: branchId ? {branchId } : {},
    withCredentials: true,
  });
};
