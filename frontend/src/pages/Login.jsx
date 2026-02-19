import { useState, useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        console.log("Intentando iniciar sesión con:", { username, password });
        e.preventDefault();
        setError("");

        try {
            await login(username, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Credenciales inválidas");
            console.error("Error durante el login:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
}

