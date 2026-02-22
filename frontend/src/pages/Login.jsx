import { useState, useContext } from "react";
import { AuthContext } from "../auth/authContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
// IMportar el login css
import "./Login.css";
import DotGrid from "../components/DotGrid";


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
        <>
        <div style={{ width: '100%', height: '100%', position: 'relative'}}>
            <DotGrid className="dot-grid" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                textAlign: 'center'
            }}>
                <h1>Iniciar Sesión</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
        </>
    );
}

