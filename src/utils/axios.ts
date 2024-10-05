import axios from "axios";

let instance = axios.create({
  baseURL: "http://localhost:5000/api/",
  withCredentials: true,
});

instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default instance;
