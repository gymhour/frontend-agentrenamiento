import React, { useEffect, useState } from "react";
import '../../../App.css';
import './clasesActividadesForm.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from "../../../Components/utils/SecondaryButton/SecondaryButton";
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-right.svg';
import { ReactComponent as AddIconCircle } from '../../../assets/icons/add-circle.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/close.svg';
import { useParams } from "react-router-dom";
import apiClient from "../../../axiosConfig";
import apiService from "../../../services/apiService";
import CustomDropdown from "../../../Components/utils/CustomDropdown/CustomDropdown";
import { toast } from "react-toastify";
import LoaderFullScreen from "../../../Components/utils/LoaderFullScreen/LoaderFullScreen";

const ClasesActividadesForm = ({ isEditing, classId }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [horarios, setHorarios] = useState([
    { diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null }
  ]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [selectedEntrenadores, setSelectedEntrenadores] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("");
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  // Genera los time slots de 30 en 30 minutos
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

  // 1. Carga entrenadores al montar
  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        const resp = await apiService.getEntrenadores();
        setEntrenadores(resp.data ?? resp);
      } catch (error) {
        console.error("Error al obtener los entrenadores", error);
      }
    };
    fetchEntrenadores();
  }, []);

  // 2. Si estamos editando, carga los datos de la clase
  useEffect(() => {
    if (!isEditing) return;

    const fetchClaseDetalle = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get(`/clase/horario/${id}`);
        const {
          nombre: nombreAPI,
          descripcion: descripcionAPI,
          imagenClase,
          HorariosClase,
          Entrenadores: entrenadoresIniciales
        } = data;

        setNombre(nombreAPI);
        setDescripcion(descripcionAPI);

        // Formatea los horarios al shape de tu formulario
        const formatted = HorariosClase.map(h => ({
          diaSemana: h.diaSemana,
          horaIni: new Date(h.horaIni).toISOString().substr(11,5),
          horaFin: new Date(h.horaFin).toISOString().substr(11,5),
          cupos: h.cupos,
          idHorarioClase: h.ID_HorarioClase
        }));
        setHorarios(formatted.length > 0 ? formatted : [{
          diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null
        }]);

        // Preview de la imagen existente
        setImagePreview(imagenClase);
        setImage(null);

        // Si quieres preseleccionar entrenadores:
        setSelectedEntrenadores(entrenadoresIniciales ?? []);
      } catch (error) {
        console.error("Error al obtener los detalles de la clase:", error);
        toast.error("Error al obtener información de la clase. Intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaseDetalle();
  }, [isEditing, id]);

  // Handler para seleccionar un entrenador
  const handleSelectEntrenador = (nombre) => {
    const ent = entrenadores.find(e => e.nombre === nombre);
    if (!ent) return;
    if (!selectedEntrenadores.some(s => s.ID_Usuario === ent.ID_Usuario)) {
      setSelectedEntrenadores(prev => [...prev, ent]);
    }
  };

  const handleRemoveEntrenador = (ID_Usuario) => {
    setSelectedEntrenadores(prev => prev.filter(e => e.ID_Usuario !== ID_Usuario));
  };

  // Cuando cambio el input file
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddHorario = () => {
    setHorarios(prev => [
      ...prev,
      { diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null }
    ]);
  };

  const handleRemoveHorario = (index) => {
    setHorarios(prev => prev.filter((_, i) => i !== index));
  };

  const handleHorarioChange = (e, index) => {
    const { name, value } = e.target;
    setHorarios(prev => {
      const arr = [...prev];
      arr[index] = { ...arr[index], [name]: value };
      return arr;
    });
  };

  // Submit (no modificamos formData de la imagen por tu petición)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const transformedHorarios = horarios.map(h => ({
      ...h,
      horaIni: `2024-01-03T${h.horaIni}:00Z`,
      horaFin: `2024-01-03T${h.horaFin}:00Z`,
      cupos: Number(h.cupos),
    }));

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    if (image) formData.append("image", image);
    formData.append("horarios", JSON.stringify(transformedHorarios));

    const entrenadorIds = selectedEntrenadores.map(e => e.ID_Usuario);
    formData.append("entrenadores", JSON.stringify(entrenadorIds));

    if (isEditing) {
      apiClient.put(`/clase/horario/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(() => {
          toast.success("Clase actualizada exitosamente.");
        })
        .catch(() => {
          toast.error("Error actualizando clase");
        })
        .finally(() => setIsLoading(false));
    } else {
      apiClient.post("/clase/horario", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          const idClase = response.data.clase.ID_Clase;
          return Promise.all(
            entrenadorIds.map(idEntr => apiService.addEntrenadorToClase(idClase, idEntr))
          );
        })
        .then(() => {
          toast.success("Clase creada y entrenadores asignados exitosamente.");
          resetForm();
        })
        .catch(() => {
          toast.error("Hubo un error en la creación o asignación.");
        })
        .finally(() => setIsLoading(false));
    }
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setImage(null);
    setImagePreview("");
    setHorarios([{ diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null }]);
    setSelectedEntrenadores([]);
  };

  return (
    <div className='page-layout'>
      {isLoading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={true} />
      <div className='content-layout'>
        <div className="clases-actividades-form-ctn">
          <div className="clases-actividades-form-title">
            <SecondaryButton
              text="Volver atrás"
              linkTo="/admin/clases-actividades"
              icon={ArrowLeftIcon}
              reversed={true}
            />
            <h2>{isEditing ? 'Editar clase o actividad' : 'Crear nueva clase o actividad'}</h2>
          </div>
          <div className="create-clase-form">
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
              {/* Nombre */}
              <div className="form-input-ctn">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                />
              </div>

              {/* Descripción */}
              <div className="form-input-ctn">
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
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
                {imagePreview && (
                  <div className="preview-container">
                    <img src={imagePreview} alt="Preview clase" className="preview-img" width={300} />
                  </div>
                )}
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
                  onChange={e => {
                    handleSelectEntrenador(e.target.value);
                    setDropdownValue("");
                  }}
                />
                <div className="selected-tags">
                  {selectedEntrenadores.map(ent => (
                    <div key={ent.ID_Usuario} className="tag">
                      <span>{ent.nombre}</span>
                      <CloseIcon
                        className="tag-close"
                        width={20}
                        height={20}
                        onClick={() => handleRemoveEntrenador(ent.ID_Usuario)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Horarios */}
              <div className="form-input-horarios">
                <label>Horarios:</label>
                {horarios.map((horario, idx) => (
                  <div key={horario.idHorarioClase ?? idx} className="horario-item">
                    <div className="form-input-ctn-horario">
                      <label>Dia de la semana</label>
                      <select
                        name="diaSemana"
                        value={horario.diaSemana}
                        onChange={e => handleHorarioChange(e, idx)}
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
                        onChange={e => handleHorarioChange(e, idx)}
                        required
                      >
                        <option value="">Seleccionar horario</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-input-ctn-horario">
                      <label>Horario de fin</label>
                      <select
                        name="horaFin"
                        value={horario.horaFin}
                        onChange={e => handleHorarioChange(e, idx)}
                        required
                      >
                        <option value="">Seleccionar horario</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-input-ctn-horario">
                      <label>Cupos disponibles</label>
                      <input
                        type="number"
                        min={1}
                        name="cupos"
                        placeholder="Cupos"
                        value={horario.cupos}
                        onChange={e => handleHorarioChange(e, idx)}
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
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isEditing ? "Guardar cambios" : "Crear Clase"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClasesActividadesForm;
