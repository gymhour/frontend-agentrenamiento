// TODO: diseñar más lindas las cards
import React, { useState, useEffect } from 'react';
import './clasesActividades.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import { Link } from 'react-router-dom';
import apiClient from '../../../axiosConfig';

const ClasesActividades = () => {
    const [clases, setClases] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClases = async () => {
            try {
                const response = await apiClient.get("https://gymbackend-qr97.onrender.com/clase/horario");
                setClases(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error al cargar las clases. Intente nuevamente.");
                setLoading(false);
            }
        };

        fetchClases();
    }, []);

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };

    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={false} />
            <div className='content-layout'>
                <h1>Clases y actividades</h1>
                {loading ? (
                    <p style={{marginTop: '20px'}}>Cargando clases...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                <div className="clases-list">
                    {clases.length > 0 ? (
                        clases.map((clase) => (
                            <Link 
                                key={clase.ID_Clase} 
                                to={`/alumno/clases-actividades/${clase.ID_Clase}`}
                                className="clase-link"
                            >
                                {/* style={{ backgroundImage: `url(${clase.imagen})`}} */}
                                <div className="clase-item">
                                    <h2>{clase.nombre}</h2>
                                    <p>{truncateText(clase.descripcion, 80)}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>No hay clases disponibles.</p>
                    )}
                </div>
                )}
            </div>
        </div>
    );
};

export default ClasesActividades;
