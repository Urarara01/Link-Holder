import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function NavDashboard({ user, logout, searchQuery, onSearchChange, onAddLink, categories, tags, existingLinks }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRef = useRef(null);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);

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

    const getInitials = (name) => {
        return name ? name.slice(0, 2).toUpperCase() : '?';
    };

    return (
        <nav ref={navRef}>
            <div className="nav-left">
                <div className="logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                </div>
                <h1>Link Holder</h1>
            </div>
            <div className="nav-center">
                <SearchBar 
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                    onAddLink={onAddLink}
                    categories={categories}
                    tags={tags}
                    existingLinks={existingLinks}
                />
            </div>
            <div className="nav-right" ref={menuRef}>
                {user ? (
                    <div className="user-section">
                        <div className="user-avatar" onClick={toggleMenu}>
                            {getInitials(user.username)}
                        </div>
                        <div className="user-info" onClick={toggleMenu}>
                            <span className="username">{user.username}</span>
                            <span className="user-status">
                                <span className="status-dot"></span>
                                Online
                            </span>
                        </div>
                        <button className="menu-toggle" onClick={toggleMenu}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isMenuOpen ? 'rotated' : ''}>
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        {isMenuOpen && (
                            <div className="user-menu">
                                <div className="menu-header">
                                    <div className="menu-avatar">{getInitials(user.username)}</div>
                                    <div className="menu-user-info">
                                        <span className="menu-username">{user.username}</span>
                                        <span className="menu-email">{user.email || 'Sin email'}</span>
                                    </div>
                                </div>
                                <div className="menu-divider"></div>
                                <button className="menu-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                    </svg>
                                    Configuración
                                </button>
                                <button className="menu-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    Mi Perfil
                                </button>
                                <div className="menu-divider"></div>
                                <button className="menu-btn logout" onClick={logout}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="login-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                            <polyline points="10 17 15 12 10 7"></polyline>
                            <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                        Iniciar Sesión
                    </Link>
                )}
            </div>
        </nav>
    );
}