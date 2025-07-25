import axios from "axios";
import { saveToken } from "../lib/auth";
// const API_URL = "http://localhost:3000/api/auth/login";
const API_URL_REGISTER =
  "https://kreatifana-backend-production.up.railway.app/api/auth/register";

export const register = async (userData: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL_REGISTER}`, userData);
  console.log(response.data);
  return response.data;
};

export const login = async (userData: { email: string; password: string }) => {
  const response = await axios.post(
    "https://kreatifana-backend-production.up.railway.app/api/auth/login",
    userData
  );

  if (response.data && response.data.token) {
    saveToken(response.data.token); // Simpan token ke localStorage
  }

  return response.data;
};
