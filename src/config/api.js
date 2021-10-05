import axios from "axios";

export const apiRequests = axios.create({
  baseURL: "https://localhost:44345/",
});

apiRequests.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
