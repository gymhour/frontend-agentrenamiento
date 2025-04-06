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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const [clasesData, turnosData] = await Promise.all([
                    apiService.getClases(),
                    apiService.getTurnos()
                ]);
    
                setClases(clasesData);
                setTurnos(turnosData);
                setLoading(false);
            } catch (err) {
                setError("Error al cargar las clases y turnos. Intente nuevamente.");
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    // Ordenar los turnos por fecha de forma descendente (más reciente primero)
    const latestTurnos = [...turnos]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 3);

    return(
        <div className='page-layout'>
            {loading && <LoaderFullScreen/> }
            <SidebarMenu isAdmin={false}/>
            <div className='content-layout'>
                <div className="turnos-ctn">
                    <div className="turnos-ctn-title">
                        <h2> Últimos turnos </h2>
                        <SecondaryButton linkTo="/alumno/turnos" text="Ver historial" icon={ArrowLeftIcon} />
                    </div>
                    <div className="turnos-ctn-turnos">
                        {error ? (
                            <p className="error-message">{error}</p>
                        ) : latestTurnos.length > 0 ? (
                            latestTurnos.map((turno) => (
                                <TurnosCard 
                                    key={turno.ID_Turno} 
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
                        <h2> Clases y actividades </h2>
                        <SecondaryButton linkTo="/alumno/clases-actividades" text="Ver todas" icon={ArrowLeftIcon} />
                    </div>
                    {error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <div className="clases-list">
                            {clases.length > 0 ? (
                                clases.slice(0, 3).map((clase) => (  // Limitar a 3 clases
                                    <ClasesActividadesCard key={clase.ID_Clase} clase={clase} />
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