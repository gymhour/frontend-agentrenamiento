import React, { useState, useEffect } from 'react';
import '../../../App.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu.jsx';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown.jsx';
import CustomInput from '../../../Components/utils/CustomInput/CustomInput.jsx';
import './CrearRutina.css';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton.jsx';
import apiService, { fetchAllClientsActive } from '../../../services/apiService'; // <-- usa el helper paginado
import { toast } from "react-toastify";
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton.jsx';

/* ================= Helpers ================= */
const DISPLAY_TYPES = ["Series y repeticiones", "Rondas", "EMOM", "AMRAP", "Escalera", "TABATA"];
const apiToDisplayType = {
  SETS_REPS: 'Series y repeticiones',
  ROUNDS: 'Rondas',
  EMOM: 'EMOM',
  AMRAP: 'AMRAP',
  LADDER: 'Escalera',
  TABATA: 'TABATA',
};
const displayToApiType = (t) => ({
  "Series y repeticiones": "SETS_REPS",
  "Rondas": "ROUNDS",
  "EMOM": "EMOM",
  "AMRAP": "AMRAP",
  "Escalera": "LADDER",
  "TABATA": "TABATA",
}[t] || "SETS_REPS");

const getRandomExercise = () =>
  ["Pecho plano 60kg", "Flexiones de brazo", "Press de hombro 60kg", "Sentadillas con barra 80kg", "Remo con mancuerna 40kg", "Dominadas", "Elevaciones laterales 8kg"][Math.floor(Math.random() * 7)];

const makeEmptyBlock = (selectedType) => {
  const baseSet = { series: '', exercise: '', weight: '', placeholderExercise: getRandomExercise(), exerciseId: null };
  switch (selectedType) {
    case 'Series y repeticiones':
      return { id: Date.now(), type: selectedType, data: { setsReps: [{ ...baseSet }] } };
    case 'Rondas':
      return { id: Date.now(), type: selectedType, data: { rounds: '', descanso: '', setsReps: [{ ...baseSet }] } };
    case 'EMOM':
      return { id: Date.now(), type: selectedType, data: { interval: '1', totalMinutes: '', setsReps: [{ ...baseSet }] } };
    case 'AMRAP':
      return { id: Date.now(), type: selectedType, data: { duration: '', setsReps: [{ ...baseSet }] } };
    case 'Escalera':
      return { id: Date.now(), type: selectedType, data: { escaleraType: '', setsReps: [{ ...baseSet }] } };
    case 'TABATA':
      return { id: Date.now(), type: selectedType, data: { duration: '4', setsReps: [{ ...baseSet }] } };
    default:
      return { id: Date.now(), type: 'Series y repeticiones', data: { setsReps: [{ ...baseSet }] } };
  }
};

const convertApiBlockData = (b) => {
  const items = Array.isArray(b.bloqueEjercicios) ? b.bloqueEjercicios
    : Array.isArray(b.ejercicios) ? b.ejercicios : [];

  const mappedSets = items.map((e) => {
    const nombreEj = e?.ejercicio?.nombre ?? e?.nombre ?? '';
    const idEj = e.ID_Ejercicio ?? e?.ejercicio?.ID_Ejercicio ?? e?.ejercicioId ?? null;
    const reps = e.reps ?? e.setsReps ?? '';
    const weight = e.setRepWeight ?? '';
    return { series: reps, exercise: nombreEj, weight, placeholderExercise: '', exerciseId: idEj || null };
  });

  switch (b.type) {
    case 'SETS_REPS':
      return {
        setsReps: mappedSets.length
          ? mappedSets
          : [{ series: b.setsReps || '', exercise: b.nombreEj || '', weight: b.weight || '', placeholderExercise: '', exerciseId: null }]
      };
    case 'ROUNDS':
      return { rounds: b.cantRondas ?? '', descanso: b.descansoRonda ?? '', setsReps: mappedSets };
    case 'EMOM':
      return { interval: '1', totalMinutes: b.durationMin ?? '', setsReps: mappedSets };
    case 'AMRAP':
      return { duration: b.durationMin ?? '', setsReps: mappedSets };
    case 'LADDER':
      return { escaleraType: b.tipoEscalera ?? '', setsReps: mappedSets };
    case 'TABATA':
      return { duration: b.durationMin ?? '4', setsReps: mappedSets };
    default:
      return { setsReps: mappedSets };
  }
};

/* ================= Component ================= */
const CrearRutina = ({ fromAdmin, fromEntrenador }) => {
  const { rutinaId } = useParams();
  const isEditing = Boolean(rutinaId);
  const navigate = useNavigate();

  const canAssign = !!(fromEntrenador || fromAdmin);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [clases, setClases] = useState([]);
  const [selectedClase, setSelectedClase] = useState("");
  const [selectedGrupoMuscular, setSelectedGrupoMuscular] = useState("");
  const gruposMusculares = ["Pecho","Espalda","Piernas","Brazos","Hombros","Abdominales","Glúteos","Tren Superior","Tren Inferior","Full Body","Mixto"];

  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const [allExercises, setAllExercises] = useState([]);
  const [suggestions, setSuggestions] = useState({});

  // Días (tabs)
  const [days, setDays] = useState([{ key: 'dia1', nombre: '', descripcion: '', blocks: [] }]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  useEffect(() => {
    apiService.getEjercicios()
      .then(setAllExercises)
      .catch(() => toast.error('No se pudieron cargar los ejercicios'));

    apiService.getClases()
      .then(setClases)
      .catch(() => toast.error('No se pudieron cargar las clases'));
  }, []);

  useEffect(() => {
    // Cargar TODOS los clientes activos con paginado cuando se puede asignar (admin o entrenador)
    if (canAssign) {
      (async () => {
        try {
          const clientes = await fetchAllClientsActive(apiService, { take: 100 });
          setUsers(clientes);
        } catch (e) {
          toast.error('No se pudieron cargar todos los usuarios');
        }
      })();
    }
  }, [canAssign]);

  useEffect(() => {
    // si estoy editando y (no necesito usuarios) o (ya los tengo), traigo la rutina
    if (isEditing && (!canAssign || users.length > 0)) {
      fetchRoutine();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, canAssign, users]);

  const cryptoRandomId = () => {
    try {
      return Number((crypto.getRandomValues(new Uint32Array(1))[0]).toString());
    } catch {
      return Date.now();
    }
  };

  const fetchRoutine = async () => {
    setLoading(true);
    try {
      const resp = await apiService.getRutinaById(rutinaId);
      const r = resp?.rutina ?? resp;

      setFormData({ nombre: r.nombre || '', descripcion: r.desc || '' });
      setSelectedClase(r.claseRutina || "");
      setSelectedGrupoMuscular(r.grupoMuscularRutina || "");

      if (canAssign) {
        const alumnoEmail = r?.alumno?.email ?? r?.alumnoEmail ?? null;
        const alumnoId = r?.ID_Usuario ?? r?.alumno?.ID_Usuario ?? null;
        let selected = null;
        if (alumnoEmail) selected = alumnoEmail;
        else if (alumnoId) {
          const u = users.find(u => u.ID_Usuario === alumnoId);
          selected = u?.email ?? null;
        }
        setSelectedEmail(selected);
      }

      if (r?.dias && typeof r.dias === 'object') {
        const keys = Object.keys(r.dias).sort();
        const loaded = keys.map((k) => {
          const d = r.dias[k] || {};
          const blocks = Array.isArray(d.bloques)
            ? d.bloques.map(b => ({ id: cryptoRandomId(), type: apiToDisplayType[b.type] || b.type, data: convertApiBlockData(b) }))
            : [];
          return { key: k, nombre: d.nombre || '', descripcion: d.descripcion || '', blocks };
        });
        setDays(loaded.length ? loaded : [{ key: 'dia1', nombre: '', descripcion: '', blocks: [] }]);
        setActiveDayIndex(0);
      } else {
        const blocks = Array.isArray(r.Bloques)
          ? r.Bloques.map(b => ({ id: cryptoRandomId(), type: apiToDisplayType[b.type] || b.type, data: convertApiBlockData(b) }))
          : [];
        setDays([{ key: 'dia1', nombre: '', descripcion: '', blocks }]);
        setActiveDayIndex(0);
      }
    } catch {
      toast.error('No se pudo cargar la rutina para editar');
    } finally { setLoading(false); }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return toast.error("Ingresá un nombre para la rutina");
    if (!days.length) return toast.error("Agregá al menos un día");

    if (canAssign && !selectedEmail) {
      return toast.error("Seleccioná un usuario para asignar la rutina");
    }

    setStep(2);
  };

  // Tabs días
  const addDay = () => {
    const nextIndex = days.length + 1;
    const newKey = `dia${nextIndex}`;
    setDays([...days, { key: newKey, nombre: '', descripcion: '', blocks: [] }]);
    setActiveDayIndex(days.length);
  };
  const removeDay = (idx) => {
    if (days.length === 1) return toast.info("Debe existir al menos un día");
    const newDays = days.filter((_, i) => i !== idx).map((d, i) => ({ ...d, key: `dia${i+1}` }));
    setDays(newDays);
    setActiveDayIndex(Math.max(0, idx - 1));
  };
  const renameDayField = (idx, field, value) => {
    setDays(days.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };

  const activeDay = days[activeDayIndex];
  const setActiveDayBlocks = (newBlocks) => {
    setDays(days.map((d, i) => i === activeDayIndex ? { ...d, blocks: newBlocks } : d));
  };

  // Blocks
  const handleAddBlock = (e) => {
    const selectedType = e.target.value;
    if (!selectedType) return;
    setActiveDayBlocks([...(activeDay?.blocks || []), makeEmptyBlock(selectedType)]);
  };
  const handleDeleteBlock = (blockId) => {
    setActiveDayBlocks((activeDay?.blocks || []).filter(b => b.id !== blockId));
  };
  const handleBlockFieldChange = (blockId, field, value) => {
    setActiveDayBlocks((activeDay?.blocks || []).map(block => block.id === blockId
      ? { ...block, data: { ...block.data, [field]: value } }
      : block));
  };
  const handleSetRepChange = (blockId, index, field, value) => {
    setActiveDayBlocks((activeDay?.blocks || []).map(block => {
      if (block.id === blockId) {
        const newSetsReps = block.data.setsReps.map((sr, i) => i === index ? { ...sr, [field]: value } : sr);
        return { ...block, data: { ...block.data, setsReps: newSetsReps } };
      }
      return block;
    }));
  };
  const handleAddSetRep = (blockId) => {
    setActiveDayBlocks((activeDay?.blocks || []).map(block =>
      block.id === blockId
        ? { ...block, data: { ...block.data, setsReps: [...block.data.setsReps, { series: '', exercise: '', weight: '', placeholderExercise: getRandomExercise(), exerciseId: null }] } }
        : block
    ));
  };
  const handleDeleteSetRep = (blockId, index) => {
    setActiveDayBlocks((activeDay?.blocks || []).map(block =>
      block.id === blockId
        ? { ...block, data: { ...block.data, setsReps: block.data.setsReps.filter((_, i) => i !== index) } }
        : block
    ));
  };

  // Suggestions
  const handleExerciseInputChange = (blockId, idx, value) => {
    setActiveDayBlocks((activeDay?.blocks || []).map(block => {
      if (block.id === blockId) {
        const newSets = block.data.setsReps.map((sr, i) => i === idx ? { ...sr, exercise: value, exerciseId: null } : sr);
        return { ...block, data: { ...block.data, setsReps: newSets } };
      }
      return block;
    }));

    const key = `${activeDay?.key || 'dia'}-${blockId}-${idx}`;
    if (value.trim() === '') {
      setSuggestions(prev => ({ ...prev, [key]: [] }));
      return;
    }
    const lista = Array.isArray(allExercises) ? allExercises : [];
    const filtered = lista
      .filter(e => e.nombre.toLowerCase().includes(value.trim().toLowerCase()))
      .slice(0, 5);
    setSuggestions(prev => ({ ...prev, [key]: filtered }));
  };
  const handleSelectSuggestion = (blockId, idx, exerciseObj) => {
    setActiveDayBlocks((activeDay?.blocks || []).map(block => {
      if (block.id === blockId) {
        const newSets = block.data.setsReps.map((sr, i) =>
          i === idx ? { ...sr, exercise: exerciseObj.nombre, exerciseId: exerciseObj.ID_Ejercicio } : sr
        );
        return { ...block, data: { ...block.data, setsReps: newSets } };
      }
      return block;
    }));
    const key = `${activeDay?.key || 'dia'}-${blockId}-${idx}`;
    setSuggestions({ ...suggestions, [key]: [] });
  };

  // Drag & drop por bloque
  const [draggingBlockId, setDraggingBlockId] = useState(null);
  const [dragOverBlockId, setDragOverBlockId] = useState(null);
  const onDragStart = (e, blockId) => { setDraggingBlockId(blockId); e.dataTransfer.setData('text/plain', String(blockId)); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver = (e, overId) => { e.preventDefault(); setDragOverBlockId(overId); };
  const onDrop = (e, toId) => {
    e.preventDefault();
    const fromId = Number(e.dataTransfer.getData('text/plain'));
    if (!fromId || fromId === toId) { setDraggingBlockId(null); setDragOverBlockId(null); return; }
    const list = activeDay?.blocks || [];
    const fromIndex = list.findIndex(b => b.id === fromId);
    const toIndex = list.findIndex(b => b.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;
    const newOrder = [...list];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setActiveDayBlocks(newOrder);
    setDraggingBlockId(null);
    setDragOverBlockId(null);
  };
  const onDragEnd = () => { setDraggingBlockId(null); setDragOverBlockId(null); };

  // Payload
  const buildPayload = () => {
    const userId = canAssign
      ? users.find(u => u.email === selectedEmail)?.ID_Usuario
      : Number(localStorage.getItem("usuarioId"));

    const entrenadorId = fromEntrenador ? Number(localStorage.getItem("usuarioId")) : null;

    const diasObj = {};
    days.forEach((d, i) => {
      const key = `dia${i + 1}`;
      const bloques = (d.blocks || []).map(block => {
        const bloqueEjercicios = block.data.setsReps.map(setRep => {
          const normWeight = (setRep.weight || '').trim();
          if (setRep.exerciseId) {
            return { ejercicioId: setRep.exerciseId, reps: setRep.series, setRepWeight: normWeight || undefined };
          }
          return {
            nuevoEjercicio: { nombre: setRep.exercise },
            reps: setRep.series,
            setRepWeight: normWeight || undefined
          };
        });

        const type = displayToApiType(block.type);
        switch (type) {
          case 'SETS_REPS':
            return {
              type,
              setsReps: block.data.setsReps[0]?.series || null,
              nombreEj: block.data.setsReps[0]?.exercise || null,
              weight: (block.data.setsReps[0]?.weight || '').trim() || null,
              descansoRonda: block.data.descanso || null,
              bloqueEjercicios
            };
          case 'ROUNDS':
            return { type, cantRondas: parseInt(block.data.rounds || 0, 10) || null, descansoRonda: parseInt(block.data.descanso || 0, 10) || null, bloqueEjercicios };
          case 'EMOM':
            return { type, durationMin: parseInt(block.data.totalMinutes || 0, 10) || null, bloqueEjercicios };
          case 'AMRAP':
            return { type, durationMin: parseInt(block.data.duration || 0, 10) || null, bloqueEjercicios };
          case 'LADDER':
            return { type, tipoEscalera: (block.data.escaleraType || '').trim() || null, bloqueEjercicios };
          case 'TABATA':
            return { type, durationMin: parseInt(block.data.duration || 4, 10), bloqueEjercicios };
          default:
            return { type, bloqueEjercicios };
        }
      });

      diasObj[key] = {
        nombre: d.nombre || `Día ${i + 1}`,
        descripcion: d.descripcion || '',
        bloques
      };
    });

    return {
      ID_Usuario: Number(userId),
      ID_Entrenador: entrenadorId, // para admin queda null (si querés que sea el admin logueado, te lo cambio)
      nombre: formData.nombre,
      desc: formData.descripcion,
      claseRutina: selectedClase || "Combinada",
      grupoMuscularRutina: selectedGrupoMuscular || "Mixto",
      dias: diasObj
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = buildPayload();
      if (isEditing) {
        await apiService.editRutina(rutinaId, payload);
        toast.success('Rutina actualizada correctamente');
        if (fromEntrenador) navigate('/entrenador/rutinas-asignadas');
      } else {
        await apiService.createRutina(payload);
        toast.success('Rutina creada correctamente');
      }
      if (fromAdmin) navigate('/admin/rutinas');
      else if (!fromEntrenador) navigate('/alumno/mi-rutina');
    } catch {
      toast.error(isEditing ? 'Error actualizando rutina' : 'Error creando rutina');
    } finally { setLoading(false); }
  };

  /* ================ UI ================ */
  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={fromAdmin} isEntrenador={fromEntrenador} />

      <div className='content-layout mi-rutina-ctn'>
        <div className="mi-rutina-title">
          <h2>{isEditing ? 'Editar Rutina' : 'Crear Rutina'}</h2>
        {step === 2 && (
            <PrimaryButton
              text={isEditing ? "Guardar cambios" : "Crear rutina"}
              linkTo="#"
              onClick={handleSubmit}
            />
          )}
        </div>

        {/* ===== Step 1 ===== */}
        {step === 1 && (
          <div className="crear-rutina-step1">
            <div className="crear-rutina-step-1-form">
              <CustomInput
                placeholder="Nombre de la rutina"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />

              <CustomDropdown
                id="claseRutina"
                name="claseRutina"
                placeholderOption="Seleccionar clase (opcional)"
                options={clases.map(c => c.nombre)}
                value={selectedClase}
                onChange={e => setSelectedClase(e.target.value)}
              />

              <CustomDropdown
                id="grupoMuscular"
                name="grupoMuscular"
                placeholderOption="Seleccionar grupo muscular (opcional)"
                options={gruposMusculares}
                value={selectedGrupoMuscular}
                onChange={e => setSelectedGrupoMuscular(e.target.value)}
              />

              <CustomInput
                placeholder="Descripción (opcional)"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />

              {canAssign && (
                <Select
                  options={users.map(u => ({
                    label: `${u.nombre} ${u.apellido} (${u.email})`,
                    value: u.email
                  }))}
                  value={
                    selectedEmail
                      ? {
                        label: `${users.find(u => u.email === selectedEmail)?.nombre || ''} ${users.find(u => u.email === selectedEmail)?.apellido || ''} (${selectedEmail})`,
                        value: selectedEmail
                      }
                      : null
                  }
                  onChange={option => setSelectedEmail(option.value)}
                  placeholder="Seleccioná un usuario"
                  isSearchable
                  required
                />
              )}

              <div className='crearRutina-s1-continuar-btn-ctn'>
                <PrimaryButton text="Continuar" linkTo="#" onClick={handleContinue} />
              </div>
            </div>
          </div>
        )}

        {/* ===== Step 2 ===== */}
        {step === 2 && (
          <div className="crear-rutina-step2">
            <div className="crear-rutina-step-2-form">

              <SecondaryButton text="← Volver" linkTo="#" onClick={() => setStep(1)} style={{ marginBottom: '16px' }} />

              {/* Tabs de días */}
              <div className="days-tabs">
                {days.map((d, idx) => (
                  <div
                    key={d.key}
                    className={`day-tab ${idx === activeDayIndex ? 'active' : ''}`}
                    onClick={() => setActiveDayIndex(idx)}
                  >
                    {`Día ${idx + 1}`}
                    <button
                      className="day-tab-close"
                      title="Eliminar día"
                      onClick={(e) => { e.stopPropagation(); removeDay(idx); }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button className="day-tab add" onClick={addDay}>+ Añadir día</button>
              </div>

              {/* Meta del día */}
              <div className="day-meta">
                <CustomInput
                  placeholder="Nombre del día (ej. Fuerza - Día 1)"
                  value={activeDay?.nombre || ''}
                  onChange={(e) => renameDayField(activeDayIndex, 'nombre', e.target.value)}
                />
                <CustomInput
                  placeholder="Descripción del día (opcional)"
                  value={activeDay?.descripcion || ''}
                  onChange={(e) => renameDayField(activeDayIndex, 'descripcion', e.target.value)}
                />
              </div>

              {/* Agregar bloque */}
              <div className='agregar-bloque-ctn'>
                <p> Agregar bloque: </p>
                <CustomDropdown
                  placeholderOption="Tipo de serie"
                  options={DISPLAY_TYPES}
                  value=""
                  onChange={handleAddBlock}
                />
              </div>

              {/* Bloques */}
              {(activeDay?.blocks || []).map((block) => {
                const isDragging = draggingBlockId === block.id;
                const isOver = dragOverBlockId === block.id;
                const sugKeyPrefix = `${activeDay?.key || 'dia'}-${block.id}-`;

                return (
                  <div
                    key={block.id}
                    className={`block-container ${isDragging ? 'block--dragging' : ''} ${isOver ? 'block--over' : ''}`}
                    onDragOver={(e) => onDragOver(e, block.id)}
                    onDrop={(e) => onDrop(e, block.id)}
                    onDragEnd={onDragEnd}
                  >
                    <div className="block-actions">
                      <button
                        className="drag-handle"
                        draggable
                        onDragStart={(e) => onDragStart(e, block.id)}
                        aria-label="Reordenar bloque"
                        title="Arrastrar para reordenar"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M4 7h16v2H4zM4 11h16v2H4zM4 15h16v2H4z"></path>
                        </svg>
                      </button>

                      <button onClick={() => handleDeleteBlock(block.id)} className="delete-block-btn" title="Eliminar bloque">
                        <CloseIcon width={32} height={32} />
                      </button>
                    </div>

                    <h4 className="block-title">{block.type}</h4>

                    {/* SERIES Y REPETICIONES */}
                    {block.type === "Series y repeticiones" && (
                      <div className="sets-reps-ctn">
                        {block.data.setsReps.map((setRep, idx) => (
                          <div key={idx} className="sets-row">
                            <input
                              type="text"
                              className="series-input"
                              placeholder="ej. 5x5"
                              value={setRep.series}
                              onChange={e => handleSetRepChange(block.id, idx, 'series', e.target.value)}
                            />
                            <div className="exercise-cell">
                              <input
                                type="text"
                                className="exercise-input"
                                placeholder={setRep.placeholderExercise}
                                value={setRep.exercise}
                                onChange={e => handleExerciseInputChange(block.id, idx, e.target.value)}
                              />
                              {(suggestions[`${sugKeyPrefix}${idx}`] || []).length > 0 && (
                                <ul className="suggestions-list">
                                  {suggestions[`${sugKeyPrefix}${idx}`].map(ex => (
                                    <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                      {ex.nombre}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <input
                              type="text"
                              className="weight-input"
                              placeholder="ej. 30kg"
                              value={setRep.weight}
                              onChange={e => handleSetRepChange(block.id, idx, 'weight', e.target.value)}
                              aria-label="Peso"
                            />
                            <button onClick={() => handleDeleteSetRep(block.id, idx)} className="delete-set-btn" title="Eliminar este set">–</button>
                          </div>
                        ))}
                        <PrimaryButton text="+" linkTo="#" onClick={() => handleAddSetRep(block.id)} />
                      </div>
                    )}

                    {/* RONDAS */}
                    {block.type === "Rondas" && (
                      <div className="rondas-ctn">
                        <div className="cantidad-rondas-descanso">
                          <div className='cant-rondas-subctn'>
                            <input className='cant-rondas-subctn-input-chico' placeholder="3" value={block.data.rounds} onChange={(e) => handleBlockFieldChange(block.id, 'rounds', e.target.value)} />
                            <span> rondas con </span>
                          </div>
                          <div className='cant-rondas-subctn'>
                            <input className='cant-rondas-subctn-input-chico' placeholder="90" value={block.data.descanso} onChange={(e) => handleBlockFieldChange(block.id, 'descanso', e.target.value)} />
                            <span> segundos de descanso </span>
                          </div>
                        </div>

                        <div className="sets-reps-ctn">
                          {block.data.setsReps.map((setRep, idx) => (
                            <div key={idx} className="sets-row">
                              <input
                                type="text"
                                className="series-input"
                                placeholder="ej. 3x12"
                                value={setRep.series}
                                onChange={e => handleSetRepChange(block.id, idx, 'series', e.target.value)}
                              />
                              <div className="exercise-cell">
                                <input
                                  type="text"
                                  className="exercise-input"
                                  placeholder={setRep.placeholderExercise}
                                  value={setRep.exercise}
                                  onChange={e => handleExerciseInputChange(block.id, idx, e.target.value)}
                                />
                                {(suggestions[`${sugKeyPrefix}${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${sugKeyPrefix}${idx}`].map(ex => (
                                      <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <input
                                type="text"
                                className="weight-input"
                                placeholder="-"
                                value={setRep.weight}
                                onChange={e => handleSetRepChange(block.id, idx, 'weight', e.target.value)}
                                aria-label="Peso"
                              />
                              <button onClick={() => handleDeleteSetRep(block.id, idx)} className="delete-set-btn" title="Eliminar este set">–</button>
                            </div>
                          ))}
                          <PrimaryButton text="+" linkTo="#" onClick={() => handleAddSetRep(block.id)} />
                        </div>
                      </div>
                    )}

                    {/* EMOM */}
                    {block.type === "EMOM" && (
                      <div className="emom-ctn">
                        <div className="cantidad-emom-ctn">
                          <div className='cant-rondas-subctn'>
                            <span> Cada </span>
                            <input className='cant-rondas-subctn-input-chico' placeholder="1" value={block.data.interval} onChange={(e) => handleBlockFieldChange(block.id, 'interval', e.target.value)} />
                            <input className='cant-rondas-subctn-input-grande' placeholder="minuto" disabled />
                          </div>
                          <div className='cant-rondas-subctn'>
                            <span> por </span>
                            <input className='cant-rondas-subctn-input-chico' placeholder="20" value={block.data.totalMinutes} onChange={(e) => handleBlockFieldChange(block.id, 'totalMinutes', e.target.value)} />
                            <input className='cant-rondas-subctn-input-grande' placeholder="minutos" disabled />
                          </div>
                        </div>

                        <div className="sets-reps-ctn">
                          {block.data.setsReps.map((setRep, idx) => (
                            <div key={idx} className="sets-row">
                              <input
                                type="text"
                                className="series-input"
                                placeholder="ej. 10"
                                value={setRep.series}
                                onChange={e => handleSetRepChange(block.id, idx, 'series', e.target.value)}
                              />
                              <div className="exercise-cell">
                                <input
                                  type="text"
                                  className="exercise-input"
                                  placeholder={setRep.placeholderExercise}
                                  value={setRep.exercise}
                                  onChange={e => handleExerciseInputChange(block.id, idx, e.target.value)}
                                />
                                {(suggestions[`${sugKeyPrefix}${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${sugKeyPrefix}${idx}`].map(ex => (
                                      <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <input
                                type="text"
                                className="weight-input"
                                placeholder="-"
                                value={setRep.weight}
                                onChange={e => handleSetRepChange(block.id, idx, 'weight', e.target.value)}
                                aria-label="Peso"
                              />
                              <button onClick={() => handleDeleteSetRep(block.id, idx)} className="delete-set-btn" title="Eliminar este set">–</button>
                            </div>
                          ))}
                          <PrimaryButton text="+" linkTo="#" onClick={() => handleAddSetRep(block.id)} />
                        </div>
                      </div>
                    )}

                    {/* AMRAP */}
                    {block.type === "AMRAP" && (
                      <div className="amrap-ctn">
                        <div className="cantidad-amrap-ctn">
                          <span> AMRAP de </span>
                          <input className='cant-rondas-subctn-input-chico' placeholder="20" value={block.data.duration} onChange={(e) => handleBlockFieldChange(block.id, 'duration', e.target.value)} />
                          <input className='cant-rondas-subctn-input-grande' placeholder="minutos" disabled />
                        </div>

                        <div className="sets-reps-ctn">
                          {block.data.setsReps.map((setRep, idx) => (
                            <div key={idx} className="sets-row">
                              <input
                                type="text"
                                className="series-input"
                                placeholder="ej. 12"
                                value={setRep.series}
                                onChange={e => handleSetRepChange(block.id, idx, 'series', e.target.value)}
                              />
                              <div className="exercise-cell">
                                <input
                                  type="text"
                                  className="exercise-input"
                                  placeholder={setRep.placeholderExercise}
                                  value={setRep.exercise}
                                  onChange={e => handleExerciseInputChange(block.id, idx, e.target.value)}
                                />
                                {(suggestions[`${sugKeyPrefix}${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${sugKeyPrefix}${idx}`].map(ex => (
                                      <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <input
                                type="text"
                                className="weight-input"
                                placeholder="-"
                                value={setRep.weight}
                                onChange={e => handleSetRepChange(block.id, idx, 'weight', e.target.value)}
                                aria-label="Peso"
                              />
                              <button onClick={() => handleDeleteSetRep(block.id, idx)} className="delete-set-btn" title="Eliminar este set">–</button>
                            </div>
                          ))}
                          <PrimaryButton text="+" linkTo="#" onClick={() => handleAddSetRep(block.id)} />
                        </div>
                      </div>
                    )}

                    {/* ESCALERA */}
                    {block.type === "Escalera" && (
                      <div className="escalera-ctn">
                        <div className="cantidad-escalera-ctn">
                          <input
                            className='cant-rondas-subctn-input-grande'
                            placeholder="Ej. 21-15-9"
                            value={block.data.escaleraType}
                            onChange={(e) => handleBlockFieldChange(block.id, 'escaleraType', e.target.value)}
                          />
                        </div>

                        <div className="sets-reps-ctn">
                          {block.data.setsReps.map((setRep, idx) => (
                            <div key={idx} className="sets-ladder sets-row--no-series">
                              <div className="exercise-cell" style={{ width: '100%'}}>
                                <input
                                  style={{ width: '100%'}}
                                  type="text"
                                  className="exercise-input"
                                  placeholder={setRep.placeholderExercise}
                                  value={setRep.exercise}
                                  onChange={e => handleExerciseInputChange(block.id, idx, e.target.value)}
                                />
                                {(suggestions[`${sugKeyPrefix}${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${sugKeyPrefix}${idx}`].map(ex => (
                                      <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <input
                                type="text"
                                className="weight-input"
                                placeholder="ej. 24kg"
                                value={setRep.weight}
                                onChange={e => handleSetRepChange(block.id, idx, 'weight', e.target.value)}
                                aria-label="Peso"
                              />
                              <button onClick={() => handleDeleteSetRep(block.id, idx)} className="delete-set-btn" title="Eliminar este set">–</button>
                            </div>
                          ))}
                          <PrimaryButton text="+" linkTo="#" onClick={() => handleAddSetRep(block.id)} />
                        </div>
                      </div>
                    )}

                    {/* TABATA */}
                    {block.type === "TABATA" && (
                      <div className="tabata-ctn">
                        <div className="cantidad-tabata-ctn">
                          <span> TABATA de </span>
                          <input
                            className='cant-rondas-subctn-input-chico'
                            placeholder="4"
                            value={block.data.duration}
                            onChange={(e) => handleBlockFieldChange(block.id, 'duration', e.target.value)}
                          />
                          <input className='cant-rondas-subctn-input-grande' placeholder="minutos" disabled />
                        </div>

                        <div className="sets-reps-ctn">
                          {block.data.setsReps.map((setRep, idx) => (
                            <div key={idx} className="sets-row">
                              <input
                                type="text"
                                className="series-input"
                                placeholder="ej. 20s on / 10s off"
                                value={setRep.series}
                                onChange={e => handleSetRepChange(block.id, idx, 'series', e.target.value)}
                              />
                              <div className="exercise-cell">
                                <input
                                  type="text"
                                  className="exercise-input"
                                  placeholder={setRep.placeholderExercise}
                                  value={setRep.exercise}
                                  onChange={e => handleExerciseInputChange(block.id, idx, e.target.value)}
                                />
                                {(suggestions[`${sugKeyPrefix}${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${sugKeyPrefix}${idx}`].map(ex => (
                                      <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                              <input
                                type="text"
                                className="weight-input"
                                placeholder="-"
                                value={setRep.weight}
                                onChange={e => handleSetRepChange(block.id, idx, 'weight', e.target.value)}
                                aria-label="Peso"
                              />
                              <button onClick={() => handleDeleteSetRep(block.id, idx)} className="delete-set-btn" title="Eliminar este set">–</button>
                            </div>
                          ))}
                          <PrimaryButton text="+" linkTo="#" onClick={() => handleAddSetRep(block.id)} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearRutina;