// src/components/SidebarMenu/SidebarMenu.js
import React, { useState } from "react";
// Css
import "./sidebarmenu.css";
// Assets
import ClientLogo from "../../assets/client/ag_entrenamiento.png";
import OurLogo from "../../assets/gymhour/logo_gymhour.png";
// Iconos sidebar
import { ReactComponent as InicioIcon } from '../../assets/icons/sidebar/inicio.svg';
import { ReactComponent as ClasesActividadesIcon } from '../../assets/icons/sidebar/clases-actividades.svg';
import { ReactComponent as AgendarTurnoIcon } from '../../assets/icons/sidebar/agendar-turno.svg';
import { ReactComponent as AjustesIcon } from '../../assets/icons/sidebar/ajustes.svg';
import { ReactComponent as CerrarSesionIcon } from '../../assets/icons/sidebar/cerrar-sesion.svg';
import { ReactComponent as MedicionResultadosIcon } from '../../assets/icons/sidebar/medicion-resultados.svg';
import { ReactComponent as MiRutinaIcon } from '../../assets/icons/sidebar/notebook.svg';
import { ReactComponent as MisTurnosIcon } from '../../assets/icons/sidebar/mis-turnos.svg';
import { ReactComponent as RutinasRecomendadasIcon } from '../../assets/icons/sidebar/rutinas-recomendadas.svg';
import { ReactComponent as CrearUsuarioIcon } from '../../assets/icons/sidebar/user-plus.svg';
import { ReactComponent as UsuariosIcon } from '../../assets/icons/users-icon.svg';
import { ReactComponent as MenuHamburguesaIcon } from '../../assets/icons/sidebar/ic_menu_hamburguesa.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';
import { ReactComponent as IngresosIcon } from '../../assets/icons/money-icon.svg';
import { ReactComponent as EntrenadoresIcon } from '../../assets/icons/sidebar/entrenadores-icon.svg';
import { ReactComponent as PlanesIcon } from '../../assets/icons/sidebar/admin-planes.svg';
import { ReactComponent as DumbbellIcon } from '../../assets/icons/sidebar/dumbbell.svg';
import { ReactComponent as AsignarRutinaIcon } from '../../assets/icons/sidebar/square-pen.svg';


// Routing
import { useNavigate, useLocation, Link } from "react-router-dom";
// Componentes
import ConfirmationPopup from "../utils/ConfirmationPopUp/ConfirmationPopUp";

const SidebarMenu = ({ isAdmin, isEntrenador }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogoutClick = () => setIsPopupOpen(true);
  const handleLogoutConfirm = () => {
    setIsPopupOpen(false);
    localStorage.removeItem("token");
    navigate("/");
  };
  const handleLogoutCancel = () => setIsPopupOpen(false);

  const changePasswordPath = isAdmin ? "/admin/cambiar-contrasena" : (isEntrenador ? "/entrenador/cambiar-contrasena" : "/alumno/cambiar-contrasena");

  return (
    <>
      {/* Botón “Abrir” en mobile */}
      {/* <button
        className="hamburger-btn"
        onClick={() => setIsSidebarOpen(true)}
      >
        <MenuHamburguesaIcon
            className="icon"
            fill="#000000"
        />{" "}
      </button> */}

      {/* MOBILE NAVBAR: hamburguesa a la izquierda + logo centrado */}
      <header className="mobile-navbar">
        <button
          className="hamburger-btn"
          onClick={() => setIsSidebarOpen(prev => !prev)}
        >
          {isSidebarOpen
            ? <CloseIcon fill="#FAFAFA" width={35} height={35} />
            : <MenuHamburguesaIcon fill="#FAFAFA" width={20} height={20} />
          }
        </button>
        <img
          src={OurLogo}
          alt="Wembley Logo"
          className="mobile-logo"
        />
      </header>

      {/* Overlay semitransparente */}
      {isSidebarOpen && (
        <div
          className="overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Botón “Cerrar” en mobile */}
        {/* <button
          className="close-btn"
          onClick={() => setIsSidebarOpen(false)}
        >
          <CloseIcon width={40} height={40} fill="#FAFAFA" />
        </button> */}

        {/* Logo cliente */}
        <div className="sidebar-logo">
          <img
            src={OurLogo}
            alt="Wembley Logo"
            className="logo"
          />
          <div className="menu-divider" />
        </div>

        {/* Menú */}
        <nav className="sidebar-menu">
          <h3 className="menu-title">MENÚ</h3>
          <ul className="menu-list">
            {
              // SIDEBAR ADMIN
              isAdmin ? (
                <>
                  <Link
                    to="/admin/inicio"
                    className={`menu-link ${location.pathname === "/admin/inicio"
                      ? "active"
                      : ""
                      }`}
                  >
                    <li className="menu-item">
                      <InicioIcon className="icon" fill="#A2A2A2" />{" "}
                      Inicio
                    </li>
                  </Link>
                  <Link
                    to="/admin/turnos"
                    className={`menu-link ${location.pathname ===
                      "/admin/turnos"
                      ? "active"
                      : ""
                      }`}
                  >
                    <li className="menu-item">
                      <ClasesActividadesIcon
                        className="icon"
                        fill="#A2A2A2"
                      />{" "}
                      Turnos
                    </li>
                  </Link>
                  <Link
                    to="/admin/clases-actividades"
                    className={`menu-link ${location.pathname ===
                      "/admin/clases-actividades"
                      ? "active"
                      : ""
                      }`}
                  >
                    <li className="menu-item">
                      <ClasesActividadesIcon
                        className="icon"
                        fill="#A2A2A2"
                      />{" "}
                      Clases y actividades
                    </li>
                  </Link>
                  <Link
                    to="/admin/usuarios"
                    className={`menu-link ${location.pathname === "/admin/usuarios"
                      ? "active"
                      : ""
                      }`}
                  >
                    <li className="menu-item">
                      <UsuariosIcon
                        className="icon"
                        stroke="#A2A2A2"
                      />{" "}
                      Usuarios
                    </li>
                  </Link>
                  <Link
                    to="/admin/crear-usuario"
                    className={`menu-link ${location.pathname === "/admin/crear-usuario"
                      ? "active"
                      : ""
                      }`}
                  >
                    <li className="menu-item">
                      <CrearUsuarioIcon
                        className="icon"
                        stroke="#A2A2A2"
                      />{" "}
                      Crear usuario
                    </li>
                  </Link>
                  <Link
                    to="/admin/ejercicios"
                    className={`menu-link ${location.pathname === "/admin/ejercicios"
                      ? "active"
                      : ""
                      }`}
                  >
                    <li className="menu-item">
                      <DumbbellIcon
                        className="icon"
                        color="#A2A2A2"
                      />{" "}
                      Ejercicios
                    </li>
                  </Link>
                  <Link
                    to="/admin/asignar-rutinas"
                    className={`menu-link ${location.pathname === "/admin/asignar-rutinas" ? "active" : ""
                      }`}
                  >
                    <li className="menu-item">
                      <AsignarRutinaIcon className="icon" color="#A2A2A2" /> Asignar Rutinas
                    </li>
                  </Link>
                  <Link
                      to="/admin/rutinas-asignadas"
                      className={`menu-link ${location.pathname === "/admin/rutinas-asignadas" ? "active" : ""
                        }`}
                    >
                      <li className="menu-item">
                        <AsignarRutinaIcon className="icon" color="#A2A2A2" /> Rutinas Asignadas
                      </li>
                  </Link>
                  <Link
                    to="/admin/rutinas"
                    className={`menu-link ${location.pathname === "/admin/rutinas"
                      ? "active"
                      : ""
                      }`}
                  >
                    <li className="menu-item">
                      <MiRutinaIcon
                        className="icon"
                        color="#A2A2A2"
                      />{" "}
                      Rutinas recomendadas
                    </li>
                  </Link>
                  <Link
                    to="/admin/planes"
                    className={`menu-link ${location.pathname === "/admin/planes"
                      ? "active"
                      : ""
                      }`}
                  >
                    <li className="menu-item">
                      <PlanesIcon
                        className="icon"
                        stroke="#A2A2A2"
                      />{" "}
                      Planes
                    </li>
                  </Link>
                  <Link
                    to="/admin/cuotas"
                    className={`menu-link ${location.pathname === "/admin/cuotas"
                      ? "active"
                      : ""
                      }`}
                  >
                    <li className="menu-item">
                      <IngresosIcon
                        className="icon"
                        stroke="#A2A2A2"
                      />{" "}
                      Cuotas
                    </li>
                  </Link>
                </>
              )
                // SIDEBAR ENTRENADOR 
                : isEntrenador ? (
                  <>
                    <Link
                      to="/entrenador/inicio"
                      className={`menu-link ${location.pathname === "/entrenador/inicio" ? "active" : ""
                        }`}
                    >
                      <li className="menu-item">
                        <InicioIcon className="icon" fill="#A2A2A2" /> Inicio
                      </li>
                    </Link>
                    <Link
                      to="/entrenador/asignar-rutinas"
                      className={`menu-link ${location.pathname === "/entrenador/asignar-rutinas" ? "active" : ""
                        }`}
                    >
                      <li className="menu-item">
                        <AsignarRutinaIcon className="icon" color="#A2A2A2" /> Asignar Rutinas
                      </li>
                    </Link>
                    <Link
                      to="/entrenador/rutinas-asignadas"
                      className={`menu-link ${location.pathname === "/entrenador/rutinas-asignadas" ? "active" : ""
                        }`}
                    >
                      <li className="menu-item">
                        <MiRutinaIcon className="icon" color="#A2A2A2" /> Rutinas asignadas
                      </li>
                    </Link>
                    <Link
                      to="/entrenador/ejercicios"
                      className={`menu-link ${location.pathname === "/entrenador/ejercicios"
                        ? "active"
                        : ""
                        }`}
                    >
                      <li className="menu-item">
                        <DumbbellIcon
                          className="icon"
                          color="#A2A2A2"
                        />{" "}
                        Ejercicios
                      </li>
                    </Link>
                    <Link
                      to="/entrenador/usuarios"
                      className={`menu-link ${location.pathname === "/entrenador/usuarios" ? "active" : ""
                        }`}
                    >
                      <li className="menu-item">
                        <UsuariosIcon className="icon" fill="#A2A2A2" /> Usuarios
                      </li>
                    </Link>
                    <Link
                      to="/entrenador/clases-actividades"
                      className={`menu-link ${location.pathname === "/entrenador/clases-actividades" ? "active" : ""
                        }`}
                    >
                      <li className="menu-item">
                        <ClasesActividadesIcon className="icon" fill="#A2A2A2" /> Clases y actividades
                      </li>
                    </Link>
                  </>
                )
                  // SIDEBAR ALUMNO
                  : (
                    <>
                      <Link
                        to="/alumno/inicio"
                        className={`menu-link ${location.pathname === "/alumno/inicio"
                          ? "active"
                          : ""
                          }`}
                      >
                        <li className="menu-item">
                          <InicioIcon className="icon" fill="#A2A2A2" />{" "}
                          Inicio
                        </li>
                      </Link>
                      <Link
                        to="/alumno/turnos"
                        className={`menu-link ${location.pathname === "/alumno/turnos"
                          ? "active"
                          : ""
                          }`}
                      >
                        <li className="menu-item">
                          <MisTurnosIcon className="icon" /> Mis turnos
                        </li>
                      </Link>
                      <Link
                        to="/alumno/agendar-turno"
                        className={`menu-link ${location.pathname ===
                          "/alumno/agendar-turno"
                          ? "active"
                          : ""
                          }`}
                      >
                        <li className="menu-item">
                          <AgendarTurnoIcon className="icon" /> Agendar turno
                        </li>
                      </Link>
                      <Link
                        to="/alumno/clases-actividades"
                        className={`menu-link ${location.pathname ===
                          "/alumno/clases-actividades"
                          ? "active"
                          : ""
                          }`}
                      >
                        <li className="menu-item">
                          <ClasesActividadesIcon
                            className="icon"
                            fill="#A2A2A2"
                          />{" "}
                          Clases y actividades
                        </li>
                      </Link>
                      <Link
                        to="/alumno/mi-rutina"
                        className={`menu-link ${location.pathname === "/alumno/mi-rutina"
                          ? "active"
                          : ""
                          }`}
                      >
                        <li className="menu-item">
                          <MiRutinaIcon className="icon" color="#A2A2A2" /> Mi
                          rutina
                        </li>
                      </Link>
                      <Link
                        to="/alumno/ejercicios"
                        className={`menu-link ${location.pathname === "/alumno/ejercicios"
                          ? "active"
                          : ""
                          }`}
                      >
                        <li className="menu-item">
                          <DumbbellIcon
                            className="icon"
                            color="#A2A2A2"
                          />{" "}
                          Ejercicios
                        </li>
                      </Link>
                      <Link
                        to="/alumno/medicion-resultados"
                        className={`menu-link ${location.pathname ===
                          "/alumno/medicion-resultados"
                          ? "active"
                          : ""
                          }`}
                      >
                        <li className="menu-item">
                          <MedicionResultadosIcon className="icon" /> Medición
                          de ejercicios
                        </li>
                      </Link>
                      <Link
                        to="/alumno/entrenadores"
                        className={`menu-link ${location.pathname === "/alumno/entrenadores"
                          ? "active"
                          : ""
                          }`}
                      >
                        <li className="menu-item">
                          <EntrenadoresIcon className="icon" /> Entrenadores
                        </li>
                      </Link>
                      <Link
                        to="/alumno/rutinas-recomendadas"
                        className={`menu-link ${location.pathname ===
                          "/alumno/rutinas-recomendadas"
                          ? "active"
                          : ""
                          }`}
                      >
                        <li className="menu-item">
                          <RutinasRecomendadasIcon className="icon" /> Rutinas
                          recomendadas
                        </li>
                      </Link>
                      <Link
                        to="/alumno/cuotas"
                        className={`menu-link ${location.pathname ===
                          "/alumno/cuotas"
                          ? "active"
                          : ""
                          }`}
                      >
                        <li className="menu-item">
                          <IngresosIcon className="icon" /> Cuotas
                        </li>
                      </Link>
                    </>
                  )}
          </ul>

          <div className="profile-section">
            <h3 className="profile-title">PERFIL</h3>
            <ul className="menu-list">
              <Link
                to={changePasswordPath}
                className={`menu-link ${location.pathname === changePasswordPath ? "active" : ""
                  }`}
              >
                <li className="menu-item">
                  <AjustesIcon className="icon" fill="#A2A2A2" /> Cambiar contraseña
                </li>
              </Link>

              <li className="menu-item logout" onClick={handleLogoutClick}>
                <CerrarSesionIcon className="icon" fill="#CC8889" /> Cerrar sesión
              </li>
            </ul>
          </div>

          <div className="sidebar-footer">
            <img
              src={OurLogo}
              alt="GymHour Logo"
              className="logo"
            />
          </div>
        </nav>

        <ConfirmationPopup
          isOpen={isPopupOpen}
          onClose={handleLogoutCancel}
          onConfirm={handleLogoutConfirm}
          message="¿Estás seguro de que desea cerrar sesión?"
        />
      </aside>
    </>
  );
};

export default SidebarMenu;