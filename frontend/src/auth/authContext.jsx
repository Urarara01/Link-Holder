import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      // Validar el token haciendo una llamada a /me
      api.get("/api/user/auth/me/")
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error("Token inválido:", error);
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setUser(null);
        });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/api/user/auth/login/", { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      // Cargar datos del usuario después del login
      const userResponse = await api.get("/api/user/auth/me/");
      setUser(userResponse.data);
    } catch (error) {
        console.error("Login failed:", error);
    }
  }

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

