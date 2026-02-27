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

export const deleteAdmin = (id) => {
  return axios.delete(`http://localhost:3000/admin/delete/${id}`, {
    withCredentials: true
  })
}