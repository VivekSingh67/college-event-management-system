import axios from "axios";

export const createDepartment = (data) => {
  return axios.post("http://localhost:3000/department/create", data, {
    withCredentials: true,
  });
};


export const getDepartmentData = (branchId) => {
  return axios.get(`http://localhost:3000/department/getData`, {
    params: branchId ? { branchId } : {},
    withCredentials: true
  })
}

export const updateDepartment = (id, departmentData) => {
  console.log(departmentData)
  return axios.put(`http://localhost:3000/department/update/${id}`, departmentData, {
    withCredentials: true
  })
}

export const deleteDepartment = (departmentId) => {
  return axios.delete(`http://localhost:3000/department/delete/${departmentId}`, {
    withCredentials: true
  })
}