import React, { useState } from "react";
import axios from "axios";
import '../../../App.css';
import './clasesActividades.css'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';

const ClasesActividadesAdmin = () => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://gymbackend-qr97.onrender.com/clase", {
                nombre,
                descripcion,
            });
            setMessage("Clase creada exitosamente.");
            setNombre("");
            setDescripcion("");
        } catch (error) {
            if (error.response?.status === 400) {
                setMessage(error.response?.data?.message || "Error en los datos proporcionados.");
            } else {
                setMessage("Hubo un error en el servidor.");
            }
        }
    };

    return (
        <div className='page-layout'>
        <SidebarMenu isAdmin={true}/>
        <div className='content-layout'>
        <div className="create-clase-form">
            <h2>Crear nueva clase o actividad</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-input-ctn">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="form-input-ctn">
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Crear Clase</button>
            </form>
            {message && <p>{message}</p>}
        </div>
        </div>            
    </div>
    );
};

export default ClasesActividadesAdmin;
