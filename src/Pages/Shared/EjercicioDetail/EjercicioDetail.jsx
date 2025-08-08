import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-left.svg';
import './EjercicioDetail.css';
import apiService from '../../../services/apiService';

const EjercicioDetail = ({ fromAdmin, fromEntrenador, fromAlumno }) => {
    const { id } = useParams();
    const [ejercicio, setEjercicio] = useState(null);

    useEffect(() => {
        const fetchEjercicio = async () => {
            try {
                const { data } = await apiService.getEjercicioById(id);
                setEjercicio(data);
            } catch (error) {
                console.error("Error al cargar el ejercicio:", error);
            }
        };
        fetchEjercicio();
    }, [id]);

    if (!ejercicio) {
        return (
            <div className="page-layout">
                <SidebarMenu isAdmin={fromAdmin} isEntrenador={fromEntrenador} isAlumno={fromAlumno} />
                <div className="content-layout">
                    <p>Cargando ejercicio...</p>
                </div>
            </div>
        );
    }

    const backLink = fromAdmin
        ? "/admin/ejercicios"
        : fromEntrenador
            ? "/entrenador/ejercicios"
            : "/alumno/ejercicios";

    return (
        <div className="page-layout">
            <SidebarMenu isAdmin={fromAdmin} isEntrenador={fromEntrenador} isAlumno={fromAlumno} />
            <div className="content-layout ejercicio-detail">
                {/* Botón de regreso */}
                <SecondaryButton
                    text="Ejercicios"
                    linkTo={backLink}
                    icon={ArrowLeftIcon}
                    reversed
                />

                {/* Video / Media */}
                {ejercicio.youtubeUrl ? (
                    <div className="ejercicio-detail__media video">
                        <iframe
                            src={ejercicio.youtubeUrl.replace("watch?v=", "embed/")}
                            title={ejercicio.nombre}
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div
                        className="ejercicio-detail__media foto"
                        style={{ backgroundImage: `url(${ejercicio.mediaUrl})` }}
                    />
                )}

                {/* Datos principales */}
                <div className="ejercicio-detail__header">
                    <h1 className="header__title">{ejercicio.nombre}</h1>
                </div>

                {/* Descripción */}
                <section className="ejercicio-detail__section">
                    <h2>Descripción</h2>
                    <p>
                        {ejercicio.descripcion || 'No hay descripción disponible.'}
                    </p>
                </section>

                <section className="ejercicio-detail__section">
                    <h2>Instrucciones</h2>
                    {ejercicio.instrucciones ? (
                        <ol>
                            {ejercicio.instrucciones.split('\n').map((line, i) => (
                                <li key={i}>{line}</li>
                            ))}
                        </ol>
                    ) : (
                        <p>No hay instrucciones disponibles.</p>
                    )}
                </section>

                <section className="ejercicio-detail__section">
                    <h2>Músculos</h2>
                    <div className="chip-list">
                        {ejercicio.musculos?.split('-')
                            .filter(m => m.trim())
                            .map((m, i) => (
                                <span key={i} className="chip">{m.trim()}</span>
                            ))}
                    </div>
                </section>

                {/* Equipamiento */}
                <section className="ejercicio-detail__section">
                    <h2>Equipamiento</h2>
                    {ejercicio.equipamiento ? (
                        <div className="chip-list">
                            {ejercicio.equipamiento
                                .split('-')
                                .filter(item => item.trim())
                                .map((e, i) => (
                                    <span key={i} className="chip">{e.trim()}</span>
                                ))}
                        </div>
                    ) : (
                        <p>No hay equipamiento listado.</p>
                    )}
                </section>

            </div>
        </div>
    );
};

export default EjercicioDetail;