import React, { useState, useEffect } from 'react';
import '../../../App.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu.jsx';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown.jsx';
import CustomInput from '../../../Components/utils/CustomInput/CustomInput.jsx';
import './CrearRutina.css';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton.jsx';
import apiService from '../../../services/apiService';
import { toast } from "react-toastify";
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton.jsx';

const CrearRutina = ({ fromAdmin, fromEntrenador }) => {
  const { rutinaId } = useParams();
  const isEditing = Boolean(rutinaId);

  const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

  const apiToDisplayType = {
    SETS_REPS: 'Series y repeticiones',
    ROUNDS: 'Rondas',
    EMOM: 'EMOM',
    AMRAP: 'AMRAP',
    LADDER: 'Escalera'
  };

  const tiposDeSerie = ["Series y repeticiones", "Rondas", "EMOM", "AMRAP", "Escalera"];

  const [step, setStep] = useState(1);

  // Step 1
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [selectedDias, setSelectedDias] = useState([]);
  const [dropdownDiaValue, setDropdownDiaValue] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [clases, setClases] = useState([]);
  const [selectedClase, setSelectedClase] = useState("");
  const [selectedGrupoMuscular, setSelectedGrupoMuscular] = useState("");
  const gruposMusculares = ["Pecho", "Espalda", "Piernas", "Brazos", "Hombros", "Abdominales", "Glúteos", "Tren Superior", "Tren Inferior", "Full Body"];

  // Step 2
  const [blocks, setBlocks] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  const [loading, setLoading] = useState(false);

  // Drag & drop
  const [draggingBlockId, setDraggingBlockId] = useState(null);
  const [dragOverBlockId, setDragOverBlockId] = useState(null);

  const exampleExercises = [
    "Pecho plano 60kg", "Flexiones de brazo", "Press de hombro 60kg", "Sentadillas con barra 80kg",
    "Remo con mancuerna 40kg", "Dominadas", "Elevaciones laterales 8kg",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    apiService.getEjercicios()
      .then(res => setAllExercises(res))
      .catch(() => toast.error('No se pudieron cargar los ejercicios'));
  }, []);

  const getRandomExercise = () => exampleExercises[Math.floor(Math.random() * exampleExercises.length)];

  const initialBlockData = {
    'Series y repeticiones': { setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise(), exerciseId: null }] },
    'Rondas': { rounds: '', descanso: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise(), exerciseId: null }] },
    'EMOM': { interval: '', totalMinutes: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise(), exerciseId: null }] },
    'AMRAP': { duration: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise(), exerciseId: null }] },
    'Escalera': { escaleraType: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise(), exerciseId: null }] },
  };

  const convertApiBlockData = (b) => {
    const items = Array.isArray(b.bloqueEjercicios) ? b.bloqueEjercicios
      : Array.isArray(b.ejercicios) ? b.ejercicios : [];

    const mappedSets = items.map((e) => {
      const nombreEj = e.setRepWeight ?? e?.ejercicio?.nombre ?? e?.nombre ?? '';
      const idEj = e.ID_Ejercicio ?? e?.ejercicio?.ID_Ejercicio ?? null;
      const reps = e.reps ?? e.setsReps ?? '';
      return { series: reps, exercise: nombreEj, placeholderExercise: '', exerciseId: idEj };
    });

    switch (b.type) {
      case 'SETS_REPS':
        if (mappedSets.length === 0 && (b.nombreEj || b.setsReps)) {
          mappedSets.push({ series: b.setsReps || '', exercise: b.nombreEj || '', placeholderExercise: '', exerciseId: null });
        }
        return { setsReps: mappedSets };
      case 'ROUNDS':
        return { rounds: b.cantRondas ?? '', descanso: b.descansoRonda ?? '', setsReps: mappedSets };
      case 'EMOM':
        return { interval: '', totalMinutes: b.durationMin ?? '', setsReps: mappedSets };
      case 'AMRAP':
        return { duration: b.durationMin ?? '', setsReps: mappedSets };
      case 'LADDER':
        return { escaleraType: b.tipoEscalera ?? '', setsReps: mappedSets };
      default:
        return { setsReps: mappedSets };
    }
  };

  const handleSelectDia = (dia) => { if (!selectedDias.includes(dia)) setSelectedDias(prev => [...prev, dia]); };
  const handleRemoveDia = (dia) => setSelectedDias(prev => prev.filter(d => d !== dia));

  useEffect(() => {
    if (fromEntrenador) {
      apiService.getAllUsuarios()
        .then(res => setUsers(res.data))
        .catch(() => toast.error('No se pudieron cargar los usuarios'));
    }
  }, [fromEntrenador]);

  useEffect(() => {
    if (isEditing && (!fromEntrenador || users.length > 0)) {
      fetchRoutine();
    }
  }, [isEditing, fromEntrenador, users]);

  useEffect(() => {
    apiService.getClases()
      .then(res => setClases(res))
      .catch(() => toast.error('No se pudieron cargar las clases'));
  }, []);

  const fetchRoutine = async () => {
    setLoading(true);
    try {
      const resp = await apiService.getRutinaById(rutinaId);
      const r = resp?.rutina ?? resp;

      setFormData({ nombre: r.nombre || '', descripcion: r.desc || '' });
      setSelectedDias(Array.isArray(r.DiasRutina) ? r.DiasRutina : []);
      setSelectedClase(r.claseRutina || "");
      setSelectedGrupoMuscular(r.grupoMuscularRutina || "");

      if (fromEntrenador) {
        const alumnoEmail = r?.alumno?.email ?? r?.alumnoEmail ?? null;
        const alumnoId = r?.ID_Usuario ?? r?.alumno?.ID_Usuario ?? null;
        let selected = null;
        if (alumnoEmail) selected = alumnoEmail;
        else if (alumnoId) {
          const u = users.find(u => u.ID_Usuario === alumnoId);
          selected = u?.email ?? null;
        } else if (r?.alumno?.nombre || r?.alumno?.apellido) {
          const full = `${r?.alumno?.nombre ?? ''}`.trim().toLowerCase() + '|' + `${r?.alumno?.apellido ?? ''}`.trim().toLowerCase();
          const u = users.find(u => (`${u.nombre}`.trim().toLowerCase() + '|' + `${u.apellido}`.trim().toLowerCase()) === full && u.tipo === 'cliente');
          selected = u?.email ?? null;
        }
        setSelectedEmail(selected);
      }

      const loaded = Array.isArray(r.Bloques)
        ? r.Bloques.map(b => ({ id: b.ID_Bloque, type: apiToDisplayType[b.type] || b.type, data: convertApiBlockData(b) }))
        : [];
      setBlocks(loaded);
      setStep(1);
    } catch {
      toast.error('No se pudo cargar la rutina para editar');
    } finally { setLoading(false); }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return toast.error("Por favor, ingresa un nombre para la rutina");
    if (selectedDias.length === 0) return toast.error("Por favor, selecciona al menos un día de la semana");
    if (!selectedClase) return toast.error("Por favor, selecciona una clase");
    if (fromEntrenador && !selectedEmail) return toast.error("Por favor, selecciona un usuario antes de continuar");
    setStep(2);
  };

  // ---- Step 2 handlers ----
  const handleExerciseInputChange = (blockId, idx, value) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newSets = block.data.setsReps.map((sr, i) => i === idx ? { ...sr, exercise: value, exerciseId: null } : sr);
        return { ...block, data: { ...block.data, setsReps: newSets } };
      }
      return block;
    }));

    const key = `${blockId}-${idx}`;
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
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newSets = block.data.setsReps.map((sr, i) =>
          i === idx ? { ...sr, exercise: exerciseObj.nombre, exerciseId: exerciseObj.ID_Ejercicio } : sr
        );
        return { ...block, data: { ...block.data, setsReps: newSets } };
      }
      return block;
    }));
    setSuggestions({ ...suggestions, [`${blockId}-${idx}`]: [] });
  };

  const handleAddBlock = (e) => {
    const selectedType = e.target.value;
    const newBlock = { id: Date.now(), type: selectedType, data: { ...initialBlockData[selectedType] } };
    setBlocks([...blocks, newBlock]);
  };

  const handleDeleteBlock = (blockId) => setBlocks(blocks.filter(b => b.id !== blockId));

  const handleBlockFieldChange = (blockId, field, value) => {
    setBlocks(blocks.map(block => block.id === blockId
      ? { ...block, data: { ...block.data, [field]: value } }
      : block
    ));
  };

  const handleSetRepChange = (blockId, index, field, value) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newSetsReps = block.data.setsReps.map((sr, i) => i === index ? { ...sr, [field]: value } : sr);
        return { ...block, data: { ...block.data, setsReps: newSetsReps } };
      }
      return block;
    }));
  };

  const handleAddSetRep = (blockId) => {
    setBlocks(blocks.map(block => block.id === blockId
      ? { ...block, data: { ...block.data, setsReps: [...block.data.setsReps, { series: '', exercise: '', placeholderExercise: getRandomExercise(), exerciseId: null }] } }
      : block
    ));
  };

  const handleDeleteSetRep = (blockId, index) => {
    setBlocks(blocks.map(block => block.id === blockId
      ? { ...block, data: { ...block.data, setsReps: block.data.setsReps.filter((_, i) => i !== index) } }
      : block
    ));
  };

  const prepareRutinaData = () => {
    const userId = fromEntrenador
      ? users.find(u => u.email === selectedEmail)?.ID_Usuario
      : localStorage.getItem("usuarioId");

    const entrenadorId = fromEntrenador ? Number(localStorage.getItem("usuarioId")) : null;

    const bloques = blocks.map(block => {
      const bloqueEjercicios = block.data.setsReps.map(setRep => {
        if (setRep.exerciseId) {
          return { ejercicioId: setRep.exerciseId, reps: setRep.series, setRepWeight: setRep.exercise };
        } else {
          return { nuevoEjercicio: { nombre: setRep.exercise }, reps: setRep.series, setRepWeight: null };
        }
      });

      switch (block.type) {
        case 'Series y repeticiones':
          return { type: "SETS_REPS", setsReps: block.data.setsReps[0]?.series || null, bloqueEjercicios };
        case 'Rondas':
          return { type: "ROUNDS", cantRondas: parseInt(block.data.rounds, 10) || null, descansoRonda: parseInt(block.data.descanso, 10) || null, bloqueEjercicios };
        case 'EMOM':
          return { type: "EMOM", durationMin: parseInt(block.data.totalMinutes, 10) || null, bloqueEjercicios };
        case 'AMRAP':
          return { type: "AMRAP", durationMin: parseInt(block.data.duration, 10) || null, bloqueEjercicios };
        case 'Escalera':
          return { type: "LADDER", tipoEscalera: block.data.escaleraType || null, bloqueEjercicios };
        default:
          return {};
      }
    });

    return {
      ID_Usuario: Number(userId),
      ID_Entrenador: entrenadorId,
      nombre: formData.nombre,
      desc: formData.descripcion,
      claseRutina: selectedClase,
      grupoMuscularRutina: selectedGrupoMuscular,
      dias: selectedDias,
      bloques
    };
  };

  const resetForm = () => {
    setStep(1);
    setFormData({ nombre: '', descripcion: '' });
    setSelectedDias([]);
    setDropdownDiaValue("");
    setSelectedClase("");
    setSelectedGrupoMuscular("");
    setSelectedEmail(null);
    setBlocks([]);
    setSuggestions({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    const data = prepareRutinaData();
    try {
      if (isEditing) {
        await apiService.editRutina(rutinaId, data);
        toast.success('Rutina actualizada correctamente');
        if (fromEntrenador) navigate('/entrenador/rutinas-asignadas');
      } else {
        await apiService.createRutina(data);
        toast.success('Rutina creada correctamente');
      }
      if (fromAdmin) navigate('/admin/rutinas');
      else if (fromEntrenador) { if (!isEditing) { setStep(1); resetForm(); } }
      else navigate('/alumno/mi-rutina');
    } catch {
      toast.error(isEditing ? 'Error actualizando rutina' : 'Error creando rutina');
    } finally { setLoading(false); }
  };

  // ===== Drag & Drop helpers =====
  const onDragStart = (e, blockId) => {
    setDraggingBlockId(blockId);
    e.dataTransfer.setData('text/plain', String(blockId));
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e, overId) => {
    e.preventDefault(); // necesario para drop
    setDragOverBlockId(overId);
  };

  const onDrop = (e, toId) => {
    e.preventDefault();
    const fromId = Number(e.dataTransfer.getData('text/plain'));
    if (!fromId || fromId === toId) {
      setDraggingBlockId(null);
      setDragOverBlockId(null);
      return;
    }

    const fromIndex = blocks.findIndex(b => b.id === fromId);
    const toIndex = blocks.findIndex(b => b.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;

    const newOrder = [...blocks];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved); // lo insertamos antes del target
    setBlocks(newOrder);

    setDraggingBlockId(null);
    setDragOverBlockId(null);
  };

  const onDragEnd = () => {
    setDraggingBlockId(null);
    setDragOverBlockId(null);
  };

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

        {step === 1 && (
          <div className="crear-rutina-step1">
            <div className="crear-rutina-step-1-form">
              <CustomInput
                placeholder="Nombre de la rutina"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
              <CustomInput
                placeholder="Descripción (opcional)"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />

              <CustomDropdown
                id="dias"
                name="dias"
                placeholderOption="Seleccionar día"
                options={diasSemana}
                value={dropdownDiaValue}
                onChange={e => { setSelectedDias(prev => prev.includes(e.target.value) ? prev : [...prev, e.target.value]); setDropdownDiaValue(""); }}
              />

              {selectedDias.length > 0 && (
                <div className="selected-tags">
                  {selectedDias.map(dia => (
                    <div key={dia} className="tag">
                      <span>{dia}</span>
                      <CloseIcon className="tag-close" width={16} height={16} onClick={() => handleRemoveDia(dia)} />
                    </div>
                  ))}
                </div>
              )}

              <CustomDropdown
                id="claseRutina"
                name="claseRutina"
                placeholderOption="Seleccionar clase"
                options={clases.map(c => c.nombre)}
                value={selectedClase}
                onChange={e => setSelectedClase(e.target.value)}
              />

              <CustomDropdown
                id="grupoMuscular"
                name="grupoMuscular"
                placeholderOption="Seleccionar grupo muscular"
                options={gruposMusculares}
                value={selectedGrupoMuscular}
                onChange={e => setSelectedGrupoMuscular(e.target.value)}
              />

              {fromEntrenador && (
                <Select
                  options={users.filter(u => u.tipo === "cliente").map(u => ({
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

        {step === 2 && (
          <div className="crear-rutina-step2">
            <div className="crear-rutina-step-2-form">

              {/* Volver al paso 1 */}
              <SecondaryButton text="← Volver" linkTo="#" onClick={() => setStep(1)} style={{ marginBottom: '16px' }} />

              <div className='agregar-bloque-ctn'>
                <p> Agregar bloque: </p>
                <CustomDropdown
                  placeholderOption="Tipo de serie"
                  options={tiposDeSerie}
                  value=""
                  onChange={handleAddBlock}
                />
              </div>

              {blocks.map((block) => {
                const isDragging = draggingBlockId === block.id;
                const isOver = dragOverBlockId === block.id;

                return (
                  <div
                    key={block.id}
                    className={`block-container ${isDragging ? 'block--dragging' : ''} ${isOver ? 'block--over' : ''}`}
                    onDragOver={(e) => onDragOver(e, block.id)}
                    onDrop={(e) => onDrop(e, block.id)}
                    onDragEnd={onDragEnd}
                  >
                    <div className="block-actions">
                      {/* Drag handle */}
                      <button
                        className="drag-handle"
                        draggable
                        onDragStart={(e) => onDragStart(e, block.id)}
                        aria-label="Reordenar bloque"
                        title="Arrastrar para reordenar"
                      >
                        {/* icono hamburguesa simple */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M4 7h16v2H4zM4 11h16v2H4zM4 15h16v2H4z"></path>
                        </svg>
                      </button>

                      {/* Delete */}
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
                              {(suggestions[`${block.id}-${idx}`] || []).length > 0 && (
                                <ul className="suggestions-list">
                                  {suggestions[`${block.id}-${idx}`].map(ex => (
                                    <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                      {ex.nombre}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <button onClick={() => handleDeleteSetRep(block.id, idx)} className="delete-set-btn" title="Eliminar este set" aria-label="Eliminar set">–</button>
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
                            <input className='cant-rondas-subctn-input-chico' placeholder="3" value={block.data.rounds} onChange={(e) => handleBlockFieldChange(block.id, 'rounds', e.target.value)} width={30} />
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
                                {(suggestions[`${block.id}-${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${block.id}-${idx}`].map(ex => (
                                      <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
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
                            <input className='cant-rondas-subctn-input-chico' placeholder="1" width="45px" value={block.data.interval} onChange={(e) => handleBlockFieldChange(block.id, 'interval', e.target.value)} />
                            <input className='cant-rondas-subctn-input-grande' placeholder="minuto" width="100px" disabled />
                          </div>
                          <div className='cant-rondas-subctn'>
                            <span> por </span>
                            <input className='cant-rondas-subctn-input-chico' placeholder="20" width="45px" value={block.data.totalMinutes} onChange={(e) => handleBlockFieldChange(block.id, 'totalMinutes', e.target.value)} />
                            <input className='cant-rondas-subctn-input-grande' placeholder="minutos" width="100px" disabled />
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
                                {(suggestions[`${block.id}-${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${block.id}-${idx}`].map(ex => (
                                      <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
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
                          <input className='cant-rondas-subctn-input-chico' placeholder="20" width="45px" value={block.data.duration} onChange={(e) => handleBlockFieldChange(block.id, 'duration', e.target.value)} />
                          <input className='cant-rondas-subctn-input-grande' placeholder="minutos" width="100px" disabled />
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
                                {(suggestions[`${block.id}-${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${block.id}-${idx}`].map(ex => (
                                      <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
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
                                {(suggestions[`${block.id}-${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${block.id}-${idx}`].map(ex => (
                                      <li key={ex.ID_Ejercicio} onClick={() => handleSelectSuggestion(block.id, idx, ex)}>
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
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