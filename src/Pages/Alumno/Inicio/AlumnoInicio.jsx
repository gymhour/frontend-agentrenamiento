import React, { useState, useEffect } from 'react';
import '../../../App.css';
import './alumnoInicio.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { ReactComponent as AddIconCircle } from '../../../assets/icons/add-circle.svg';
import { ReactComponent as ArrowRightIcon } from '../../../assets/icons/arrow-right.svg';
import TurnosCard from '../../../Components/TurnosCard/TurnosCard';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import apiService from '../../../services/apiService';
import ClasesActividadesCard from '../ClasesActividadesCard/ClasesActividadesCard';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp';
// ToastContainer
import { toast } from 'react-toastify';

const AlumnoInicio = () => {
    const [clases, setClases] = useState([]);
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [turnoToCancel, setTurnoToCancel] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const usuarioId = localStorage.getItem('usuarioId');
                const [clasesData, turnosData, usuarioData] = await Promise.all([
                    apiService.getClases(),
                    apiService.getTurnosUsuario(usuarioId),
                    apiService.getUserById(usuarioId),
                ]);
                setClases(clasesData);
                setTurnos(turnosData);
                setNombreUsuario(`${usuarioData.nombre} ${usuarioData.apellido}`);
                setError('');
            } catch (err) {
                console.error(err);
                setError('Error al cargar los datos. Intente nuevamente.');
                toast.error('Error al cargar los datos. Intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    // Abrir confirmation popup
    const handleOpenCancelPopup = (id) => {
        setTurnoToCancel(id);
        setIsPopupOpen(true);
    };

    // Confirmar cancelación
    const handleConfirmCancellation = async () => {
        setIsPopupOpen(false);
        setLoading(true);
        try {
            await apiService.deleteTurno(turnoToCancel);
            setTurnos((prev) => prev.filter((t) => t.id_turno !== turnoToCancel));
            toast.success('Turno cancelado exitosamente.');
            setError('');
        } catch (err) {
            console.error(err);
            setError('Error al cancelar el turno. Por favor, inténtalo nuevamente.');
            toast.error('Error al cancelar el turno. Por favor, inténtalo nuevamente.');
        } finally {
            setLoading(false);
            setTurnoToCancel(null);
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setTurnoToCancel(null);
    };

    const latestTurnos = [...turnos]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 3);

    return (
        <div className="page-layout">
            {loading && <LoaderFullScreen />}
            <SidebarMenu isAdmin={false} />
            <div className="content-layout">
                <div className="inicio-bienvenida-ctn">
                    <h2> ¡Hola, {nombreUsuario}! </h2>
                </div>
                <div className="turnos-ctn">
                    <div className="turnos-ctn-title">
                        <h3> Últimos turnos </h3>
                        <SecondaryButton linkTo="/alumno/turnos" text="Ver historial" icon={ArrowRightIcon} />
                    </div>
                    <div className="turnos-ctn-turnos">
                        {error ? (
                            <p className="error-message">{error}</p>
                        ) : latestTurnos.length > 0 ? (
                            latestTurnos.map((turno, index) => (
                                <TurnosCard
                                    key={`${turno.id_turno}_${index}`}
                                    id={turno.id_turno}
                                    nombreTurno={turno.HorarioClase.Clase.nombre}
                                    fechaTurno={turno.fecha}
                                    horaTurno={turno.hora}
                                    onCancelTurno={() => handleOpenCancelPopup(turno.id_turno)}
                                />
                            ))
                        ) : (
                            <p>No tienes ningún turno</p>
                        )}
                    </div>
                    <div className="turnos-ctn-btn-agendar-nuevo">
                        <PrimaryButton linkTo="/alumno/agendar-turno" text="Agendar nuevo" icon={AddIconCircle} />
                    </div>
                </div>
                <div className="inicio-clases-act-ctn">
                    <div className="inicio-clases-act-title">
                        <h3> Clases y actividades </h3>
                        <SecondaryButton linkTo="/alumno/clases-actividades" text="Ver todas" icon={ArrowRightIcon} />
                    </div>
                    {error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <div className="clases-list">
                            {clases.length > 0 ? (
                                clases.slice(0, 3).map((clase, index) => (
                                    <ClasesActividadesCard key={`${clase.ID_Clase}_${index}`} clase={clase} />
                                ))
                            ) : (
                                <p>No hay clases disponibles.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationPopup
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                onConfirm={handleConfirmCancellation}
                message="¿Estás seguro de que deseas cancelar este turno?"
            />
            {/* <ToastContainer theme="dark" /> */}
        </div>
    );
};

export default AlumnoInicio;