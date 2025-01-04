import React, { useEffect, useState } from "react";
import '../../../App.css';
import './clasesActividadesForm.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from "../../../Components/utils/SecondaryButton/SecondaryButton";
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-left.svg';
import { ReactComponent as AddIconCircle } from '../../../assets/icons/add-circle.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/close.svg';
import { useParams } from "react-router-dom";
import apiClient from "../../../axiosConfig";

const ClasesActividadesForm = ({ isEditing, classId }) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [image, setImage] = useState(null);
    const [horarios, setHorarios] = useState([{ diaSemana: "", horaIni: "", horaFin: "", cupos: "" }]);
    const [message, setMessage] = useState("");
    const { id } = useParams();

    useEffect(() => {
        if (isEditing) {
            const fetchClaseDetalle = async () => {
                try {
                    // Llamada a la API para obtener detalles de la clase
                    const response = await apiClient.get(`https://gymbackend-qr97.onrender.com/clase/horario/${id}`);
                    const { nombre, descripcion, horarios, image } = response.data;

                    // Rellenar los estados con los datos de la API
                    setNombre(nombre || "");
                    setDescripcion(descripcion || "");
                    setHorarios(horarios || [{ diaSemana: "", horaIni: "", horaFin: "", cupos: "" }]);
                    setImage(image || null);
                } catch (error) {
                    console.error("Error al obtener los detalles de la clase:", error);
                }
            };

            fetchClaseDetalle();
        }
    }, [isEditing, classId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };    

    const handleAddHorario = () => {
        setHorarios([...horarios, { diaSemana: "", horaIni: "", horaFin: "", cupos: "" }]);
    };

    const handleRemoveHorario = (index) => {
        const updatedHorarios = horarios.filter((_, i) => i !== index);
        setHorarios(updatedHorarios);
    };

    const handleHorarioChange = (e, index) => {
        const { name, value } = e.target;
        const updatedHorarios = [...horarios];
        updatedHorarios[index][name] = value;
        setHorarios(updatedHorarios);
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let time = 0; time < 24 * 60; time += 30) {
            const hours = String(Math.floor(time / 60)).padStart(2, '0');
            const minutes = String(time % 60).padStart(2, '0');
            slots.push(`${hours}:${minutes}`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const requestBody = {
    //         nombre: nombre,
    //         descripcion: descripcion,
    //         horarios: horarios.map((horario) => ({
    //             diaSemana: horario.diaSemana,
    //             horaIni: horario.horaIni,
    //             horaFin: horario.horaFin,
    //             cupos: Number(horario.cupos)
    //         })),
    //         image: image
    //     };

    //     console.log("Body:", JSON.stringify(requestBody, null, 2));

    //     try {
    //         if (isEditing) {
    //             // Editar clase
    //             await apiClient.put(`https://gymbackend-qr97.onrender.com/clase/horario/${id}`, requestBody, {
    //                 headers: { "Content-Type": "application/json" },
    //             });
    //             setMessage("Clase actualizada exitosamente.");
    //         } else {
    //             console.log("Enviado correctamente");
    //             // Agregar clase
    //             // await apiClient.post("https://gymbackend-qr97.onrender.com/clase/horario", requestBody, {
    //             //     headers: { "Content-Type": "application/json" },
    //             // });
    //             // setMessage("Clase creada exitosamente.");
    //             // resetForm();
    //         }
    //     } catch (error) {
    //         if (error.response?.status === 400) {
    //             setMessage(error.response?.data?.message || "Error en los datos proporcionados.");
    //         } else {
    //             setMessage("Hubo un error en el servidor.");
    //         }
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const transformedHorarios = horarios.map((horario) => ({
            ...horario,
            horaIni: `2024-01-03T${horario.horaIni}:00Z`, // Ejemplo de fecha fija
            horaFin: `2024-01-03T${horario.horaFin}:00Z`,
            cupos: Number(horario.cupos), // Asegurar que cupos sea un número
        }));
    
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);
        if (image) {
            formData.append("image", image); // Adjuntar el archivo si existe
        }
        formData.append("horarios", JSON.stringify(transformedHorarios)); // Convertir horarios a JSON
    
        try {
            if (isEditing) {
                // Editar clase
                await apiClient.put(`https://gymbackend-qr97.onrender.com/clase/horario/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setMessage("Clase actualizada exitosamente.");
            } else {
                // Agregar clase
                await apiClient.post("https://gymbackend-qr97.onrender.com/clase/horario", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setMessage("Clase creada exitosamente.");
                resetForm();
            }
        } catch (error) {
            if (error.response?.status === 400) {
                setMessage(error.response?.data?.message || "Error en los datos proporcionados.");
            } else {
                setMessage("Hubo un error en el servidor.");
            }
        }
    };
    
    
    
    const resetForm = () => {
        setNombre("");
        setDescripcion("");
        setImage(null);
        setHorarios([{ diaSemana: "", horaIni: "", horaFin: "", cupos: "" }]);
    };

    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={true} />
            <div className='content-layout'>
                <div className="clases-actividades-form-ctn">
                    <div className="clases-actividades-form-title">
                        <SecondaryButton text="Volver atrás" linkTo="/admin/clases-actividades" icon={ArrowLeftIcon} reversed={true}></SecondaryButton>
                        <h2> {isEditing ? 'Editar clase o actividad' : 'Crear nueva clase o actividad'} </h2>
                    </div>
                    <div className="create-clase-form">
                        <form encType="multipart/form-data">
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
                            <div className="form-input-ctn">
                                <label htmlFor="imagen">Imagen:</label>
                                <input
                                    type="file"
                                    id="imagen"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="form-input-horarios">
                                <label>Horarios:</label>
                                {horarios.map((horario, index) => (
                                    <div key={index}>
                                        <div className="horario-item">
                                            <div className="form-input-ctn-horario">
                                                <label> Dia de la semana </label>
                                                <select
                                                    name="diaSemana"
                                                    value={horario.diaSemana}
                                                    onChange={(e) => handleHorarioChange(e, index)}
                                                    required
                                                >
                                                    <option value="">Seleccionar día</option>
                                                    <option value="Lunes">Lunes</option>
                                                    <option value="Martes">Martes</option>
                                                    <option value="Miércoles">Miércoles</option>
                                                    <option value="Jueves">Jueves</option>
                                                    <option value="Viernes">Viernes</option>
                                                    <option value="Sábado">Sábado</option>
                                                    <option value="Domingo">Domingo</option>
                                                </select>
                                            </div>
                                            <div className="form-input-ctn-horario">
                                                <label>Horario de inicio</label>
                                                <select
                                                    name="horaIni"
                                                    value={horario.horaIni}
                                                    onChange={(e) => handleHorarioChange(e, index)}
                                                    required
                                                >
                                                    <option value="">Seleccionar horario</option>
                                                    {timeSlots.map((time, idx) => (
                                                        <option key={idx} value={time}>
                                                            {time}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-input-ctn-horario">
                                                <label>Horario de fin</label>
                                                <select
                                                    name="horaFin"
                                                    value={horario.horaFin}
                                                    onChange={(e) => handleHorarioChange(e, index)}
                                                    required
                                                >
                                                    <option value="">Seleccionar horario</option>
                                                    {timeSlots.map((time, idx) => (
                                                        <option key={idx} value={time}>
                                                            {time}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-input-ctn-horario">
                                                <label> Cupos disponibles </label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    name="cupos"
                                                    placeholder="Cupos"
                                                    value={horario.cupos}
                                                    onChange={(e) => handleHorarioChange(e, index)}
                                                    required
                                                />
                                            </div>
                                            <CloseIcon onClick={() => handleRemoveHorario(index)} className='close-icon' />
                                        </div>
                                    </div>
                                ))}
                                <SecondaryButton text="Agregar horario" icon={AddIconCircle} onClick={handleAddHorario} />
                            </div>
                            <button type="submit" className="submit-btn" onClick={handleSubmit}>{isEditing ? "Guardar cambios" : "Crear Clase"}</button>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClasesActividadesForm;
