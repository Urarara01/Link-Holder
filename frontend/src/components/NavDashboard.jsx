import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NavDashboard({ user, logout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const navRef = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const navEl = navRef.current;
        if (!navEl || typeof window === "undefined") return;
        if (sessionStorage.getItem("linkHolderNavVisited")) return;
        sessionStorage.setItem("linkHolderNavVisited", "1");
        navEl.classList.add("initial-drop");
        const cleanup = () => navEl.classList.remove("initial-drop");
        const timer = setTimeout(cleanup, 1600);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <nav ref={navRef}>
            <div className="nav-left">
                <h1>Mi Link Holder</h1>
            </div>
            <div className="nav-center">
                <input type="text" placeholder="Buscar enlaces..." className="search-input" />
            </div>
            <div className="nav-right">
                {user ? (
                    <div className="user-section">
                        <p className="username" onClick={toggleMenu}>
                            {user.username}
                        </p>
                        {isMenuOpen && (
                            <div className="user-menu">
                                <button className="menu-btn" onClick={logout}>Salir</button>
                                {/* Aquí puedes agregar más botones en el futuro */}
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="login-btn">Iniciar Sesión</Link>
                )}
            </div>
        </nav>
    );
}