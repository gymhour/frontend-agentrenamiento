import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../App.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-left.svg';
import './clasesActividadesDetalle.css'

const ClasesActividadesDetalle = () => {
    const { id } = useParams();
    const [claseDetalle, setClaseDetalle] = useState(null);

    useEffect(() => {
        const fetchClaseDetalle = async () => {
            try {
                const response = await axios.get(`https://gymbackend-qr97.onrender.com/clase/horario/${id}`);
                // console.log(response.data);
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
                        <div className="clases-actividades-detalle-title-img" >
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
                        <div className="clases-actividades-item clases-actividades-detalle-info-instructores">
                            <h2> Instructores </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClasesActividadesDetalle;
