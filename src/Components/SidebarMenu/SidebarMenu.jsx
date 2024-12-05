import React from "react";
// Css
import "./sidebarmenu.css";
// Assets
import ClientLogo from "../../assets/client/wembleylogo.png";
import OurLogo from "../../assets/gymhour/logo_gymhour.png";
// Iconos
import { ReactComponent as InicioIcon } from '../../assets/icons/sidebar/inicio.svg';
import { ReactComponent as ClasesActividadesIcon } from '../../assets/icons/sidebar/clases-actividades.svg';
import { ReactComponent as AgendarTurnoIcon } from '../../assets/icons/sidebar/agendar-turno.svg';
import { ReactComponent as AjustesIcon } from '../../assets/icons/sidebar/ajustes.svg';
import { ReactComponent as CerrarSesionIcon } from '../../assets/icons/sidebar/cerrar-sesion.svg';
import { ReactComponent as MedicionResultadosicon } from '../../assets/icons/sidebar/medicion-resultados.svg';
import { ReactComponent as MiRutinaIcon } from '../../assets/icons/sidebar/mi-rutina.svg';
import { ReactComponent as MisTurnosIcon } from '../../assets/icons/sidebar/mis-turnos.svg';
import { ReactComponent as RutinasRecomendadasIcon } from '../../assets/icons/sidebar/rutinas-recomendadas.svg';
// Routing
import { useNavigate, useLocation, Link } from "react-router-dom";

const SidebarMenu = ({ isAdmin }) => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const handleLogout = () => {
        // TODO: Mostrar un modal antes.
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <aside className="sidebar">
            {/* Logo cliente */}
            <div className="sidebar-logo">
                <img src={ClientLogo} alt="Wembley Logo" className="logo" />
                <div className="menu-divider"></div>
            </div>
            {/* Menú */}
            <nav className="sidebar-menu">
                <h3 className="menu-title">MENÚ</h3>
                <ul className="menu-list">
                    {isAdmin ? (
                        <>
                            <Link
                                to="/admin/inicio"
                                className={`menu-link ${location.pathname === '/admin/inicio' ? 'active' : ''}`}
                            >
                                <li className="menu-item">
                                    <InicioIcon className="icon" fill="#A2A2A2"/> Inicio
                                </li>
                            </Link>
                            <Link
                                to="/admin/clases-actividades"
                                className={`menu-link ${location.pathname === '/admin/clases-actividades' ? 'active' : ''}`}
                            >
                                <li className="menu-item">
                                    <ClasesActividadesIcon className="icon" fill="#A2A2A2"/> Clases y actividades
                                </li>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/alumno/inicio"
                                className={`menu-link ${location.pathname === '/alumno/inicio' ? 'active' : ''}`}
                            >
                                <li className="menu-item">
                                    <InicioIcon className="icon" fill="#A2A2A2"/> Inicio
                                </li>
                            </Link>
                            <Link
                                to="/alumno/turnos"
                                className={`menu-link ${location.pathname === '/alumno/turnos' ? 'active' : ''}`}
                            >
                                <li className="menu-item">
                                    <MisTurnosIcon className="icon"/> Mis turnos
                                </li>
                            </Link>
                            <Link
                                to="/alumno/agendar-turno"
                                className={`menu-link ${location.pathname === '/alumno/agendar-turno' ? 'active' : ''}`}
                            >
                                <li className="menu-item">
                                    <AgendarTurnoIcon className="icon"/> Agendar turno
                                </li>
                            </Link>
                            <Link 
                                to="/alumno/clases-actividades"
                                className={`menu-link ${location.pathname === '/alumno/clases-actividades' ? 'active' : ''}`}                                
                            >
                                <li className="menu-item">
                                    <ClasesActividadesIcon className="icon" fill="#A2A2A2"/> Clases y actividades
                                </li>
                            </Link>
                            <Link
                                to="/alumno/mi-rutina"
                                className={`menu-link ${location.pathname === '/alumno/mi-rutina' ? 'active' : ''}`}                                
                            >
                                <li className="menu-item">
                                    <MiRutinaIcon className="icon" fill="#A2A2A2"/> Mi rutina
                                </li>
                            </Link>
                            <Link
                                to="/alumno/medicion-resultados"
                                className={`menu-link ${location.pathname === '/alumno/medicion-resultados' ? 'active' : ''}`}                                
                            >
                                <li className="menu-item">
                                    <MedicionResultadosicon className="icon"/> Medición de resultados
                                </li>
                            </Link>
                            <Link
                                to="/alumno/entrenadores"
                                className={`menu-link ${location.pathname === '/alumno/entrenadores' ? 'active' : ''}`}                                
                            >
                                <li className="menu-item">
                                    <RutinasRecomendadasIcon className="icon"/> Entrenadores
                                </li>
                            </Link>
                            <Link
                                to="alumno/rutinas-recomendadas"
                                className={`menu-link ${location.pathname === '/alumno/rutinas-recomendadas' ? 'active' : ''}`}                                
                            >
                                <li className="menu-item">
                                    <RutinasRecomendadasIcon className="icon"/>  Rutinas recomendadas
                                </li>
                            </Link>
                        </>
                    )}
                </ul>

                <div className="profile-section">
                    <h3 className="profile-title">PERFIL</h3>
                    <ul className="menu-list">
                        <Link
                            to="/alumno/cambiar-contrasena"
                            className={`menu-link ${location.pathname === '/alumno/cambiar-contrasena' ? 'active' : ''}`}                    
                        >
                            <li className="menu-item">
                                <AjustesIcon className="icon" fill="#A2A2A2"/> Cambiar contraseña
                            </li>
                        </Link>
                        <li className="menu-item logout" onClick={handleLogout}>
                            <CerrarSesionIcon className="icon" fill="#CC8889"/> Cerrar sesión
                        </li>
                    </ul>
                </div>
                <div className="sidebar-footer">
                    <img src={OurLogo} alt="GymHour Logo" className="logo" />
                </div>
            </nav>
        </aside>
    );
};

export default SidebarMenu;
