import axios from "axios";
const API_URL = "http://localhost:3000/hod";

// Create HOD
export const createHod = (data) => {
  return axios.post(`${API_URL}/create`, data, {
    withCredentials: true,
  });
};

// Get All HOD Data
export const getHodData = () => {
  return axios.get(`${API_URL}/getData`, {
    withCredentials: true,
  });
};

// Update HOD
export const updateHodData = (id, data) => {
  return axios.post(`${API_URL}/update/${id}`, data, {
    withCredentials: true,
  });
};

// Delete HOD
export const deleteData = (id) => {
  return axios.delete(`${API_URL}/delete/${id}`, {
    withCredentials: true,
  });
};