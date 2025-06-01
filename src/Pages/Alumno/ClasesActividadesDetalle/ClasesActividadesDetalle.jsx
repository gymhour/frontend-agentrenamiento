import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../App.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-left.svg';
import './clasesActividadesDetalle.css'
import apiClient from '../../../axiosConfig';

const ClasesActividadesDetalle = () => {
    const { id } = useParams();
    const [claseDetalle, setClaseDetalle] = useState(null);
    const defaultAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s";

    useEffect(() => {
        const fetchClaseDetalle = async () => {
            try {
                const response = await apiClient.get(`/clase/horario/${id}`);
                console.log(response.data);
                setClaseDetalle(response.data);
            } catch (error) {
                console.error("Error al obtener los detalles de la clase:", error);
            }
        };

        fetchClaseDetalle();
    }, [id]);

    if (!claseDetalle) {
        return (
            <div className='page-layout'>
                <SidebarMenu isAdmin={false} />
                <div className='content-layout'>
                    <p>Cargando detalles de la clase...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={false} />
            <div className='content-layout'>
                <div className="clases-actividades-detalle-ctn">
                    <div className="clases-actividades-detalle-title">
                        <SecondaryButton
                            text="Clases y actividades"
                            linkTo="/alumno/clases-actividades"
                            icon={ArrowLeftIcon}
                            reversed={true}
                        />
                        {/* style={{ backgroundImage: `url(${claseDetalle.imagen})`}} */}
                        <div className="clases-actividades-detalle-title-img" style={{
                            backgroundImage: `url(${claseDetalle.imagenClase != null
                                ? claseDetalle.imagenClase
                                : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGhlJTIwZ3ltfGVufDB8fDB8fHww'})`
                        }}>
                            <h2>{claseDetalle.nombre}</h2>
                        </div>
                    </div>
                    <div className="clases-actividades-detalle-info">
                        <div className="clases-actividades-item clases-actividades-detalle-info-descripcion">
                            <h2> Descripción </h2>
                            <p> {claseDetalle.descripcion}</p>
                        </div>
                        <div className="clases-actividades-item clases-actividades-detalle-info-horario">
                            <h2> Horarios </h2>
                            {claseDetalle.HorariosClase.length > 0 ? (
                                <ul>
                                    {claseDetalle.HorariosClase.map((horario) => (
                                        <li key={horario.ID_HorarioClase}>
                                            {horario.diaSemana} de {new Date(horario.horaIni).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} a {new Date(horario.horaFin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay horarios disponibles.</p>
                            )}
                        </div>

                        {/* Instructores */}
                        <div className="clases-actividades-item clases-actividades-detalle-info-instructores">
                            <h2>Instructores</h2>
                            {claseDetalle.Entrenadores && claseDetalle.Entrenadores.length > 0 ? (
                                <ul className='listado-entrenadores'>
                                    {claseDetalle.Entrenadores.map(ent => (
                                        <li key={ent.ID_Usuario}>
                                             <div className="usuarios-table-userimage" style={{
                                                    backgroundImage: `url(${ent.imagenUsuario ? ent.imagenUsuario : defaultAvatar})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}></div>
                                            {ent.nombre} {ent.apellido} {ent.profesion && `– ${ent.profesion}`}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay instructores asignados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClasesActividadesDetalle;
