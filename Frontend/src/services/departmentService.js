import axios from "axios";

export const createDepartment = (data) => {
  return axios.post("http://localhost:3000/department/create", data, {
    withCredentials: true,
  });
};
