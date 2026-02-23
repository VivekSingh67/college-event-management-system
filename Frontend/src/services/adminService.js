import axios from "axios";

export const createAdmin = (adminData) => {
  return axios.post("http://localhost:3000/admin/create", adminData, {
    withCredentials: true,
  });
};
