// TODO: diseñar mas lindas las cards
import React, { useState, useEffect } from 'react';
import './clasesActividades.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import axios from 'axios';

const ClasesActividades = () => {
    const [clases, setClases] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClases = async () => {
            try {
                const response = await axios.get("https://gymbackend-qr97.onrender.com/clase");
                setClases(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error al cargar las clases. Intente nuevamente.");
                setLoading(false);
            }
        };

        fetchClases();
    }, []);

    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={false} />
            <div className='content-layout'>
                <h1>Clases y actividades</h1>
                {loading ? (
                    <p>Cargando clases...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="clases-list">
                        {clases.length > 0 ? (
                            clases.map((clase) => (
                                <div key={clase.id} className="clase-item">
                                    <h2>{clase.nombre}</h2>
                                    <p>{clase.descripcion}</p>
                                </div>
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
