import React, { useState, useEffect } from 'react';
import './clasesActividades.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import ClasesActividadesCard from '../ClasesActividadesCard/ClasesActividadesCard';
import apiClient from '../../../axiosConfig';
import apiService from '../../../services/apiService';

const ClasesActividades = () => {
    const [clases, setClases] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        const fetchClases = async () => {
            try {
                const clases = await apiService.getClases()
                setClases(clases);
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
                    <p style={{ marginTop: '20px' }}>Cargando clases...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="clases-list">
                        {clases.length > 0 ? (
                            clases.map((clase) => (
                                <ClasesActividadesCard key={clase.ID_Clase} clase={clase} />
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