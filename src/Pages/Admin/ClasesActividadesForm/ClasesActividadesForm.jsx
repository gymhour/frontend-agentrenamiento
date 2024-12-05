import React, { useState } from "react";
import axios from "axios";
import '../../../App.css';
import './clasesActividadesForm.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from "../../../Components/utils/SecondaryButton/SecondaryButton";
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-left.svg';
import { ReactComponent as AddIconCircle } from '../../../assets/icons/add-circle.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/close.svg';

const ClasesActividadesForm = () => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [image, setImage] = useState(null);
    const [horarios, setHorarios] = useState([{ diaSemana: "", horaIni: "", horaFin: "", cupos: "", cuposActuales: "" }]);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);
        formData.append("imagen", image);

        horarios.forEach((horario, index) => {
            formData.append(`horarios[${index}].diaSemana`, horario.diaSemana);
            formData.append(`horarios[${index}].horaIni`, horario.horaIni);
            formData.append(`horarios[${index}].horaFin`, horario.horaFin);
            formData.append(`horarios[${index}].cupos`, horario.cupos);
            formData.append(`horarios[${index}].cuposActuales`, horario.cuposActuales);
        });

        try {
            // Sacar cupos actuales
            // Si es periodica, le paso la hora como string.
            // Si es especifica, le paso un dia y hora como Datetime

            // SE TIENE QUE ENVIAR ASI
            // {
            //     "nombre": "Boxeo",
            //     "descripcion": "Te cagas a palooo.",
            //     "horarios": [
            //     En horaIni y horaFin la fecha es la del dia de hoy y la hora la seleccionada en los dropdown
            //       {
            //         "diaSemana": "Martes",
            //         "horaIni": "2024-11-14T17:00:00.000Z",
            //         "horaFin": "2024-11-14T18:00:00.000Z",
            //         "cupos": 20,
            //       },
            //       {
            //         "diaSemana": "Jueves",
            //         "horaIni": "2024-11-14T20:00:00.000Z",
            //         "horaFin": "2024-11-14T21:00:00.000Z",
            //         "cupos": 22,
            //       }
            //     ]
            //   }


            const response = await axios.post("https://gymbackend-qr97.onrender.com/clase/horario", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage("Clase creada exitosamente.");
            setNombre("");
            setDescripcion("");
            setImage(null);
            setHorarios([{ diaSemana: "", horaIni: "", horaFin: "", cupos: "", cuposActuales: "" }]);
        } catch (error) {
            if (error.response?.status === 400) {
                setMessage(error.response?.data?.message || "Error en los datos proporcionados.");
            } else {
                setMessage("Hubo un error en el servidor.");
            }
        }
    };

    const handleAddHorario = () => {
        setHorarios([...horarios, { diaSemana: "", horaIni: "", horaFin: "", cupos: "", cuposActuales: "" }]);
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
        const start = 0; // Empieza a las 00:00
        const end = 24 * 60; // 24 horas en minutos
    
        for (let time = start; time < end; time += 30) {
            const hours = String(Math.floor(time / 60)).padStart(2, '0');
            const minutes = String(time % 60).padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            slots.push(formattedTime);
        }
    
        return slots;
    };
    
    const timeSlots = generateTimeSlots();

    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={true} />
            <div className='content-layout'>
                <div className="clases-actividades-form-ctn">
                    <div className="clases-actividades-form-title">
                        <SecondaryButton text="Volver atrás" linkTo="/admin/clases-actividades" icon={ArrowLeftIcon} reversed={true}></SecondaryButton>
                        <h2>Crear nueva clase o actividad</h2>
                    </div>
                    <div className="create-clase-form">
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                                    onChange={(e) => setImage(e.target.files[0])}
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
                                                    name="cupos"
                                                    placeholder="Cupos"
                                                    value={horario.cupos}
                                                    onChange={(e) => handleHorarioChange(e, index)}
                                                    required
                                                />
                                            </div>

                                            {/* <div className="form-input-ctn-horario">
                                                <label> Cupos actuales</label>
                                                <input
                                                    type="number"
                                                    name="cuposActuales"
                                                    placeholder="Cupos actuales"
                                                    value={horario.cuposActuales}
                                                    onChange={(e) => handleHorarioChange(e, index)}
                                                    required
                                                />
                                            </div> */}

                                            <CloseIcon onClick={() => handleRemoveHorario(index)} className='close-icon'/>
                                        </div>
                                    </div>
                                ))}
                                <SecondaryButton text="Agregar horario" icon={AddIconCircle} onClick={handleAddHorario} />
                            </div>
                            <button type="submit" className="submit-btn">Crear Clase</button>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClasesActividadesForm;
