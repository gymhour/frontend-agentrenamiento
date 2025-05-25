import React, { useState, useEffect } from 'react';
import '../../../App.css';
import './alumnoInicio.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { ReactComponent as AddIconCircle } from '../../../assets/icons/add-circle.svg';
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-left.svg';
import TurnosCard from '../../../Components/TurnosCard/TurnosCard';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import apiService from '../../../services/apiService';
import ClasesActividadesCard from '../ClasesActividadesCard/ClasesActividadesCard';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';

const AlumnoInicio = () => {
    const [clases, setClases] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const usuarioId = localStorage.getItem("usuarioId");
                const [clasesData, turnosData, usuarioData] = await Promise.all([
                    apiService.getClases(),
                    apiService.getTurnosUsuario(usuarioId),
                    apiService.getUserById(usuarioId),
                ]);
                setClases(clasesData);
                setTurnos(turnosData);
                setNombreUsuario(usuarioData.nombre + " " + usuarioData.apellido)
                console.log("Info usuario", usuarioData);
                setError("");
            } catch {
                setError("Error al cargar los datos. Intente nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const latestTurnos = [...turnos]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 3);

    return (
        <div className='page-layout'>
            {loading && <LoaderFullScreen />}
            <SidebarMenu isAdmin={false} />
            <div className='content-layout'>
                <div className="inicio-bienvenida-ctn">
                    <h2> ¡Hola, {nombreUsuario}! </h2>
                </div>
                <div className="turnos-ctn">
                    <div className="turnos-ctn-title">
                        <h3> Últimos turnos </h3>
                        <SecondaryButton linkTo="/alumno/turnos" text="Ver historial" icon={ArrowLeftIcon} />
                    </div>
                    <div className="turnos-ctn-turnos">
                        {error ? (
                            <p className="error-message">{error}</p>
                        ) : latestTurnos.length > 0 ? (
                            latestTurnos.map((turno, index) => (
                                <TurnosCard
                                    key={`${turno.ID_Turno}_${index}`}
                                    nombreTurno={turno.HorarioClase.Clase.nombre}
                                    fechaTurno={turno.fecha}
                                    horaTurno={turno.hora}
                                />
                            ))
                        ) : (
                            <p>No tienes ningún turno</p>
                        )}
                    </div>
                    <PrimaryButton linkTo="/alumno/agendar-turno" text="Agregar nuevo" icon={AddIconCircle} />
                </div>
                <div className="inicio-clases-act-ctn">
                    <div className="inicio-clases-act-title">
                        <h3> Clases y actividades </h3>
                        <SecondaryButton linkTo="/alumno/clases-actividades" text="Ver todas" icon={ArrowLeftIcon} />
                    </div>
                    {error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <div className="clases-list">
                            {clases.length > 0 ? (
                                clases.slice(0, 3).map((clase, index) => (  // Limitar a 3 clases
                                    <ClasesActividadesCard key={`${clase.ID_Clase}_${index}`} clase={clase} />
                                ))
                            ) : (
                                <p>No hay clases disponibles.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AlumnoInicio;