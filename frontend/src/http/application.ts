import axios from "axios";

const API_URL = "http://localhost:5000"; 


const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const createApplication = async (data: {
  companyName: string;
  role: string;
  personName: string;
  jobType: string;
}) => {
  const response = await axios.post(`${API_URL}/applications`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};