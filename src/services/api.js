import axios from "axios";

export const api = axios.create({
  baseURL: "https://pi-grupo19-api.onrender.com",
  timeout: 30 * 1000,
});
