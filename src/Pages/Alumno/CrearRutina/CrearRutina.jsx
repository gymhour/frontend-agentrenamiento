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

const CrearRutina = ({ fromAdmin, fromEntrenador }) => {
  // Id de rutina si se esta editando
  const { rutinaId } = useParams();
  const isEditing = Boolean(rutinaId);

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo"
  ];

  // Helpers para mapear tipos API <-> UI
  const apiToDisplayType = {
    SETS_REPS: 'Series y repeticiones',
    ROUNDS: 'Rondas',
    EMOM: 'EMOM',
    AMRAP: 'AMRAP',
    LADDER: 'Escalera'
  };

  const tiposDeSerie = [
    "Series y repeticiones",
    "Rondas",
    "EMOM",
    "AMRAP",
    "Escalera"
  ];

  const [step, setStep] = useState(1);

  // Datos del step1
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });
  // en lugar de formData.diaSemana
  const [selectedDias, setSelectedDias] = useState([]);
  const [dropdownDiaValue, setDropdownDiaValue] = useState("");

  // Para fetch y selección de usuarios (sólo aplica a entrenador)
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Desplegable de clases
  const [clases, setClases] = useState([]);
  const [selectedClase, setSelectedClase] = useState("");

  // Grupos musculares
  const gruposMusculares = [
    "Pecho",
    "Espalda",
    "Piernas",
    "Brazos",
    "Hombros",
    "Abdominales",
    "Glúteos",
    "Tren Superior",
    "Tren Inferior",
    "Full Body"
  ];
  const [selectedGrupoMuscular, setSelectedGrupoMuscular] = useState("");

  // Estados para step2
  const [blocks, setBlocks] = useState([]);
  const [showBlockTypeDropdown, setShowBlockTypeDropdown] = useState(false);

  // Desplegable de ejercicios
  const [allExercises, setAllExercises] = useState([]);
  const [suggestions, setSuggestions] = useState({});

  const [loading, setLoading] = useState(false);

  const exampleExercises = [
    "Pecho plano 60kg",
    "Flexiones de brazo",
    "Press de hombro 60kg",
    "Sentadillas con barra 80kg",
    "Remo con mancuerna 40kg",
    "Dominadas",
    "Elevaciones laterales 8kg",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    apiService.getEjercicios()
      .then(res => {
        console.log("Res", res)
        setAllExercises(res)
      })
      .catch(() => toast.error('No se pudieron cargar los ejercicios'));
  }, []);

  const getRandomExercise = () => exampleExercises[Math.floor(Math.random() * exampleExercises.length)];

  // Objetos iniciales para cada tipo de bloque
  const initialBlockData = {
    'Series y repeticiones': { setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise(), exerciseId: null }] },
    'Rondas': { rounds: '', descanso: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise() }] },
    'EMOM': { interval: '', totalMinutes: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise() }] },
    'AMRAP': { duration: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise() }] },
    'Escalera': { escaleraType: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise() }] },
  };

  // Convertir bloque API a data interna
  const convertApiBlockData = b => {
    // Si es escalera, solo mapeamos ejercicios (no metemos el empty placeholder)
    if (b.type === 'LADDER') {
      return {
        escaleraType: b.tipoEscalera || '',
        setsReps: (b.ejercicios || []).map(e => ({
          series: '',
          exercise: e.setRepWeight,
          placeholderExercise: ''
        }))
      };
    }

    // Para los demás tipos, mantenemos la lógica previa
    const common = [];
    if (b.nombreEj || b.setsReps !== undefined) {
      common.push({
        series: b.setsReps || '',
        exercise: b.nombreEj || '',
        placeholderExercise: '',
        exerciseId: null
      });
    }
    (b.ejercicios || []).forEach(e => {
      common.push({
        series: e.reps,
        exercise: e.setRepWeight,
        placeholderExercise: '',
        exerciseId: null
      });
    });

    switch (b.type) {
      case 'SETS_REPS':
        return { setsReps: common };
      case 'ROUNDS':
        return {
          rounds: b.cantRondas || '',
          descanso: b.descansoRonda || '',
          setsReps: common
        };
      case 'EMOM':
        return {
          interval: '',
          totalMinutes: b.durationMin || '',
          setsReps: common
        };
      case 'AMRAP':
        return {
          duration: b.durationMin || '',
          setsReps: common
        };
      default:
        return { setsReps: common };
    }
  };


  const handleSelectDia = (dia) => {
    if (!selectedDias.includes(dia)) {
      setSelectedDias(prev => [...prev, dia]);
    }
  };

  const handleRemoveDia = (dia) => {
    setSelectedDias(prev => prev.filter(d => d !== dia));
  };


  // 1) Solo carga usuarios al montar (o al cambiar fromEntrenador)
  useEffect(() => {
    if (fromEntrenador) {
      apiService.getAllUsuarios()
        .then(res => setUsers(res.data))
        .catch(() => toast.error('No se pudieron cargar los usuarios'));
    }
  }, [fromEntrenador]);

  // 2) Cuando esté listo el mundo (isEditing y usuarios cargados), fetchRoutine()
  useEffect(() => {
    if (isEditing && (!fromEntrenador || users.length > 0)) {
      fetchRoutine();
    }
  }, [isEditing, fromEntrenador, users]);

  // Fetch clases para el dropdown
  useEffect(() => {
    apiService.getClases()
      .then(res => setClases(res))
      .catch(() => toast.error('No se pudieron cargar las clases'));
  }, []);

  // Fetch routine to edit
  const fetchRoutine = async () => {
    setLoading(true);
    try {
      const resp = await apiService.getRutinaById(rutinaId);
      // step 1 data
      setFormData({ nombre: resp.nombre, descripcion: resp.desc });
      setSelectedDias(resp.DiasRutina);
      setSelectedClase(resp.claseRutina || "");
      setSelectedGrupoMuscular(resp.grupoMuscularRutina || "");
      if (fromEntrenador) {
        const user = users.find(u => u.ID_Usuario === resp.ID_Usuario);
        setSelectedEmail(user?.email || null);
      }
      // step 2 blocks
      const loaded = resp.Bloques.map(b => ({
        id: b.ID_Bloque,
        type: apiToDisplayType[b.type] || b.type,
        data: convertApiBlockData(b)
      }));
      setBlocks(loaded);
      setStep(1);
    } catch {
      toast.error('No se pudo cargar la rutina para editar');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 1: Continuar ---
  const handleContinue = (e) => {
    e.preventDefault();

    // 1) Nombre (requerido)
    if (!formData.nombre.trim()) {
      toast.error("Por favor, ingresa un nombre para la rutina");
      return;
    }

    // 2) Días de la semana (al menos uno)
    if (selectedDias.length === 0) {
      toast.error("Por favor, selecciona al menos un día de la semana");
      return;
    }

    // 3) Clase (requerida)
    if (!selectedClase) {
      toast.error("Por favor, selecciona una clase");
      return;
    }

    // 4) Usuario (sólo si viene fromEntrenador)
    if (fromEntrenador && !selectedEmail) {
      toast.error("Por favor, selecciona un usuario antes de continuar");
      return;
    }

    console.log("Datos del step1:", formData, "Usuario seleccionado:", selectedEmail);
    setStep(2);
  };

  // --- STEP 2: Agregar Bloque ---
  // Ejercicios
  // Cuando el usuario escribe en el ejercicio:
  const handleExerciseInputChange = (blockId, idx, value) => {
    // 1) Actualizo el valor en el estado blocks
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newSets = block.data.setsReps.map((setRep, i) => {
          if (i === idx) {
            return {
              ...setRep,
              exercise: value,
              exerciseId: null   // reset si estaban seleccionadas antes
            };
          }
          return setRep;
        });
        return { ...block, data: { ...block.data, setsReps: newSets } };
      }
      return block;
    }));

    const key = `${blockId}-${idx}`;

    // Si el input está vacío (o sólo espacios), cierro el dropdown
    if (value.trim() === '') {
      setSuggestions(prev => ({
        ...prev,
        [key]: []
      }));
      return;
    }

    // 2) Filtro sugerencias (case-insensitive, substring)
    const lista = Array.isArray(allExercises) ? allExercises : [];
    const filtered = lista
      .filter(e => e.nombre.toLowerCase().includes(value.trim().toLowerCase()))
      .slice(0, 5);

    setSuggestions(prev => ({
      ...prev,
      [key]: filtered
    }));
  };

  // Cuando el usuario hace click en una sugerencia:
  const handleSelectSuggestion = (blockId, idx, exerciseObj) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newSets = block.data.setsReps.map((setRep, i) => {
          if (i === idx) {
            return {
              ...setRep,
              exercise: exerciseObj.nombre,
              exerciseId: exerciseObj.ID_Ejercicio
            };
          }
          return setRep;
        });
        return { ...block, data: { ...block.data, setsReps: newSets } };
      }
      return block;
    }));

    // limpio las sugerencias para ese campo
    setSuggestions({
      ...suggestions,
      [`${blockId}-${idx}`]: []
    });
  };

  const handleMostrarDropdown = () => {
    setShowBlockTypeDropdown(true);
  };

  const handleAddBlock = (e) => {
    const selectedType = e.target.value;
    const newBlock = {
      id: Date.now(), // para ejemplificar; en producción se usaría un id único
      type: selectedType,
      data: { ...initialBlockData[selectedType] }
    };
    setBlocks([...blocks, newBlock]);
    setShowBlockTypeDropdown(false);
  };

  // Función para eliminar un bloque
  const handleDeleteBlock = (blockId) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  // Actualiza un campo “simple” del bloque (por ejemplo, rounds, descanso, interval, etc.)
  const handleBlockFieldChange = (blockId, field, value) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return { ...block, data: { ...block.data, [field]: value } };
      }
      return block;
    }));
  };

  // Actualiza los campos de un sub-bloque (sets-reps)
  const handleSetRepChange = (blockId, index, field, value) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newSetsReps = block.data.setsReps.map((setRep, idx) => {
          if (idx === index) {
            return { ...setRep, [field]: value };
          }
          return setRep;
        });
        return { ...block, data: { ...block.data, setsReps: newSetsReps } };
      }
      return block;
    }));
  };

  // Agrega un nuevo objeto de sets-reps al bloque
  const handleAddSetRep = (blockId) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          data: {
            ...block.data,
            setsReps: [...block.data.setsReps, { series: '', exercise: '', placeholderExercise: getRandomExercise() }]
          }
        };
      }
      return block;
    }));
  };

  const handleDeleteSetRep = (blockId, index) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return {
          ...block,
          data: {
            ...block.data,
            setsReps: block.data.setsReps.filter((_, i) => i !== index)
          }
        };
      }
      return block;
    }));
  };

  const prepareRutinaData = () => {
    const userId = fromEntrenador
      ? users.find(u => u.email === selectedEmail)?.ID_Usuario
      : localStorage.getItem("usuarioId");

    const entrenadorId = fromEntrenador
      ? Number(localStorage.getItem("usuarioId"))
      : null;

    // Mapeamos cada bloque con su lista de bloqueEjercicios
    const bloques = blocks.map(block => {
      // Armar array de ejercicios para este bloque
      const bloqueEjercicios = block.data.setsReps.map(setRep => {
        if (setRep.exerciseId) {
          // Ejercicio existente
          return {
            ejercicioId: setRep.exerciseId,
            reps: setRep.series,
            setRepWeight: setRep.exercise
          };
        } else {
          // Ejercicio nuevo (solo nombre)
          return {
            nuevoEjercicio: { nombre: setRep.exercise },
            reps: setRep.series,
            setRepWeight: null
          };
        }
      });

      // Construir objeto del bloque según su tipo
      switch (block.type) {
        case 'Series y repeticiones':
          return {
            type: "SETS_REPS",
            setsReps: block.data.setsReps[0]?.series || null,
            bloqueEjercicios
          };
        case 'Rondas':
          return {
            type: "ROUNDS",
            cantRondas: parseInt(block.data.rounds, 10) || null,
            descansoRonda: parseInt(block.data.descanso, 10) || null,
            bloqueEjercicios
          };
        case 'EMOM':
          return {
            type: "EMOM",
            durationMin: parseInt(block.data.totalMinutes, 10) || null,
            bloqueEjercicios
          };
        case 'AMRAP':
          return {
            type: "AMRAP",
            durationMin: parseInt(block.data.duration, 10) || null,
            bloqueEjercicios
          };
        case 'Escalera':
          return {
            type: "LADDER",
            tipoEscalera: block.data.escaleraType || null,
            bloqueEjercicios
          };
        default:
          return {};
      }
    });

    // Devolver el objeto completo listo para enviar al endpoint
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

  // submit o update
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true);
    const data = prepareRutinaData();
    console.log("body", data)
    try {
      if (isEditing) {
        await apiService.editRutina(rutinaId, data);
        toast.success('Rutina actualizada correctamente');
      } else {
        await apiService.createRutina(data);
        toast.success('Rutina creada correctamente');
      }
      if (fromAdmin) navigate('/admin/rutinas');
      else if (fromEntrenador) {
        if (!isEditing) setStep(1);
        if (!isEditing) setFormData({ nombre: '', descripcion: '' });
      } else navigate('/alumno/mi-rutina');
    } catch {
      toast.error(isEditing ? 'Error actualizando rutina' : 'Error creando rutina');
    } finally { setLoading(false); }
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
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
              <CustomInput
                placeholder="Descripción (opcional)"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
              />
              {/* <CustomDropdown
                placeholderOption="Dia de la semana"
                options={diasSemana}
                value={formData.diaSemana}
                onChange={(e) =>
                  setFormData({ ...formData, diaSemana: e.target.value })
                }
              /> */}
              <CustomDropdown
                id="dias"
                name="dias"
                placeholderOption="Seleccionar día"
                options={diasSemana}
                value={dropdownDiaValue}
                onChange={e => {
                  handleSelectDia(e.target.value);
                  setDropdownDiaValue("");
                }}
              />
              {
                selectedDias.length > 0 &&
                <div className="selected-tags">
                  {selectedDias.map(dia => (
                    <div key={dia} className="tag">
                      <span>{dia}</span>
                      <CloseIcon
                        className="tag-close"
                        width={16}
                        height={16}
                        onClick={() => handleRemoveDia(dia)}
                      />
                    </div>
                  ))}
                </div>
              }

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

              {/* Si es entrenador, mostramos dropdown para buscar usuarios */}
              {fromEntrenador && (
                <Select
                  options={users.filter(u => u.tipo === "cliente").map(u => ({
                    label: `${u.nombre} ${u.apellido} (${u.email})`,
                    value: u.email
                  }))}
                  value={
                    selectedEmail
                      ? {
                        label: `${users.find(u => u.email === selectedEmail)?.nombre || ''} ${users.find(u => u.email === selectedEmail)?.apellido || ''
                          } (${selectedEmail})`,
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

              <PrimaryButton
                text="Continuar"
                linkTo="#"
                onClick={handleContinue}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="crear-rutina-step2">
            <div className="crear-rutina-step-2-form">
              <div className='agregar-bloque-ctn'>
                <p> Agregar bloque: </p>
                <CustomDropdown
                  placeholderOption="Tipo de serie"
                  options={tiposDeSerie}
                  value=""
                  onChange={handleAddBlock}
                />
              </div>

              {/* Renderizamos cada bloque agregado */}
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className="block-container"
                  style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.15)', padding: '10px', position: 'relative' }}
                >
                  {/* Botón de eliminación */}
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '5px',
                      background: 'transparent',
                      border: 'none',
                      fontSize: '16px',
                      cursor: 'pointer',
                      color: 'white'
                    }}
                    title="Eliminar bloque"
                  >
                    ✕
                  </button>
                  <h4 style={{ margin: '16px 0px' }} >{block.type}</h4>

                  {block.type === "Series y repeticiones" && (
                    <div className="sets-reps-ctn">
                      {block.data.setsReps.map((setRep, idx) => (
                        <div
                          key={idx}
                          className='sets-reps-subctn'
                          style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}
                        >
                          <CustomInput
                            placeholder="ej. 3x12"
                            width="80px"
                            value={setRep.series}
                            onChange={e =>
                              handleSetRepChange(block.id, idx, 'series', e.target.value)
                            }
                          />
                          <div style={{ position: 'relative', flex: 1 }}>
                            <CustomInput
                              placeholder={setRep.placeholderExercise}
                              width="350px"
                              value={setRep.exercise}
                              onChange={e =>
                                handleExerciseInputChange(block.id, idx, e.target.value)
                              }
                            />
                            {
                              (suggestions[`${block.id}-${idx}`] || []).length > 0 && (
                                <ul className="suggestions-list">
                                  {suggestions[`${block.id}-${idx}`].map(ex => (
                                    <li
                                      key={ex.ID_Ejercicio}
                                      onClick={() => handleSelectSuggestion(block.id, idx, ex)}
                                    >
                                      {ex.nombre}
                                    </li>
                                  ))}
                                </ul>
                              )
                            }
                          </div>

                          <button
                            onClick={() => handleDeleteSetRep(block.id, idx)}
                            style={{
                              marginLeft: '8px',
                              background: 'transparent',
                              border: 'none',
                              color: '#e55',
                              fontSize: '20px',
                              cursor: 'pointer'
                            }}
                            title="Eliminar este set"
                          >
                            –
                          </button>
                        </div>
                      ))}

                      <PrimaryButton
                        text="+"
                        linkTo="#"
                        onClick={() => handleAddSetRep(block.id)}
                      />
                    </div>
                  )}

                  {block.type === "Rondas" && (
                    <div className="rondas-ctn">
                      <div className="cantidad-rondas-descanso">
                        <CustomInput
                          placeholder="3"
                          width="60px"
                          value={block.data.rounds}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'rounds', e.target.value)
                          }
                        />
                        <span> rondas con </span>
                        <CustomInput
                          placeholder="90"
                          width="60px"
                          value={block.data.descanso}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'descanso', e.target.value)
                          }
                        />
                        <span> segundos de descanso </span>
                      </div>
                      <div className="sets-reps-ctn">
                        {block.data.setsReps.map((setRep, idx) => (
                          <div key={idx} className='sets-reps-subctn' style={{ display: 'flex', marginBottom: '8px' }}>
                            <CustomInput
                              placeholder="ej. 3x12"
                              width="110px"
                              value={setRep.series}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'series', e.target.value)
                              }
                            />
                            <div style={{ position: 'relative', flex: 1 }}>
                              <CustomInput
                                placeholder={setRep.placeholderExercise}
                                width="350px"
                                value={setRep.exercise}
                                onChange={e =>
                                  handleExerciseInputChange(block.id, idx, e.target.value)
                                }
                              />
                              {
                                (suggestions[`${block.id}-${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${block.id}-${idx}`].map(ex => (
                                      <li
                                        key={ex.ID_Ejercicio}
                                        onClick={() => handleSelectSuggestion(block.id, idx, ex)}
                                      >
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )
                              }
                            </div>

                            <button
                              onClick={() => handleDeleteSetRep(block.id, idx)}
                              style={{
                                marginLeft: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: '#e55',
                                fontSize: '20px',
                                cursor: 'pointer'
                              }}
                              title="Eliminar este set"
                            >
                              –
                            </button>
                          </div>
                        ))}
                        <PrimaryButton
                          text="+"
                          linkTo="#"
                          onClick={() => handleAddSetRep(block.id)}
                        />
                      </div>
                    </div>
                  )}

                  {block.type === "EMOM" && (
                    <div className="emom-ctn">
                      <div className="cantidad-emom-ctn">
                        <span> Cada </span>
                        <CustomInput
                          placeholder="1"
                          width="45px"
                          value={block.data.interval}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'interval', e.target.value)
                          }
                        />
                        <CustomInput
                          placeholder="minuto"
                          width="100px"
                          disabled
                        />
                        <span> por </span>
                        <CustomInput
                          placeholder="20"
                          width="45px"
                          value={block.data.totalMinutes}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'totalMinutes', e.target.value)
                          }
                        />
                        <CustomInput
                          placeholder="minutos"
                          width="100px"
                          disabled
                        />
                      </div>
                      <div className="sets-reps-ctn">
                        {block.data.setsReps.map((setRep, idx) => (
                          <div key={idx} className='sets-reps-subctn' style={{ display: 'flex', marginBottom: '8px' }}>
                            <CustomInput
                              placeholder="ej. 3x12"
                              width="110px"
                              value={setRep.series}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'series', e.target.value)
                              }
                            />
                            <div style={{ position: 'relative', flex: 1 }}>
                              <CustomInput
                                placeholder={setRep.placeholderExercise}
                                width="350px"
                                value={setRep.exercise}
                                onChange={e =>
                                  handleExerciseInputChange(block.id, idx, e.target.value)
                                }
                              />
                              {
                                (suggestions[`${block.id}-${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${block.id}-${idx}`].map(ex => (
                                      <li
                                        key={ex.ID_Ejercicio}
                                        onClick={() => handleSelectSuggestion(block.id, idx, ex)}
                                      >
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )
                              }
                            </div>

                            <button
                              onClick={() => handleDeleteSetRep(block.id, idx)}
                              style={{
                                marginLeft: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: '#e55',
                                fontSize: '20px',
                                cursor: 'pointer'
                              }}
                              title="Eliminar este set"
                            >
                              –
                            </button>
                          </div>
                        ))}
                        <PrimaryButton
                          text="+"
                          linkTo="#"
                          onClick={() => handleAddSetRep(block.id)}
                        />
                      </div>
                    </div>
                  )}

                  {block.type === "AMRAP" && (
                    <div className="amrap-ctn">
                      <div className="cantidad-amrap-ctn">
                        <span> AMRAP de </span>
                        <CustomInput
                          placeholder="20"
                          width="45px"
                          value={block.data.duration}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'duration', e.target.value)
                          }
                        />
                        <CustomInput
                          placeholder="minutos"
                          width="100px"
                          disabled
                        />
                      </div>
                      <div className="sets-reps-ctn">
                        {block.data.setsReps.map((setRep, idx) => (
                          <div key={idx} className='sets-reps-subctn' style={{ display: 'flex', marginBottom: '8px' }}>
                            <CustomInput
                              placeholder="ej. 3x12"
                              width="110px"
                              value={setRep.series}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'series', e.target.value)
                              }
                            />
                            <div style={{ position: 'relative', flex: 1 }}>
                              <CustomInput
                                placeholder={setRep.placeholderExercise}
                                width="350px"
                                value={setRep.exercise}
                                onChange={e =>
                                  handleExerciseInputChange(block.id, idx, e.target.value)
                                }
                              />
                              {
                                (suggestions[`${block.id}-${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${block.id}-${idx}`].map(ex => (
                                      <li
                                        key={ex.ID_Ejercicio}
                                        onClick={() => handleSelectSuggestion(block.id, idx, ex)}
                                      >
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )
                              }
                            </div>

                            <button
                              onClick={() => handleDeleteSetRep(block.id, idx)}
                              style={{
                                marginLeft: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: '#e55',
                                fontSize: '20px',
                                cursor: 'pointer'
                              }}
                              title="Eliminar este set"
                            >
                              –
                            </button>
                          </div>
                        ))}
                        <PrimaryButton
                          text="+"
                          linkTo="#"
                          onClick={() => handleAddSetRep(block.id)}
                        />
                      </div>
                    </div>
                  )}

                  {block.type === "Escalera" && (
                    <div className="escalera-ctn">
                      <div className="cantidad-escalera-ctn">
                        <CustomInput
                          placeholder="Ej. 21-15-9"
                          width="200px"
                          value={block.data.escaleraType}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'escaleraType', e.target.value)
                          }
                        />
                      </div>
                      <div className="sets-reps-ctn">
                        {block.data.setsReps.map((setRep, idx) => (
                          <div key={idx} className='sets-reps-subctn' style={{ display: 'flex', marginBottom: '8px' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                              <CustomInput
                                placeholder={setRep.placeholderExercise}
                                width="350px"
                                value={setRep.exercise}
                                onChange={e =>
                                  handleExerciseInputChange(block.id, idx, e.target.value)
                                }
                              />
                              {
                                (suggestions[`${block.id}-${idx}`] || []).length > 0 && (
                                  <ul className="suggestions-list">
                                    {suggestions[`${block.id}-${idx}`].map(ex => (
                                      <li
                                        key={ex.ID_Ejercicio}
                                        onClick={() => handleSelectSuggestion(block.id, idx, ex)}
                                      >
                                        {ex.nombre}
                                      </li>
                                    ))}
                                  </ul>
                                )
                              }
                            </div>

                            <button
                              onClick={() => handleDeleteSetRep(block.id, idx)}
                              style={{
                                marginLeft: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: '#e55',
                                fontSize: '20px',
                                cursor: 'pointer'
                              }}
                              title="Eliminar este set"
                            >
                              –
                            </button>
                          </div>
                        ))}
                        <PrimaryButton
                          text="+"
                          linkTo="#"
                          onClick={() => handleAddSetRep(block.id)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearRutina;
