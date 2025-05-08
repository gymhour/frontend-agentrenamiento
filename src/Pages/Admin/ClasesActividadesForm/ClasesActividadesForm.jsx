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
import apiService from "../../../services/apiService";
import CustomDropdown from "../../../Components/utils/CustomDropdown/CustomDropdown";

const ClasesActividadesForm = ({ isEditing, classId }) => {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [image, setImage] = useState(null);
    const [horarios, setHorarios] = useState([{ diaSemana: "", horaIni: "", horaFin: "", cupos: "" }]);
    const [message, setMessage] = useState("");
    const [entrenadores, setEntrenadores] = useState([]);
    const [selectedEntrenadores, setSelectedEntrenadores] = useState([]);
    const [dropdownValue, setDropdownValue] = useState("");
    const { id } = useParams();

    useEffect(() => {
        if (isEditing) {
            const fetchClaseDetalle = async () => {
                try {
                    // Llamada a la API para obtener detalles de la clase
                    const response = await apiClient.get(`/clase/horario/${id}`);
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

        const fetchEntrenadores = async () => {
            try {
                const resp = await apiService.getEntrenadores();
                setEntrenadores(resp.data ?? resp);
            } catch (error) {
                console.error("Error al obtener los entrenadores", error);
            }
        };
        fetchEntrenadores();
    }, [isEditing, id]);

    const handleSelectEntrenador = (nombre) => {
        const ent = entrenadores.find(e => e.nombre === nombre);
        if (!ent) {
            console.warn("No se encontró ningún entrenador con ese nombre");
            return;
        }
        // Comprobamos si ya estaba seleccionado
        const yaSeleccionado = selectedEntrenadores.some(s => s.ID_Usuario === ent.ID_Usuario);
        if (!yaSeleccionado) {
            setSelectedEntrenadores(prev => {
                const nuevo = [...prev, ent];
                // console.log("selectedEntrenadores ahora es:", nuevo);
                return nuevo;
            });
        }
    };

    const handleRemoveEntrenador = (ID_Usuario) => {
        setSelectedEntrenadores((prev) =>
            prev.filter((e) => e.ID_Usuario !== ID_Usuario)
        );
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();
      
        // Transformar horarios
        const transformedHorarios = horarios.map(h => ({
          ...h,
          horaIni: `2024-01-03T${h.horaIni}:00Z`,
          horaFin: `2024-01-03T${h.horaFin}:00Z`,
          cupos: Number(h.cupos),
        }));
      
        // Armar formData
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("descripcion", descripcion);
        if (image) formData.append("image", image);
        formData.append("horarios", JSON.stringify(transformedHorarios));
      
        // IDs de entrenadores seleccionados
        const entrenadorIds = selectedEntrenadores.map(e => e.ID_Usuario);
        formData.append("entrenadores", JSON.stringify(entrenadorIds));
      
        if (isEditing) {
          // PUT (edición) puede seguir con async/await o then, según prefieras
          apiClient.put(`/clase/horario/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          .then(() => setMessage("Clase actualizada exitosamente."))
          .catch(err => setMessage("Error actualizando clase"));
        } else {
          // POST + then()
          apiClient.post("/clase/horario", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          .then(response => {
            const idClase = response.data.clase.ID_Clase;
            // Disparo todas las asignaciones en paralelo
            return Promise.all(
              entrenadorIds.map(idEntr => 
                apiService.addEntrenadorToClase(idClase, idEntr)
              )
            );
          })
          .then(() => {
            setMessage("Clase creada y entrenadores asignados exitosamente.");
            resetForm();
          })
          .catch(error => {
            console.error(error);
            setMessage("Hubo un error en la creación o asignación.");
          });
        }
      };
      

    const resetForm = () => {
        setNombre("");
        setDescripcion("");
        setImage(null);
        setHorarios([{ diaSemana: "", horaIni: "", horaFin: "", cupos: "" }]);
        setSelectedEntrenadores([]);
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
                        <form encType="multipart/form-data" onSubmit={handleSubmit}>
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

                            {/* Descripción */}
                            <div className="form-input-ctn">
                                <label htmlFor="descripcion">Descripción:</label>
                                <textarea
                                    id="descripcion"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Imagen */}
                            <div className="form-input-ctn">
                                <label htmlFor="imagen">Imagen:</label>
                                <input
                                    type="file"
                                    id="imagen"
                                    onChange={handleImageChange}
                                />
                            </div>

                            {/* Entrenadores */}
                            <div className="form-input-ctn">
                                <label htmlFor="entrenadores">Entrenadores:</label>
                                <CustomDropdown
                                    id="entrenadores"
                                    name="entrenadores"
                                    options={entrenadores.filter(e => e.nombre).map(e => e.nombre)}
                                    placeholderOption="Seleccionar entrenador"
                                    value={dropdownValue}
                                    onChange={(e) => {
                                        const nombre = e.target.value;
                                        handleSelectEntrenador(nombre);
                                        setDropdownValue("");
                                    }}
                                />
                                <div className="selected-tags">
                                    {selectedEntrenadores.map((ent) => (
                                        <div key={ent.ID_Usuario} className="tag">
                                            <span>{ent.nombre}</span>
                                            <CloseIcon
                                                className="tag-close"
                                                width={30}
                                                height={30}
                                                onClick={() =>
                                                    handleRemoveEntrenador(ent.ID_Usuario)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Horarios */}
                            <div className="form-input-horarios">
                                <label>Horarios:</label>
                                {horarios.map((horario, idx) => (
                                    <div key={idx} className="horario-item">
                                        {/* Día */}
                                        <div className="form-input-ctn-horario">
                                            <label>Dia de la semana</label>
                                            <select
                                                name="diaSemana"
                                                value={horario.diaSemana}
                                                onChange={(e) =>
                                                    handleHorarioChange(e, idx)
                                                }
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

                                        {/* Hora inicio */}
                                        <div className="form-input-ctn-horario">
                                            <label>Horario de inicio</label>
                                            <select
                                                name="horaIni"
                                                value={horario.horaIni}
                                                onChange={(e) =>
                                                    handleHorarioChange(e, idx)
                                                }
                                                required
                                            >
                                                <option value="">Seleccionar horario</option>
                                                {timeSlots.map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Hora fin */}
                                        <div className="form-input-ctn-horario">
                                            <label>Horario de fin</label>
                                            <select
                                                name="horaFin"
                                                value={horario.horaFin}
                                                onChange={(e) =>
                                                    handleHorarioChange(e, idx)
                                                }
                                                required
                                            >
                                                <option value="">Seleccionar horario</option>
                                                {timeSlots.map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Cupos */}
                                        <div className="form-input-ctn-horario">
                                            <label>Cupos disponibles</label>
                                            <input
                                                type="number"
                                                min={1}
                                                name="cupos"
                                                placeholder="Cupos"
                                                value={horario.cupos}
                                                onChange={(e) =>
                                                    handleHorarioChange(e, idx)
                                                }
                                                required
                                            />
                                        </div>

                                        <CloseIcon
                                            className="close-icon"
                                            onClick={() => handleRemoveHorario(idx)}
                                        />
                                    </div>
                                ))}

                                <SecondaryButton
                                    text="Agregar horario"
                                    icon={AddIconCircle}
                                    onClick={handleAddHorario}
                                />
                            </div>

                            {/* Submit */}
                            <button type="submit" className="submit-btn">
                                {isEditing ? "Guardar cambios" : "Crear Clase"}
                            </button>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClasesActividadesForm;
