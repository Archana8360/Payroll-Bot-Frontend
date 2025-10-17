// src/api/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://payroll-bot-backend.vercel.app", // change to your backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Types
export interface User {
  private _id(_id: any): void;
  role: ReactNode;
  email: ReactNode;
  name: ReactNode;
  id: string;
  phone: string;
}

export interface Question {
  id: string;
  question: string;
  answer: string;
}
