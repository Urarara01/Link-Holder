import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
    const features = [
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
            ),
            title: "Guarda tus enlaces",
            description: "Almacena todos tus enlaces importantes en un solo lugar. Nunca más pierdas ese artículo o recurso que querías revisar después."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            ),
            title: "Organiza en categorías",
            description: "Crea categorías y colecciones personalizadas para mantener tus enlaces perfectamente organizados según tus necesidades."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
            ),
            title: "Etiquetas inteligentes",
            description: "Añade tags a tus enlaces para filtrar y encontrar exactamente lo que buscas en segundos."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
            ),
            title: "Búsqueda potente",
            description: "Encuentra cualquier enlace al instante con nuestra búsqueda en tiempo real por título, URL o descripción."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            title: "Arrastra y ordena",
            description: "Reorganiza tus enlaces, categorías y colecciones con drag & drop. Tu espacio, tu orden."
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
            title: "Notas personales",
            description: "Agrega notas a cada enlace para recordar por qué lo guardaste o qué información importante contiene."
        }
    ];

    const plans = [
        {
            name: "Gratis",
            price: "0",
            period: "por siempre",
            description: "Perfecto para empezar",
            features: [
                "Hasta 100 enlaces",
                "5 categorías",
                "10 colecciones",
                "Búsqueda básica",
                "Acceso web"
            ],
            cta: "Comenzar gratis",
            highlighted: false
        },
        {
            name: "Pro",
            price: "4.99",
            period: "por mes",
            description: "Para usuarios avanzados",
            features: [
                "Enlaces ilimitados",
                "Categorías ilimitadas",
                "Colecciones ilimitadas",
                "Búsqueda avanzada",
                "Exportar datos",
                "Soporte prioritario",
                "Sin anuncios"
            ],
            cta: "Prueba 14 días gratis",
            highlighted: true
        },
        {
            name: "Equipos",
            price: "9.99",
            period: "usuario/mes",
            description: "Para colaborar en equipo",
            features: [
                "Todo de Pro",
                "Hasta 10 miembros",
                "Colecciones compartidas",
                "Permisos de acceso",
                "Panel de administración",
                "API access",
                "SSO empresarial"
            ],
            cta: "Contactar ventas",
            highlighted: false
        }
    ];

    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <div className="nav-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <span>Link Holder</span>
                    </div>
                    <div className="nav-links">
                        <a href="#features">Características</a>
                        <a href="#pricing">Precios</a>
                        <Link to="/login" className="nav-login">Iniciar sesión</Link>
                        <Link to="/register" className="nav-cta">Registrarse</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        Nueva versión disponible
                    </div>
                    <h1 className="hero-title">
                        Tus enlaces,<br />
                        <span className="gradient-text">perfectamente organizados</span>
                    </h1>
                    <p className="hero-description">
                        Link Holder es la forma más inteligente de guardar, organizar y encontrar 
                        todos tus enlaces importantes. Deja de perder recursos valiosos en el caos 
                        de los marcadores del navegador.
                    </p>
                    <div className="hero-cta">
                        <Link to="/register" className="cta-primary">
                            Empezar gratis
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                        <a href="#features" className="cta-secondary">
                            Ver características
                        </a>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Usuarios activos</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-number">500K+</span>
                            <span className="stat-label">Enlaces guardados</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-number">99.9%</span>
                            <span className="stat-label">Uptime</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="app-preview">
                        <div className="preview-header">
                            <div className="preview-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="preview-title">Link Holder</div>
                        </div>
                        <div className="preview-content">
                            <div className="preview-sidebar">
                                <div className="preview-category active">📁 Desarrollo</div>
                                <div className="preview-category">📁 Diseño</div>
                                <div className="preview-category">📁 Marketing</div>
                            </div>
                            <div className="preview-main">
                                <div className="preview-link">
                                    <div className="link-favicon">🔗</div>
                                    <div className="link-info">
                                        <div className="link-title">React Documentation</div>
                                        <div className="link-url">react.dev</div>
                                    </div>
                                </div>
                                <div className="preview-link">
                                    <div className="link-favicon">🔗</div>
                                    <div className="link-info">
                                        <div className="link-title">GitHub Repository</div>
                                        <div className="link-url">github.com</div>
                                    </div>
                                </div>
                                <div className="preview-link">
                                    <div className="link-favicon">🔗</div>
                                    <div className="link-info">
                                        <div className="link-title">Stack Overflow</div>
                                        <div className="link-url">stackoverflow.com</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Características</span>
                        <h2 className="section-title">Todo lo que necesitas para<br /><span className="gradient-text">organizar tu vida digital</span></h2>
                        <p className="section-description">
                            Diseñado para ser simple pero poderoso. Link Holder te da las herramientas 
                            que necesitas sin complicaciones innecesarias.
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div className="feature-card" key={index}>
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="how-section">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Cómo funciona</span>
                        <h2 className="section-title">Empieza en <span className="gradient-text">3 simples pasos</span></h2>
                    </div>
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3 className="step-title">Crea tu cuenta</h3>
                            <p className="step-description">Regístrate en segundos con tu email. Sin tarjeta de crédito requerida.</p>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3 className="step-title">Organiza tus enlaces</h3>
                            <p className="step-description">Crea categorías y colecciones. Añade tus enlaces favoritos con un click.</p>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3 className="step-title">Accede desde cualquier lugar</h3>
                            <p className="step-description">Tus enlaces sincronizados y disponibles en todos tus dispositivos.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing-section" id="pricing">
                <div className="section-container">
                    <div className="section-header">
                        <span className="section-badge">Precios</span>
                        <h2 className="section-title">Un plan para <span className="gradient-text">cada necesidad</span></h2>
                        <p className="section-description">
                            Comienza gratis y escala cuando lo necesites. Sin sorpresas ni costos ocultos.
                        </p>
                    </div>
                    <div className="pricing-grid">
                        {plans.map((plan, index) => (
                            <div className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`} key={index}>
                                {plan.highlighted && <div className="popular-badge">Más popular</div>}
                                <div className="plan-header">
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <p className="plan-description">{plan.description}</p>
                                    <div className="plan-price">
                                        <span className="currency">$</span>
                                        <span className="amount">{plan.price}</span>
                                        <span className="period">/{plan.period}</span>
                                    </div>
                                </div>
                                <ul className="plan-features">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/register" className={`plan-cta ${plan.highlighted ? 'primary' : 'secondary'}`}>
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-background">
                    <div className="gradient-orb orb-cta-1"></div>
                    <div className="gradient-orb orb-cta-2"></div>
                </div>
                <div className="section-container">
                    <h2 className="cta-title">¿Listo para organizar tus enlaces?</h2>
                    <p className="cta-description">
                        Únete a miles de usuarios que ya disfrutan de una mejor forma de guardar 
                        y encontrar sus recursos favoritos.
                    </p>
                    <Link to="/register" className="cta-button">
                        Crear cuenta gratis
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-container">
                    <div className="footer-main">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                                <span>Link Holder</span>
                            </div>
                            <p className="footer-tagline">
                                La forma más inteligente de organizar tus enlaces.
                            </p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Producto</h4>
                                <a href="#features">Características</a>
                                <a href="#pricing">Precios</a>
                                <a href="#pricing">Changelog</a>
                            </div>
                            <div className="footer-column">
                                <h4>Soporte</h4>
                                <a href="#">Documentación</a>
                                <a href="#">FAQ</a>
                                <a href="#">Contacto</a>
                            </div>
                            <div className="footer-column">
                                <h4>Legal</h4>
                                <a href="#">Privacidad</a>
                                <a href="#">Términos</a>
                                <a href="#">Cookies</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 Link Holder. Todos los derechos reservados.</p>
                        <div className="footer-social">
                            <a href="#" aria-label="Twitter">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="GitHub">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
