import React from "react";
// Css
import "./sidebarmenu.css";
// Assets
import ClientLogo from '../../assets/client/wembleylogo.png'
import OurLogo from '../../assets/gymhour/logo_gymhour.png'
// Functions
import { useNavigate } from "react-router-dom";

const SidebarMenu = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO: Acá debería mostrarse un modal antes.
        localStorage.removeItem('token');
        navigate('/');
    }

    return (
        <aside className="sidebar">
            {/* Logo cliente*/}
            <div className="sidebar-logo">
                <img src={ClientLogo} alt="Wembley Logo" className="logo" />
                <div className="menu-divider"></div>
            </div>
            {/* Menu */}
            {/* TODO: Agregar links e íconos */}
            <nav className="sidebar-menu">
                <h3 className="menu-title">MENÚ</h3>
                <ul className="menu-list">
                    <li className="menu-item">
                        <i className="icon-home"></i> Inicio
                    </li>
                    <li className="menu-item">
                        <i className="icon-calendar"></i> Mis turnos
                    </li>
                    <li className="menu-item">
                        <i className="icon-schedule"></i> Agendar turno
                    </li>
                    <li className="menu-item">
                        <i className="icon-activity"></i> Clases y actividades
                    </li>
                    <li className="menu-item">
                        <i className="icon-routine"></i> Mi rutina
                    </li>
                    <li className="menu-item">
                        <i className="icon-measure"></i> Medición de resultados
                    </li>
                    <li className="menu-item">
                        <i className="icon-trainers"></i> Entrenadores
                    </li>
                    <li className="menu-item">
                        <i className="icon-routines"></i> Rutinas recomendadas
                    </li>
                </ul>
                <div className="profile-section">
                <h3 className="profile-title">PERFIL</h3>
                <ul className="menu-list">
                    <li className="menu-item">
                    <i className="icon-password"></i> Cambiar contraseña
                    </li>
                    <li className="menu-item logout" onClick={handleLogout}>
                    <i className="icon-logout"></i> Cerrar sesión
                    </li>
                </ul>
                </div>
                <div className="sidebar-footer">
                    <img src={OurLogo} alt="Wembley Logo" className="logo" />
                </div>
            </nav>
        </aside>
    );
};

export default SidebarMenu;
