import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export interface User {
  _id: string; 
  role: string; 
  email: string; 
  name: string; 
  phone: string;
}

export interface Question {
  _id: string;
  question: string;
  answer: string;
}
