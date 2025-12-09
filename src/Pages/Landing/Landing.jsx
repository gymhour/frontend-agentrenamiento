import React, { useMemo, useState } from "react";
import './Landing.css'
import { Link } from "react-router-dom";
import ImageRutinas from "../../assets/gymhour/sc_rutinas.png"
import ImageLogin from "../../assets/gymhour/sc_login.png"
import ImageInicio from "../../assets/gymhour/sc_inicio.png"
import ImageAdminKps from "../../assets/gymhour/sc_admin_kps.png"
import ImageTurnos from "../../assets/gymhour/sc_turnos.png"
import ImageClase from "../../assets/gymhour/sc_clase.png"
import GymhourIsotipo from "../../assets/gymhour/logo_gymhour_isotipo.png"
import GymhourTextoDerecha from "../../assets/gymhour/logo_gymhour_black_text_right.png"

const Section = ({ id, eyebrow, title, subtitle, children, className = "" }) => (
    <section id={id} className={`gh-section ${className}`}>
        <div className={`gh-container ${className}`}>
            {/* {eyebrow && <div className="gh-eyebrow">{eyebrow}</div>} */}
            {title && <h2 className="gh-h2">{title}</h2>}
            {subtitle && <p className="gh-section-subtitle">{subtitle}</p>}
            {children}
        </div>
    </section>
);

const Badge = ({ children, variant = "soft" }) => (
    <span className={`gh-badge ${variant}`}>{children}</span>
);

const Card = ({ children, className = "" }) => (
    <div className={`gh-card ${className}`}>{children}</div>
);

const Pill = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`gh-pill ${active ? "is-active" : ""}`}
        type="button"
    >
        {children}
    </button>
);

const Feature = ({ icon, title, desc }) => (
    <Card>
        <div className="gh-feature">
            <div className="gh-icon-badge" aria-hidden>{icon}</div>
            <div>
                <h4 className="gh-feature-title">{title}</h4>
                <p className="gh-muted sm">{desc}</p>
            </div>
        </div>
    </Card>
);

// ————————————————————————————————————————————————
// Data de pantallas 
// ————————————————————————————————————————————————
const screens = [
    {
        alt: "Pantalla de Login",
        url: ImageLogin,
    },
    {
        alt: "Inicio del Alumno con shortcuts a turnos y clases",
        url: ImageInicio,
    },
    {
        alt: "Sección de rutinas del alumno",
        url: ImageRutinas,
    },
    {
        alt: "Clases y actividades con imágenes, descripción, instructores y horarios.",
        url: ImageClase
    },
    {
        alt: "Dashboard admin con KPIs de cobros y alumnos activos",
        url: ImageAdminKps,
    },
    {
        alt: "Calendario de turnos",
        url: ImageTurnos,
    },
];

// ————————————————————————————————————————————————
// Features por Rol
// ————————————————————————————————————————————————
const alumnoFeatures = [
    { icon: "🔑", title: "Login / Signup + Recuperación", desc: "Registro en minutos, email de bienvenida y recuperación de contraseña por correo." },
    { icon: "📅", title: "Clases y horarios", desc: "Listado visual con fotos, días y entrenadores asignados." },
    { icon: "📋", title: "Turnos", desc: "Reservá, reprogramá o cancelá tus turnos sin fricción." },
    { icon: "🏋️", title: "Rutinas + Recomendadas", desc: "Armá tus rutinas o seguí las sugeridas por el gimnasio." },
    { icon: "✅", title: "Histórico de ejercicios", desc: "Cargá el peso por ejercicio y mirá cómo evoluciona tu progreso." },
    { icon: "💳", title: "Cuotas y pagos", desc: "Consultá tu estado de cuenta desde el perfil." },
];

const entrenadorFeatures = [
    { icon: "📅", title: "Clases", desc: "Gestioná tus clases y horarios con un calendario claro." },
    { icon: "👥", title: "Listado de alumnos", desc: "Buscá y filtrá alumnos para dar seguimiento rápido." },
    { icon: "📋", title: "Creación de rutinas", desc: "Construí rutinas para compartir." },
    { icon: "✅", title: "Asignación de rutinas", desc: "Asigná planes a cada alumno y hacé seguimiento." },
    { icon: "🏋️", title: "Ejercicios", desc: "Base de ejercicios con imágenes y videos a tu disposición." },
];

const adminFeatures = [
    { icon: "👥", title: "Usuarios + roles", desc: "Administrá alumnos, entrenadores y administradores con pantallas y permisos específicos." },
    { icon: "📅", title: "Clases y turnos", desc: "Definí clases, asigná entrenadores y administrá turnos fácilmente." },
    { icon: "🏋️", title: "Ejercicios y multimedia", desc: "Cargá fotos y videos, ordená por grupos musculares y categorías." },
    { icon: "📋", title: "Rutinas", desc: "Creá planes de entrenamiento rápidamente." },
    { icon: "✨", title: "Planes", desc: "Definí planes de suscripción y beneficios." },
    { icon: "🛡️", title: "Cuotas", desc: "Generación masiva de cuotas para activos con plan; verificación automática de vencidas." },
    { icon: "📈", title: "Dashboard con KPIs", desc: "Cobros pagados/impagos y alumnos activos en un vistazo." },
];

// ————————————————————————————————————————————————
// Pricing (nuevo estilo similar a la imagen)
// ————————————————————————————————————————————————
const pricingPlans = [
    {
        key: "pro",
        name: "Pro",
        tagline: "Para gimnasios en crecimiento",
        baseMonthly: 139900,
        bulletsTop: [
            "Te ayudamos a migrar tus datos",
            "Soporte por WhatsApp o videollamada",
        ],
        bulletsBottom: [
            "Hasta 10 usuarios",
            "Hasta 3 sucursales",
            "Gestión de cuotas, planes y turnos",
            "Panel con métricas clave",
        ],
        cta: "Probar gratis por 10 días",
        featured: false,
    },
    {
        key: "max",
        name: "Max",
        tagline: "Para empresas en expansión",
        baseMonthly: 229900,
        bulletsTop: [
            "Te ayudamos a migrar tus datos",
            "Soporte por WhatsApp o videollamada",
        ],
        bulletsBottom: [
            "Hasta 30 usuarios",
            "Hasta 10 sucursales",
            "Roles y permisos avanzados",
            "Acceso a API",
            "Incluye sitio web para tu gimnasio",
        ],
        cta: "Probar gratis por 10 días",
        featured: true,
    },
];

const formatARS = (value) => {
    // Formato simple tipo $139.900
    try {
        return new Intl.NumberFormat("es-AR").format(value);
    } catch {
        return String(value);
    }
};

export default function GymHourLanding() {
    const [role, setRole] = useState("alumno");

    // nuevo estado para toggle de pricing
    const [billing, setBilling] = useState("monthly"); // "monthly" | "annual"

    const features = useMemo(
        () => ({ alumno: alumnoFeatures, entrenador: entrenadorFeatures, admin: adminFeatures }),
        []
    );

    const nav = [
        { href: "#funcionalidades", label: "Funcionalidades" },
        { href: "#screens", label: "Capturas" },
        { href: "#pricing", label: "Precios" },
        { href: "#faq", label: "FAQ" },
    ];

    const getDisplayedPrices = (plan) => {
        const base = plan.baseMonthly;
        const monthlyEquivalent = billing === "annual"
            ? Math.round(base * 0.75) // 25% OFF
            : base;

        const promo = Math.round(monthlyEquivalent * 0.5); // 50% OFF primeros 3 meses

        return {
            promo,
            after: monthlyEquivalent,
        };
    };

    return (
        <div className="gh-landing gh-theme-light">
            {/* Header */}
            <header className="gh-header gh-header-light">
                <div className="gh-container gh-header-inner">
                    <a href="#hero" className="gh-brand">
                        <img src={GymhourTextoDerecha} alt="GymHour" width={120} />
                    </a>

                    <nav className="gh-nav gh-nav-desktop">
                        {nav.map((n) => (
                            <a key={n.href} href={n.href} className="gh-nav-link">
                                {n.label}
                            </a>
                        ))}
                    </nav>

                    <div className="gh-header-cta">
                        <a href="#cta" className="gh-btn gh-btn-primary">Agendar demo gratuita</a>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <Section id="hero" className="gh-hero-light">
                <div className="gh-container gh-hero-center">

                    <h1 className="gh-h1 gh-h1-light">
                        Gestioná tu gimnasio <br />
                        <span className="muted">en un solo lugar</span>
                    </h1>

                    <p className="gh-muted gh-hero-lead">
                        Reservas de clases, creación de rutinas, listado de ejercicios, administración de cuotas y mucho más.
                        GymHour te permite simplificar la operación diaria y ofrecer una experiencia moderna para tus alumnos.
                    </p>

                    <div className="gh-hero-actions gh-hero-actions-center">
                        <a href="#pricing" className="gh-btn gh-btn-primary gh-btn-hero">Contactanos para una prueba gratuita de 1 mes</a>
                    </div>

                    <div className="gh-hero-panel">
                        <div className="gh-hero-preview-light" />
                    </div>
                </div>
            </Section>


            {/* Roles */}
            <Section
                id="funcionalidades"
                eyebrow="Vistas por perfil"
                title="Qué ofrece la plataforma"
                subtitle="Todo lo necesario para administrar alumnos, rutinas, clases, cobros y turnos con una experiencia moderna y simple."
                className="gh-section funcionalidades-section"
            >
                <div className="gh-role-pills">
                    <Pill active={role === "alumno"} onClick={() => setRole("alumno")}>Alumno</Pill>
                    <Pill active={role === "entrenador"} onClick={() => setRole("entrenador")}>Entrenador</Pill>
                    <Pill active={role === "admin"} onClick={() => setRole("admin")}>Admin</Pill>
                </div>
                <div className="gh-grid-3">
                    {(features[role] || []).map((f, i) => (
                        <Feature key={i} icon={f.icon} title={f.title} desc={f.desc} />
                    ))}
                </div>
            </Section>

            {/* Screenshots */}
            <Section
                id="screens"
                eyebrow="Producto"
                title="Algunas pantallas de GymHour"
                subtitle="Una interfaz moderna pensada para que alumnos, entrenadores y administradores trabajen más rápido."
                className="funcionalidades-section"
            >
                <div className="gh-grid-3">
                    {screens.map((s, i) => (
                        <Card key={i} className="gh-card-screenshot">
                            <figure className="gh-screenshot">
                                <img src={s.url} alt={s.alt} />
                            </figure>
                            <figcaption className="gh-muted sm mt-8">{s.alt}</figcaption>
                        </Card>
                    ))}
                </div>
            </Section>

            {/* Pricing (nuevo layout) */}
            <section id="pricing" className="gh-pricing-section">
                <div className="gh-container gh-pricing-container">
                    <h2 className="gh-pricing-title">
                        Empezá gratis, después aprovechá <br />
                        los descuentos por meses.
                    </h2>
                    <p className="gh-pricing-subtitle">
                        Elegí el plan que mejor se adapte a tu gimnasio.
                        Con la contratación de cualquiera de los planes, también te realizamos un sitio web sin costo.
                    </p>

                    <div className="gh-pricing-toggle">
                        <button
                            type="button"
                            className={`gh-pricing-toggle-btn ${billing === "monthly" ? "is-active" : ""}`}
                            onClick={() => setBilling("monthly")}
                        >
                            Mensual
                        </button>
                        <button
                            type="button"
                            className={`gh-pricing-toggle-btn ${billing === "annual" ? "is-active" : ""}`}
                            onClick={() => setBilling("annual")}
                        >
                            Anual <span className="gh-toggle-hint">(25% OFF)</span>
                        </button>
                    </div>

                    <div className="gh-pricing-grid-new">
                        {pricingPlans.map((plan) => {
                            const prices = getDisplayedPrices(plan);

                            return (
                                <div
                                    key={plan.key}
                                    className={`gh-pricing-card-new ${plan.featured ? "is-featured" : ""}`}
                                >
                                    <div className="gh-pricing-card-head">
                                        <h3 className="gh-pricing-card-name">{plan.name}</h3>
                                        <div className="gh-pricing-card-tagline">{plan.tagline}</div>
                                    </div>

                                    <div className="gh-pricing-price-block">
                                        <div className="gh-pricing-price-main">
                                            <span className="gh-price-currency">$</span>
                                            <span className="gh-price-number">{formatARS(prices.promo)}</span>
                                            <span className="gh-price-suffix">/mes</span>
                                        </div>
                                        <div className="gh-pricing-promo-line">
                                            <span className="gh-pricing-promo-badge">50% OFF</span>
                                            <span>primeros 3 meses</span>
                                        </div>
                                        <div className="gh-pricing-after-line">
                                            <span className="gh-pricing-after-amount">
                                                ${formatARS(prices.after)}
                                            </span>
                                            <span className="gh-pricing-after-muted">/mes después</span>
                                        </div>
                                    </div>

                                    <a href="#cta" className="gh-pricing-btn">
                                        {plan.cta}
                                    </a>

                                    <ul className="gh-pricing-checklist">
                                        {plan.bulletsTop.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>

                                    <div className="gh-pricing-divider" />

                                    <ul className="gh-pricing-specs">
                                        {plan.bulletsBottom.map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <Section
                id="faq"
                eyebrow="Preguntas frecuentes"
                title="Todo lo que suelen consultarnos"
            >
                <div className="gh-grid-2">
                    <Card>
                        <h4 className="gh-feature-title">¿GymHour sirve para gimnasios y también para entrenadores personales?</h4>
                        <p className="gh-muted sm mt-6">Sí. Podés usarlo en gimnasios, boxes o studios, y también como entrenador personal para gestionar tus clases, rutinas y alumnos.</p>
                    </Card>
                    <Card>
                        <h4 className="gh-feature-title">¿Necesito instalar algo?</h4>
                        <p className="gh-muted sm mt-6">No. Es 100% web y funciona desde cualquier tipo de dispositivo con acceso a Internet.</p>
                    </Card>
                    <Card>
                        <h4 className="gh-feature-title">¿Cómo gestionan las cuotas?</h4>
                        <p className="gh-muted sm mt-6">Podés crear cuotas únicas o generar cuotas masivas para todos los usuarios. Además, el sistema marca automáticamente las vencidas mediante un proceso programado.</p>
                    </Card>
                    <Card>
                        <h4 className="gh-feature-title">¿Qué métricas muestra el panel?</h4>
                        <p className="gh-muted sm mt-6">Vas a ver cobros pagados/impagos y la cantidad de alumnos activos, para entender la salud de tu negocio de un vistazo.</p>
                    </Card>
                </div>
            </Section>

            {/* Footer */}
            <footer className="gh-footer-light">
                <div className="gh-container gh-footer-inner">
                    <p className="gh-muted">© {new Date().getFullYear()} GymHour</p>
                    <div className="gh-footer-links">
                        <a href="#pricing">Precios</a>
                        <a href="#faq">FAQ</a>
                        <a href="#cta">Solicitar demo</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}