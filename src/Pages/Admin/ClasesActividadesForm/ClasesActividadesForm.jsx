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
    { diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null, activo: true }
  ]);

  const [entrenadores, setEntrenadores] = useState([]);
  const [initialEntrenadores, setInitialEntrenadores] = useState([]);
  const [selectedEntrenadores, setSelectedEntrenadores] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [updateMode, setUpdateMode] = useState("preserve"); // "preserve" | "instant"

  // 🆕 snapshot de horarios iniciales (solo para comparar cambios)
  const [initialHorariosMap, setInitialHorariosMap] = useState({}); // { [idHorarioClase]: {diaSemana, horaIni, horaFin, cupos} }

  // Genera slots de 30'
  const generateTimeSlots = () => {
    const slots = [];
    for (let m = 0; m < 24 * 60; m += 30) {
      const h = String(Math.floor(m / 60)).padStart(2, "0");
      const mm = String(m % 60).padStart(2, "0");
      slots.push(`${h}:${mm}`);
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  // ——————————————————————————————————————————
  // 2) Cargar entrenadores
  // ——————————————————————————————————————————
  useEffect(() => {
    apiService
      .getEntrenadores()
      .then((resp) => setEntrenadores(resp.data ?? resp))
      .catch((err) => console.error("Error al obtener entrenadores", err));
  }, []);

  // ——————————————————————————————————————————
  // 3) Si editando, cargar datos de clase
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

        const formatted = (HorariosClase ?? []).map((h) => ({
          diaSemana: h.diaSemana,
          horaIni: (h.horaIni ?? "").substr(11, 5),
          horaFin: (h.horaFin ?? "").substr(11, 5),
          cupos: h.cupos,
          idHorarioClase: h.ID_HorarioClase,
          activo: typeof h.activo === "boolean" ? h.activo : true
        }));

        setHorarios(
          formatted.length > 0
            ? formatted
            : [{ diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null, activo: true }]
        );

        // 🆕 snapshot para comparar cambios (indexado por id)
        const map = {};
        for (const h of formatted) {
          if (h.idHorarioClase) {
            map[h.idHorarioClase] = {
              diaSemana: h.diaSemana,
              horaIni: h.horaIni,
              horaFin: h.horaFin,
              cupos: Number(h.cupos),
              activo: h.activo
            };
          }
        }
        setInitialHorariosMap(map);

        setImagePreview(imagenClase);
        setImage(null);

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
  // 4) Entrenadores (UI)
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
  // 5) Imagen
  // ——————————————————————————————————————————
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ——————————————————————————————————————————
  // 6) Horarios (UI)
  // ——————————————————————————————————————————
  const handleAddHorario = () => {
    setHorarios((prev) => [
      ...prev,
      { diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null, activo: true }
    ]);
  };

  const handleRemoveHorario = (idx) => {
    const h = horarios[idx];
    // Solo permitir eliminar si es activo (requisito: solo se puede modificar activos)
    if (h && h.activo !== false) {
      setHorarios((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleHorarioChange = (e, idx) => {
    const { name, value } = e.target;
    // Si el horario es inactivo, no permitir cambios (inputs disabled + guard)
    if (horarios[idx]?.activo === false) return;
    setHorarios((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [name]: value };
      return copy;
    });
  };

  // ——————————————————————————————————————————
  // Helpers de fechas / normalización
  // ——————————————————————————————————————————
  const normalizeDay = (d) =>
    (d || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // Lunes=0 ... Domingo=6 (semana comienza en lunes)
  const dayIndexFromSpanish = (d) => {
    const key = normalizeDay(d);
    const map = { lunes: 0, martes: 1, miercoles: 2, jueves: 3, viernes: 4, sabado: 5, domingo: 6 };
    return map[key] ?? 0;
  };

  // Devuelve Date local a las 00:00
  const startOfDayLocal = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Lunes de la semana actual (local)
  const getMondayThisWeek = (ref = new Date()) => {
    const d = startOfDayLocal(ref);
    const jsDay = d.getDay(); // 0=Dom..6=Sab
    const daysSinceMonday = (jsDay + 6) % 7; // Lun=0
    const monday = new Date(d);
    monday.setDate(d.getDate() - daysSinceMonday);
    return monday;
  };

  // Fecha local de la semana que viene para un índice de día (Lun=0..Dom=6)
  const getNextWeekDateForDayIndex = (dayIdx) => {
    const mondayThis = getMondayThisWeek();
    const mondayNext = new Date(mondayThis);
    mondayNext.setDate(mondayThis.getDate() + 7);
    const target = new Date(mondayNext);
    target.setDate(mondayNext.getDate() + (dayIdx || 0));
    return target; // local midnight
  };

  // Construye ISO (Z) para hh:mm en el día de la semana PRÓXIMA
  const getIsoForTimeAndDiaNextWeek = (hhmm, diaSemana) => {
    if (!hhmm || !diaSemana) return "";
    const [hh, mm] = (hhmm || "00:00").split(":");
    const idx = dayIndexFromSpanish(diaSemana);
    const base = getNextWeekDateForDayIndex(idx);
    const dt = new Date(base);
    dt.setHours(Number(hh || 0), Number(mm || 0), 0, 0); // local time
    return dt.toISOString(); // a Z
  };

  // ——————————————————————————————————————————
  // Detectar si un horario existente fue modificado
  // ——————————————————————————————————————————
  const isHorarioModified = (h) => {
    if (!h.idHorarioClase) return false; // nuevos no cuentan como "modificados"
    const snap = initialHorariosMap[h.idHorarioClase];
    if (!snap) return true; // seguridad: si no existe en snapshot, lo tratamos como modificado
    const sameDia = normalizeDay(snap.diaSemana) === normalizeDay(h.diaSemana);
    const sameIni = String(snap.horaIni) === String(h.horaIni);
    const sameFin = String(snap.horaFin) === String(h.horaFin);
    const sameCupos = Number(snap.cupos) === Number(h.cupos);
    return !(sameDia && sameIni && sameFin && sameCupos);
  };

  // ——————————————————————————————————————————
  // 7) Submit
  // ——————————————————————————————————————————

  // ENDPOINT PUT - CORRECCIONES
  // - Enviar TODOS los horarios activos del formulario (nuevos y existentes).
  // - Agregar ID_HorarioClase SOLO en los horarios EXISTENTES que cambiaron.
  // - Las fechas (horaIni/horaFin) se mandan para la SEMANA PRÓXIMA del día elegido.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const onlyEditable = horarios.filter((h) => h.activo !== false);

    const transformedHorarios = onlyEditable.map((h) => {
      const isoIni = getIsoForTimeAndDiaNextWeek(h.horaIni, h.diaSemana);
      const isoFin = getIsoForTimeAndDiaNextWeek(h.horaFin, h.diaSemana);
      const base = {
        diaSemana: h.diaSemana,
        horaIni: isoIni,
        horaFin: isoFin,
        cupos: Number(h.cupos)
      };
      // 🆕 ID solo si es un existente modificado
      if (isHorarioModified(h)) {
        return { ...base, ID_HorarioClase: h.idHorarioClase };
      }
      return base; // nuevos o existentes NO modificados sin ID
    });

    const dataForm = new FormData();
    dataForm.append("nombre", nombre);
    dataForm.append("descripcion", descripcion);
    if (image) dataForm.append("image", image);
    dataForm.append("horarios", JSON.stringify(transformedHorarios));

    const entrenadorIds = selectedEntrenadores.map((e) => e.ID_Usuario);
    dataForm.append("entrenadores", JSON.stringify(entrenadorIds));

    if (isEditing) {
      dataForm.append("updateMode", updateMode); // "instant" | "preserve"

      apiClient
        .put(`/clase/horario/${classId}`, dataForm, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(async () => {
          const origIds = initialEntrenadores.map((e) => e.ID_Usuario);
          const newIds = entrenadorIds;
          const toAdd = newIds.filter((id) => !origIds.includes(id));
          const toRemove = origIds.filter((id) => !newIds.includes(id));

          await Promise.all([
            ...toAdd.map((id) => apiService.addEntrenadorToClase(classId, id)),
            ...toRemove.map((id) => apiService.removeEntrenadorFromClase(classId, id))
          ]);

          if (fromAdmin) navigate("/admin/clases-actividades");
          else if (fromEntrenador) navigate("/entrenador/clases-actividades");

          toast.success(
            updateMode === "instant"
              ? "Clase actualizada. Los turnos nuevos se generaron automáticamente."
              : "Clase actualizada preservando turnos existentes."
          );
        })
        .catch((error) => {
          if (error?.code === "ERR_NETWORK") {
            toast.error("La foto es muy grande o hubo un problema de red.");
          } else {
            toast.error("Error actualizando la clase.");
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      apiClient
        .post("/clase/horario", dataForm, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(async ({ data }) => {
          const idNuevaClase = data?.clase?.ID_Clase;
          if (idNuevaClase) {
            await Promise.all(entrenadorIds.map((id) => apiService.addEntrenadorToClase(idNuevaClase, id)));
          }
          if (fromAdmin) navigate("/admin/clases-actividades");
          else if (fromEntrenador) navigate("/entrenador/clases-actividades");

          toast.success("Clase creada y entrenadores asignados exitosamente.");
          resetForm();
        })
        .catch((error) => {
          if (error?.code === "ERR_NETWORK") {
            toast.error("La foto es muy grande o hubo un problema de red.");
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
    setHorarios([{ diaSemana: "", horaIni: "", horaFin: "", cupos: "", idHorarioClase: null, activo: true }]);
    setSelectedEntrenadores([]);
    setDropdownValue("");
    setUpdateMode("preserve");
    setInitialHorariosMap({});
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

                {horarios.map((horario, idx) => {
                  const isInactive = horario.activo === false;

                  return (
                    <div
                      key={horario.idHorarioClase ?? idx}
                      className={`horario-item ${isInactive ? "horario-item--inactive" : ""}`}
                      style={isInactive ? { opacity: 0.6 } : undefined}
                    >
                      {/* Día */}
                      <div className="form-input-ctn-horario">
                        <label>Día de la semana</label>
                        <select
                          name="diaSemana"
                          value={horario.diaSemana}
                          onChange={(e) => handleHorarioChange(e, idx)}
                          required
                          disabled={isInactive}
                        >
                          <option value="">Seleccionar día</option>
                          {["Lunes","Martes","Miércoles","Jueves","Viernes","Sabado","Domingo"].map((d) => (
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
                          disabled={isInactive}
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
                          disabled={isInactive}
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
                          disabled={isInactive}
                        />
                      </div>

                      {/* Eliminar: solo si está activo */}
                      {horario.activo !== false && (
                        <CloseIcon className="close-icon" onClick={() => handleRemoveHorario(idx)} />
                      )}
                    </div>
                  );
                })}

                <div className="clase-actividad-form-agg-horario-btn">
                  <SecondaryButton text="Agregar horario" icon={AddIconCircle} onClick={handleAddHorario} />
                </div>
              </div>

              {/* Selector de modo de actualización (solo edición) */}
              {isEditing && (
                <div className="form-input-ctn">
                  <label>Modo de actualización de horarios:</label>
                  <div className="radio-group">
                    <label className="radio-group-label">
                      <input
                        type="radio"
                        name="updateMode"
                        value="preserve"
                        checked={updateMode === "preserve"}
                        onChange={(e) => setUpdateMode(e.target.value)}
                      />
                      <span> Preservar turnos </span>
                    </label>
                    <label className="radio-group-label">
                      <input
                        type="radio"
                        name="updateMode"
                        value="instant"
                        checked={updateMode === "instant"}
                        onChange={(e) => setUpdateMode(e.target.value)}
                      />
                      <span> Instantáneo </span>
                    </label>
                  </div>
                  <p className="gh-muted sm" style={{ marginTop: 8 }}>
                    <strong>Instantáneo:</strong> inhabilita los horarios editados y genera turnos nuevos con los nuevos días/horarios.{" "}
                    <strong>Preserve:</strong> actualiza preservando turnos existentes según reglas del servidor.
                  </p>
                </div>
              )}

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
