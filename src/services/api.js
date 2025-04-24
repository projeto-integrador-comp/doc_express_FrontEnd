import axios from "axios";

export const api = axios.create({
  baseURL: "https://pi-grupo19-api.onrender.com",
  timeout: 8 * 1000,
});
