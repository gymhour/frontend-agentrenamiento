import React, { useMemo, useState } from "react";
import './Landing.css'
import { Link } from "react-router-dom";
import ImageRutinas from "../../assets/gymhour/sc_rutinas.png"
import ImageLogin from "../../assets/gymhour/sc_login.png"
import ImageInicio from "../../assets/gymhour/sc_inicio.png"
import ImageAdminKps from "../../assets/gymhour/sc_admin_kps.png"
import ImageTurnos from "../../assets/gymhour/sc_turnos.png"
import ImageClase from "../../assets/gymhour/sc_clase.png"



const Section = ({ id, eyebrow, title, children, className = "" }) => (
    <section id={id} className={`gh-section ${className}`}>
        <div className="gh-container">
            {eyebrow && <div className="gh-eyebrow">{eyebrow}</div>}
            {title && <h2 className="gh-h2">{title}</h2>}
            {children}
        </div>
    </section>
);

const Badge = ({ children }) => <span className="gh-badge">{children}</span>;

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

const commonPillars = [
    { icon: "✉️", title: "Emails transaccionales", desc: "Bienvenida y recuperación de contraseña listos out‑of‑the‑box." },
    { icon: "🛡️", title: "Seguridad y roles", desc: "Accesos por perfil para mantener la operación ordenada." },
    { icon: "⏱️", title: "Ahorro de tiempo", desc: "Flujos simples que reducen soporte y tareas repetitivas." },
];

export default function GymHourLanding() {
    const [role, setRole] = useState("alumno");

    const features = useMemo(
        () => ({ alumno: alumnoFeatures, entrenador: entrenadorFeatures, admin: adminFeatures }),
        []
    );

    const nav = [
        { href: "#features", label: "Funcionalidades" },
        { href: "#roles", label: "Para quién es" },
        { href: "#screens", label: "Capturas" },
        { href: "#faq", label: "FAQ" },
    ];

    return (
        <div className="gh-landing">
            {/* Header */}
            <header className="gh-header">
                <div className="gh-container gh-header-inner">
                    <a href="#" className="gh-brand">
                        <div className="gh-logo">H</div>
                        <span>GymHour</span>
                    </a>
                    <nav className="gh-nav">
                        {nav.map((n) => (
                            <a key={n.href} href={n.href} className="gh-nav-link">
                                {n.label}
                            </a>
                        ))}
                    </nav>
                    <div className="gh-header-cta">
                        <Link to="/login" className="gh-btn gh-btn-ghost"> Login </Link>
                        <a href="#cta" className="gh-btn gh-btn-primary">Solicitar demo</a>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <Section id="hero" className="gh-hero">
                <div className="gh-container gh-hero-grid">
                    <div>
                        <Badge>Software para gimnasios y entrenadores</Badge>
                        <h1 className="gh-h1">Gestioná tu gimnasio <span className="muted">en un solo lugar</span></h1>
                        <p className="gh-muted">
                            Reservas de clases, creación de rutinas, listado de ejercicios, administración de cuotas y mucho más. GymHour te permite simplificar la operación diaria y ofrecer una experiencia moderna para tus alumnos.
                        </p>
                        <div className="gh-hero-actions">
                            <a href="#cta" className="gh-btn gh-btn-primary">Probar 100% gratis</a>
                            <a href="#screens" className="gh-btn gh-btn-ghost">Ver funcionalidades →</a>
                        </div>
                        {/* <div className="gh-hero-hints">
                            <span>✨ Fácil de usar</span>
                            <span>🤖 Menos tareas manuales</span>
                            <span>📈 Seguimiento 24/7</span>
                        </div> */}
                    </div>
                    <div className="gh-hero-preview">
                        {/* Screens de la app */}
                    </div>
                    {/* <Card>
            <div className="gh-hero-preview">
              <div className="gh-preview-caption">Preview UI</div>
              <div className="gh-preview-title">Inicio del Alumno</div>
              <p className="gh-muted sm">Tarjetas de clases, últimas reservas y rutinas</p>
            </div>
          </Card> */}
                </div>
            </Section>

            {/* Highlights */}
            <Section id="features" eyebrow="Lo esencial" title="Funcionalidades que resuelven el día a día">
                <div className="gh-grid-3">
                    <Feature icon="📅" title="Reservas simples" desc="Disponibilidad de turnos y agenda inmediata." />
                    <Feature icon="🏋️" title="Rutinas potentes" desc="Los entrenadores pueden asignar rutinas a los alumnos del gimnasio." />
                    <Feature icon="📈" title="Progreso real" desc="Historial de ejercicios con seguimiento de pesos y repeticiones." />
                </div>
                <div className="gh-grid-3 mt-20">
                    <Feature icon="👥" title="Equipos organizados" desc="Roles para administradores, entrenadores y alumnos con vistas dedicadas." />
                    <Feature icon="🛡️" title="Cuotas y planes" desc="Cargá tus planes, asignáselos a tus alumnos y maneja sus cuotas mensuales." />
                    <Feature icon="✉️" title="Ejercicios" desc="Cargá ejercicios con videos de demostración y descripciones." />
                </div>
            </Section>

            {/* Roles */}
            <Section id="roles" eyebrow="Vistas por perfil" title="Una experiencia diseñada para cada rol">
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
                {/* <div className="gh-pill-row">
                    {commonPillars.map((p, i) => (
                        <span key={i} className="gh-badge">{p.icon} {p.title}</span>
                    ))}
                </div> */}
            </Section>

            {/* Screenshots */}
            <Section id="screens" eyebrow="Producto" title="Algunas pantallas de GymHour">
                <div className="gh-grid-3">
                    {screens.map((s, i) => (
                        <Card key={i}>
                            <figure className="gh-screenshot">
                                <img src={s.url} alt={s.alt} />
                            </figure>
                            <figcaption className="gh-muted sm mt-8">{s.alt}</figcaption>
                        </Card>
                    ))}
                </div>
            </Section>

            {/* CTA */}
            <Section id="cta" className="gh-cta">
                <Card className="gh-cta-card">
                    <div>
                        <div className="gh-muted sm">¿Listo para modernizar tu gimnasio?</div>
                        <h3 className="gh-h3 mt-2">Probá GymHour gratis</h3>
                        <p className="gh-muted mt-2">En minutos podés crear clases, cargar rutinas y empezar a recibir reservas de tus alumnos.</p>
                    </div>
                    <div className="gh-cta-actions">
                        <a href="#" className="gh-btn gh-btn-primary">Solicitar demo</a>
                    </div>
                </Card>
            </Section>

            {/* FAQ */}
            <Section id="faq" eyebrow="Preguntas frecuentes" title="Todo lo que suelen consultarnos">
                <div className="gh-grid-2">
                    <Card>
                        <h4 className="gh-feature-title">¿GymHour sirve para gimnasios y también para entrenadores personales?</h4>
                        <p className="gh-muted sm mt-6">Sí. Podés usarlo en gimnasios, boxes o studios, y también como entrenador personal para gestionar tus clases, rutinas y alumnos.</p>
                    </Card>
                    <Card>
                        <h4 className="gh-feature-title">¿Necesito instalar algo?</h4>
                        <p className="gh-muted sm mt-6">No. Es 100% web y responsive: funciona en computadora y celular desde el navegador.</p>
                    </Card>
                    <Card>
                        <h4 className="gh-feature-title">¿Cómo gestionan las cuotas?</h4>
                        <p className="gh-muted sm mt-6">Podés crear cuotas únicas o generar cuotas masivas para todos los usuarios con plan. Además, el sistema marca automáticamente las vencidas mediante un proceso programado.</p>
                    </Card>
                    <Card>
                        <h4 className="gh-feature-title">¿Qué métricas muestra el panel?</h4>
                        <p className="gh-muted sm mt-6">Vas a ver cobros pagados/impagos y la cantidad de alumnos activos, para entender la salud de tu negocio de un vistazo.</p>
                    </Card>
                </div>
            </Section>

            {/* Footer */}
            <footer className="gh-footer">
                <div className="gh-container gh-footer-inner">
                    <p className="gh-muted">© {new Date().getFullYear()} GymHour </p>
                    {/* <div className="gh-footer-links">
                        <a href="#">Política de privacidad</a>
                        <a href="#">Términos</a>
                        <a href="mailto:hola@gymhour.app">Contacto</a>
                    </div> */}
                </div>
            </footer>
        </div>
    );
}
