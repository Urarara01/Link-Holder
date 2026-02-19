import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/user",
//   headers: {
//     "Content-Type": "application/json",
//   },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      console.log("Token encontrado, agregando a la solicitud");
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
