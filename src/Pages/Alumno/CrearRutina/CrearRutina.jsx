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
import { useNavigate } from 'react-router-dom';
// Importamos react-select para el dropdown de usuarios
import Select from 'react-select';

const CrearRutina = ({ fromAdmin, fromEntrenador }) => {
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo"
  ];
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
    diaSemana: '',
    hora: ''
  });

  // Para fetch y selección de usuarios (sólo aplica a entrenador)
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Estados para step2
  const [blocks, setBlocks] = useState([]);
  const [showBlockTypeDropdown, setShowBlockTypeDropdown] = useState(false);

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
  
  const getRandomExercise = () => exampleExercises[Math.floor(Math.random() * exampleExercises.length)];  

  // Objetos iniciales para cada tipo de bloque
  const initialBlockData = {
    'Series y repeticiones': { setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise() }] },
    'Rondas': { rounds: '', descanso: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise() }] },
    'EMOM': { interval: '', totalMinutes: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise() }] },
    'AMRAP': { duration: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise() }] },
    'Escalera': { escaleraType: '', setsReps: [{ series: '', exercise: '', placeholderExercise: getRandomExercise() }] },
  };

  // Si el componente se usa en modo entrenador, traemos los usuarios para seleccionarlos
  useEffect(() => {
    if (fromEntrenador) {
      apiService.getAllUsuarios()
        .then(res => {
          setUsers(res.data);
        })
        .catch(() => {
          toast.error("No se pudieron cargar los usuarios");
        });
    }
  }, [fromEntrenador]);

  // --- STEP 1: Continuar ---
  const handleContinue = (e) => {
    e.preventDefault();

    // Si es entrenador, nos aseguramos de que haya seleccionado un usuario
    if (fromEntrenador && !selectedEmail) {
      toast.error("Por favor, selecciona un usuario antes de continuar");
      return;
    }

    console.log("Datos del step1:", formData, "Usuario seleccionado:", selectedEmail);
    setStep(2);
  };

  // --- STEP 2: Agregar Bloque ---
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

    return {
      userId,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      dayOfWeek: formData.diaSemana,
      bloques: blocks.map(block => {
        switch (block.type) {
          case 'Series y repeticiones':
            return {
              type: "SETS_REPS",
              setsReps: block.data.setsReps[0]?.series || null,
              nombreEj: block.data.setsReps[0]?.exercise || null,
              weight: null,
              descansoRonda: null,
              cantRondas: null,
              durationMin: null,
              tipoEscalera: null,
              ejercicios: block.data.setsReps.slice(1).map(item => ({
                reps: item.series,
                setRepWeight: item.exercise
              }))
            };
          case 'Rondas':
            return {
              type: "ROUNDS",
              setsReps: block.data.setsReps[0]?.series || null,
              nombreEj: block.data.setsReps[0]?.exercise || null,
              weight: null,
              descansoRonda: parseInt(block.data.descanso, 10) || null,
              cantRondas: parseInt(block.data.rounds, 10) || null,
              durationMin: null,
              tipoEscalera: null,
              ejercicios: block.data.setsReps.slice(1).map(item => ({
                reps: item.series,
                setRepWeight: item.exercise
              }))
            };
          case 'EMOM':
            return {
              type: "EMOM",
              setsReps: null,
              nombreEj: null,
              weight: null,
              descansoRonda: null,
              cantRondas: null,
              durationMin: block.data.totalMinutes
                ? parseInt(block.data.totalMinutes, 10)
                : null,
              tipoEscalera: null,
              ejercicios: block.data.setsReps.map(item => ({
                reps: item.series,
                setRepWeight: item.exercise
              }))
            };
          case 'AMRAP':
            return {
              type: "AMRAP",
              setsReps: null,
              nombreEj: null,
              weight: null,
              descansoRonda: null,
              cantRondas: null,
              durationMin: parseInt(block.data.duration, 10) || null,
              tipoEscalera: null,
              ejercicios: block.data.setsReps.map(item => ({
                reps: item.series,
                setRepWeight: item.exercise
              }))
            };
          case 'Escalera':
            return {
              type: "LADDER",
              setsReps: null,
              nombreEj: null,
              weight: null,
              descansoRonda: null,
              cantRondas: null,
              durationMin: null,
              tipoEscalera: block.data.escaleraType || null,
              ejercicios: block.data.setsReps.map(item => ({
                reps: null,
                setRepWeight: item.exercise
              }))
            };
          default:
            return {};
        }
      })
    };
  };

  // --- Envío final de la rutina ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const rutinaData = prepareRutinaData();
    console.log("Final data to send:", rutinaData);

    try {
      const response = await apiService.createRutina(rutinaData);
      setLoading(false);
      toast.success("Rutina creada correctamente.");
      if (fromAdmin) {
        navigate("/admin/rutinas");
      } else if (fromEntrenador) {
        setStep(1);
        setFormData({
          nombre: '',
          descripcion: '',
          diaSemana: '',
          hora: ''
        });
        setSelectedEmail(null);
        setBlocks([]);
      } else {
        navigate("/alumno/mi-rutina");
      }
    } catch (error) {
      console.error("Error al crear rutina:", error);
      setLoading(false);
      toast.error("No se pudo crear la rutina");
    }
  };

  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={fromAdmin} isEntrenador={fromEntrenador} />
      <div className='content-layout mi-rutina-ctn'>
        <div className="mi-rutina-title">
          <h2>Crear Rutina</h2>
          {step === 2 && (
            <PrimaryButton
              text="Crear rutina"
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
              <CustomDropdown
                placeholderOption="Dia de la semana"
                options={diasSemana}
                value={formData.diaSemana}
                onChange={(e) =>
                  setFormData({ ...formData, diaSemana: e.target.value })
                }
              />
              <CustomInput
                placeholder="Hora (por ej. 10:00)"
                value={formData.hora}
                onChange={(e) =>
                  setFormData({ ...formData, hora: e.target.value })
                }
              />

              {/* Si es entrenador, mostramos dropdown para buscar usuarios */}
              {fromEntrenador && (
                <Select
                  options={users.map(u => ({
                    label: `${u.nombre} ${u.apellido} (${u.email})`,
                    value: u.email
                  }))}
                  value={
                    selectedEmail
                      ? {
                          label: `${users.find(u => u.email === selectedEmail)?.nombre || ''} ${
                            users.find(u => u.email === selectedEmail)?.apellido || ''
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
                          <CustomInput
                            placeholder={setRep.placeholderExercise}
                            width="350px"
                            value={setRep.exercise}
                            onChange={e =>
                              handleSetRepChange(block.id, idx, 'exercise', e.target.value)
                            }
                          />
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
                            <CustomInput
                              placeholder={setRep.placeholderExercise}
                              width="350px"
                              value={setRep.exercise}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'exercise', e.target.value)
                              }
                            />
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
                            <CustomInput
                              placeholder={setRep.placeholderExercise}
                              width="350px"
                              value={setRep.exercise}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'exercise', e.target.value)
                              }
                            />
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
                            <CustomInput
                              placeholder={setRep.placeholderExercise}
                              width="350px"
                              value={setRep.exercise}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'exercise', e.target.value)
                              }
                            />
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
                            <CustomInput
                              placeholder={setRep.placeholderExercise}
                              width="450px"
                              value={setRep.exercise}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'exercise', e.target.value)
                              }
                            />
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
