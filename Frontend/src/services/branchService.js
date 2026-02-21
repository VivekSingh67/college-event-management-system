import axios from "axios";

export const createBranches = (data) => {
  return axios.post("http://localhost:3000/branch/create", data, {
    withCredentials: true,
  });
};

export const getBranches = () => {
  return axios.get("http://localhost:3000/branch/get-data", {
    withCredentials: true,
  });
};

export const updateBranch = (data, id) => {
  return axios.put(`http://localhost:3000/branch/update/${id}`, data, {
    withCredentials: true,
  });
};

export const deleteBranch = (id) => {
  return axios.delete(`http://localhost:3000/branch/delete/${id}`, {
    withCredentials: true,
  });
};
