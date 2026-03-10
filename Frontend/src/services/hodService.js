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
  return axios.put(`${API_URL}/update/${id}`, data, {
    withCredentials: true,
  });
};

// Delete HOD
export const deactivateHod = (id) => {
  return axios.put(
    `${API_URL}/deactivate/${id}`,
    {},
    {
      withCredentials: true,
    },
  );
};

// In hodService.js
export const reactivateHod = async (userId) => {
  try {
    const response = await axios.put(
      `${API_URL}/reactivate/${userId}`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data; // This returns the data from the response
  } catch (error) {
    throw error;
  }
};
