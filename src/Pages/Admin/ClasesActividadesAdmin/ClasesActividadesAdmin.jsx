import React, { useState, useEffect } from "react";
import '../../../App.css';
import './clasesActividadesAdmin.css'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from "../../../Components/utils/SecondaryButton/SecondaryButton";
import { ReactComponent as AddIconCircle } from '../../../assets/icons/add-circle.svg';
import { Link } from "react-router-dom";
import apiClient from "../../../axiosConfig";

const ClasesActividadesAdmin = () => {
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
            <SidebarMenu isAdmin={true} />
            <div className='content-layout'>
                <div className="clases-actividades-ctn">
                    <div className="create-clase-title">
                        <h2>Clases y actividades</h2>
                        <SecondaryButton text="Agregar" linkTo="/admin/agregar-clase" icon={AddIconCircle}></SecondaryButton>
                    </div>
                    {loading ? (
                        <p style={{ marginTop: '20px' }}>Cargando clases...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        <div className="clases-list">
                            {clases.length > 0 ? (
                                clases.map((clase) => (
                                    <Link
                                        key={clase.ID_Clase}
                                        to={`/admin/clases-actividades/${clase.ID_Clase}`}
                                        className="clase-link"
                                    >
                                        <div className="clase-item" style={{
                                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${clase.ImagenesClase.length > 0
                                                ?  `https://gymbackend-qr97.onrender.com${clase.ImagenesClase[0].url}`
                                                : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGhlJTIwZ3ltfGVufDB8fDB8fHww'})`
                                        }}>
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
        </div>
    );
};

export default ClasesActividadesAdmin;
