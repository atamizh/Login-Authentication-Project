import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export const loginUser = async (email, password) => {
  const response = await api.post("/login", {
    email,
    password
  });

  return response.data;
};