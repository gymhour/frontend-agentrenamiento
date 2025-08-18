import React, { useEffect, useState } from "react";
import "../../../App.css";
import "./clasesActividadesForm.css";
import SidebarMenu from "../../../Components/SidebarMenu/SidebarMenu";
import SecondaryButton from "../../../Components/utils/SecondaryButton/SecondaryButton";
import { ReactComponent as ArrowLeftIcon } from "../../../assets/icons/arrow-left.svg";
import { ReactComponent as AddIconCircle } from "../../../assets/icons/add-circle.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { useParams } from "react-router-dom";
import apiClient from "../../../axiosConfig";
import apiService from "../../../services/apiService";
import CustomDropdown from "../../../Components/utils/CustomDropdown/CustomDropdown";
import { toast } from "react-toastify";
import LoaderFullScreen from "../../../Components/utils/LoaderFullScreen/LoaderFullScreen";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../../Components/utils/CustomInput/CustomInput";

const ClasesActividadesForm = ({ isEditing, classId: classIdProp, fromAdmin, fromEntrenador }) => {

  const navigate = useNavigate();

  // ——————————————————————————————————————————
  // 1. Determinar classId
  // ——————————————————————————————————————————
  const { id: classIdParam } = useParams();
  const classId = isEditing ? classIdProp ?? classIdParam : null;

  // ——————————————————————————————————————————
  //  Estado local
  // ——————————————————————————————————————————
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [horarios, setHorarios] = useState([
    { diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null }
  ]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [initialEntrenadores, setInitialEntrenadores] = useState([]);    // 🆕 para diff
  const [selectedEntrenadores, setSelectedEntrenadores] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Genera los time slots de 30 en 30 minutos
  const generateTimeSlots = () => {
    const slots = [];
    for (let time = 0; time < 24 * 60; time += 30) {
      const h = String(Math.floor(time / 60)).padStart(2, "0");
      const m = String(time % 60).padStart(2, "0");
      slots.push(`${h}:${m}`);
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  // ——————————————————————————————————————————
  // 2. Cargar todos los entrenadores
  // ——————————————————————————————————————————
  useEffect(() => {
    apiService.getEntrenadores()
      .then((resp) => setEntrenadores(resp.data ?? resp))
      .catch((err) => console.error("Error al obtener los entrenadores", err));
  }, []);

  // ——————————————————————————————————————————
  // 3. Si editando, cargar datos de la clase
  // ——————————————————————————————————————————
  useEffect(() => {
    if (!isEditing || !classId) return;

    const fetchClaseDetalle = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiClient.get(`/clase/horario/${classId}`);
        const {
          nombre: nombreAPI,
          descripcion: descripcionAPI,
          imagenClase,
          HorariosClase,
          Entrenadores: entrenadoresIniciales
        } = data;

        setNombre(nombreAPI);
        setDescripcion(descripcionAPI);

        // Formatear horarios a "HH:mm"
        const formatted = HorariosClase.map((h) => ({
          diaSemana: h.diaSemana,
          horaIni: h.horaIni.substr(11, 5),
          horaFin: h.horaFin.substr(11, 5),
          cupos: h.cupos,
          idHorarioClase: h.ID_HorarioClase
        }));
        setHorarios(
          formatted.length > 0
            ? formatted
            : [{ diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null }]
        );

        setImagePreview(imagenClase);
        setImage(null);

        // Preseleccionar entrenadores y guardar estado inicial
        const init = entrenadoresIniciales ?? [];
        setSelectedEntrenadores(init);
        setInitialEntrenadores(init);
      } catch (error) {
        console.error("Error al obtener los detalles de la clase:", error);
        toast.error("Error al obtener información de la clase. Intenta nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaseDetalle();
  }, [isEditing, classId]);

  // ——————————————————————————————————————————
  // 4. Select / Remove desde UI (solo estado local)
  // ——————————————————————————————————————————
  const handleSelectEntrenador = (nombreCompleto) => {
    const ent = entrenadores.find((e) => `${e.nombre} ${e.apellido}` === nombreCompleto);
    if (!ent) return;
    if (!selectedEntrenadores.some((s) => s.ID_Usuario === ent.ID_Usuario)) {
      setSelectedEntrenadores((prev) => [...prev, ent]);
    }
  };

  const handleRemoveEntrenador = (ID_Usuario) => {
    setSelectedEntrenadores((prev) => prev.filter((e) => e.ID_Usuario !== ID_Usuario));
  };

  // ——————————————————————————————————————————
  // 5. Imagen
  // ——————————————————————————————————————————
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ——————————————————————————————————————————
  // 6. Filas de horarios
  // ——————————————————————————————————————————
  const handleAddHorario = () => {
    setHorarios((prev) => [
      ...prev,
      { diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null }
    ]);
  };
  const handleRemoveHorario = (idx) => {
    setHorarios((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleHorarioChange = (e, idx) => {
    const { name, value } = e.target;
    setHorarios((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [name]: value };
      return copy;
    });
  };

  // ——————————————————————————————————————————
  // 7. Submit (crear o editar)
  // ——————————————————————————————————————————
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Transformar horarios a ISO
    const transformedHorarios = horarios.map((h) => ({
      ...h,
      horaIni: `2024-01-03T${h.horaIni}:00.000Z`,
      horaFin: `2024-01-03T${h.horaFin}:00.000Z`,
      cupos: Number(h.cupos)
    }));

    const dataForm = new FormData();
    dataForm.append("nombre", nombre);
    dataForm.append("descripcion", descripcion);
    if (image) dataForm.append("image", image);
    dataForm.append("horarios", JSON.stringify(transformedHorarios));

    const entrenadorIds = selectedEntrenadores.map((e) => e.ID_Usuario);
    dataForm.append("entrenadores", JSON.stringify(entrenadorIds));

    if (isEditing) {
      // — Edición: primero actualizamos clase y horarios, luego diff de entrenadores
      apiClient
        .put(`/clase/horario/${classId}`, dataForm, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(async ({ data }) => {
          const origIds = initialEntrenadores.map((e) => e.ID_Usuario);
          const newIds  = entrenadorIds;

          const toAdd    = newIds.filter((id) => !origIds.includes(id));
          const toRemove = origIds.filter((id) => !newIds.includes(id));

          await Promise.all([
            ...toAdd.map((id) => apiService.addEntrenadorToClase(classId, id)),
            ...toRemove.map((id) => apiService.removeEntrenadorFromClase(classId, id))
          ]);

          if (fromAdmin) {
            navigate("/admin/clases-actividades")
          } else if (fromEntrenador) {
            navigate("/entrenador/clases-actividades")
          }
          toast.success("Clase y asignaciones actualizadas exitosamente.");
        })
        .catch((error) => {
          if (error.code === "ERR_NETWORK") {
            toast.error("La foto es muy grande. Intenta con una imagen más pequeña.");
          } else {
            toast.error("Error actualizando la clase.");
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      // — Creación: crear clase y luego asignar entrenadores
      apiClient
        .post("/clase/horario", dataForm, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(async ({ data }) => {
          const idNuevaClase = data.clase.ID_Clase;
          await Promise.all(
            entrenadorIds.map((id) => apiService.addEntrenadorToClase(idNuevaClase, id))
          );
          if (fromAdmin) {
            navigate("/admin/clases-actividades")
          } else if (fromEntrenador) {
            navigate("/entrenador/clases-actividades")
          }
          toast.success("Clase creada y entrenadores asignados exitosamente.");
          resetForm();
        })
        .catch((error) => {
          if (error.code === "ERR_NETWORK") {
            toast.error("La foto es muy grande. Intenta con una imagen más pequeña.");
          } else {
            toast.error("Error al crear la clase o asignar entrenadores.");
          }
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
    setDropdownValue("");
  };

  return (
    <div className="page-layout">
      {isLoading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={fromAdmin} isEntrenador={fromEntrenador} />
      <div className="content-layout">
        <div className="clases-actividades-form-ctn">
          <div className="clases-actividades-form-title">
            <SecondaryButton
              text="Volver atrás"
              linkTo={fromAdmin ? "/admin/clases-actividades" : "/entrenador/clases-actividades"}
              icon={ArrowLeftIcon}
              reversed={true}
            />
            <h2>{isEditing ? "Editar clase o actividad" : "Crear nueva clase o actividad"}</h2>
          </div>
          <div className="create-clase-form">
            <form encType="multipart/form-data" onSubmit={handleSubmit}>
              {/* Nombre */}
              <div className="form-input-ctn">
                <label>Nombre:</label>
                <CustomInput
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required={true}
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
                <input type="file" id="imagen" onChange={handleImageChange} />
                {imagePreview && (
                  <div className="preview-container">
                    <img
                      src={imagePreview}
                      alt="Preview clase"
                      className="preview-img"
                      width={300}
                    />
                  </div>
                )}
              </div>

              {/* Entrenadores */}
              <div className="form-input-ctn">
                <label htmlFor="entrenadores">Entrenadores:</label>
                <CustomDropdown
                  id="entrenadores"
                  name="entrenadores"
                  options={entrenadores.filter(e => e.estado).map((e) => `${e.nombre} ${e.apellido}`)}
                  placeholderOption="Seleccionar entrenador"
                  value={dropdownValue}
                  onChange={(e) => {
                    handleSelectEntrenador(e.target.value);
                    setDropdownValue("");
                  }}
                />
                <div className="selected-tags">
                  {selectedEntrenadores.map((ent) => (
                    <div key={ent.ID_Usuario} className="tag">
                      <span>{`${ent.nombre} ${ent.apellido}`}</span>
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
                    {/* Día */}
                    <div className="form-input-ctn-horario">
                      <label>Dia de la semana</label>
                      <select
                        name="diaSemana"
                        value={horario.diaSemana}
                        onChange={(e) => handleHorarioChange(e, idx)}
                        required
                      >
                        <option value="">Seleccionar día</option>
                        {["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    {/* Inicio */}
                    <div className="form-input-ctn-horario">
                      <label>Horario de inicio</label>
                      <select
                        name="horaIni"
                        value={horario.horaIni}
                        onChange={(e) => handleHorarioChange(e, idx)}
                        required
                      >
                        <option value="">Seleccionar horario</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    {/* Fin */}
                    <div className="form-input-ctn-horario">
                      <label>Horario de fin</label>
                      <select
                        name="horaFin"
                        value={horario.horaFin}
                        onChange={(e) => handleHorarioChange(e, idx)}
                        required
                      >
                        <option value="">Seleccionar horario</option>
                        {timeSlots.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    {/* Cupos */}
                    <div className="form-input-ctn-horario">
                      <label>Cupos</label>
                      <input
                        type="number"
                        min={1}
                        name="cupos"
                        placeholder="Cupos"
                        value={horario.cupos}
                        onChange={(e) => handleHorarioChange(e, idx)}
                        required
                      />
                    </div>
                    <CloseIcon
                      className="close-icon"
                      onClick={() => handleRemoveHorario(idx)}
                    />
                  </div>
                ))}
                <div className="clase-actividad-form-agg-horario-btn">
                  <SecondaryButton
                    text="Agregar horario"
                    icon={AddIconCircle}
                    onClick={handleAddHorario}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="clase-actividad-form-guardar-btn">
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isEditing ? "Guardar cambios" : "Crear Clase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClasesActividadesForm;