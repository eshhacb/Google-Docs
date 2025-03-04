import axios from "axios";

const API_GATEWAY_URL = "http://localhost:4000/api/auth";

export const registerUser = async (userData) => {
  return axios.post(`${API_GATEWAY_URL}/register`, userData);
};

export const loginUser = async (userData) => {
  return axios.post(`${API_GATEWAY_URL}/login`, userData);
};
export const logoutUser = async () => {
    return axios.post(`${API_GATEWAY_URL}/logout`, {}, { withCredentials: true });
  };