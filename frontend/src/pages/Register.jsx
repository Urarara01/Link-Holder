import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./Register.css";
import DotGrid from "../components/DotGrid";


export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return false;
        }
        if (formData.password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return false;
        }
        if (!formData.email.includes("@")) {
            setError("Ingresa un email válido");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) return;
        
        setIsLoading(true);

        try {
            await api.post("/api/user/auth/register/", {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            // Registro exitoso, redirigir al login
            navigate("/login", { state: { message: "Cuenta creada exitosamente. Inicia sesión." } });
        } catch (err) {
            if (err.response?.data) {
                const errors = err.response.data;
                if (errors.username) {
                    setError("Este nombre de usuario ya está en uso");
                } else if (errors.email) {
                    setError("Este email ya está registrado");
                } else {
                    setError("Error al crear la cuenta. Intenta de nuevo.");
                }
            } else {
                setError("Error de conexión. Intenta de nuevo.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: "", color: "" };
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const levels = [
            { label: "Muy débil", color: "#e74c3c" },
            { label: "Débil", color: "#e67e22" },
            { label: "Regular", color: "#f1c40f" },
            { label: "Fuerte", color: "#2ecc71" },
            { label: "Muy fuerte", color: "#27ae60" }
        ];

        return { strength, ...levels[Math.min(strength, 4)] };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="register-page">
            <DotGrid />
            
            {/* Efectos de fondo */}
            <div className="register-bg-effects">
                <div className="bg-gradient-1"></div>
                <div className="bg-gradient-2"></div>
                <div className="bg-gradient-3"></div>
            </div>

            <div className="register-container">
                {/* Logo y título */}
                <div className="register-header">
                    <div className="register-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                    </div>
                    <h1>Crear Cuenta</h1>
                    <p className="register-subtitle">Únete y organiza todos tus enlaces</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <div className="input-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <input 
                                type="text" 
                                id="username"
                                name="username"
                                placeholder="Elige un nombre de usuario"
                                value={formData.username} 
                                onChange={handleChange}
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <input 
                                type="email" 
                                id="email"
                                name="email"
                                placeholder="tu@email.com"
                                value={formData.email} 
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <div className="input-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input 
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Mínimo 8 caracteres"
                                value={formData.password} 
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <button 
                                type="button" 
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {formData.password && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    {[...Array(5)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`strength-segment ${i < passwordStrength.strength ? 'active' : ''}`}
                                            style={{ backgroundColor: i < passwordStrength.strength ? passwordStrength.color : '' }}
                                        />
                                    ))}
                                </div>
                                <span className="strength-label" style={{ color: passwordStrength.color }}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <div className="input-wrapper">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-icon">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Repite tu contraseña"
                                value={formData.confirmPassword} 
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                            />
                            <button 
                                type="button" 
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </button>
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <div className="password-match">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="register-submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <div className="spinner"></div>
                                Creando cuenta...
                            </>
                        ) : (
                            <>
                                Crear Cuenta
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="8.5" cy="7" r="4"></circle>
                                    <line x1="20" y1="8" x2="20" y2="14"></line>
                                    <line x1="23" y1="11" x2="17" y2="11"></line>
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="register-footer">
                    <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link></p>
                </div>

                {/* Decoración */}
                <div className="register-decoration">
                    <div className="decoration-line"></div>
                    <span>Tu biblioteca de links</span>
                    <div className="decoration-line"></div>
                </div>
            </div>
        </div>
    );
}
