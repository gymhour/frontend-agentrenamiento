import React, { useState } from 'react';
import '../../../App.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu.jsx';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown.jsx';
import CustomInput from '../../../Components/utils/CustomInput/CustomInput.jsx';
import './CrearRutina.css';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton.jsx';
import apiService from '../../../services/apiService';

const CrearRutina = () => {
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

  // Estados para step2
  const [blocks, setBlocks] = useState([]);
  const [showBlockTypeDropdown, setShowBlockTypeDropdown] = useState(false);

  // Objetos iniciales para cada tipo de bloque
  const initialBlockData = {
    'Series y repeticiones': { setsReps: [{ series: '', exercise: '' }] },
    'Rondas': { rounds: '', descanso: '', setsReps: [{ series: '', exercise: '' }] },
    'EMOM': { interval: '', totalMinutes: '', setsReps: [{ series: '', exercise: '' }] },
    'AMRAP': { duration: '', setsReps: [{ series: '', exercise: '' }] },
    'Escalera': { escaleraType: '', setsReps: [{ series: '', exercise: '' }] },
  };

  // --- STEP 1: Continuar ---
  const handleContinue = (e) => {
    e.preventDefault();
    console.log("Datos del step1:", formData);
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
            setsReps: [...block.data.setsReps, { series: '', exercise: '' }]
          }
        };
      }
      return block;
    }));
  };

  // Función que transforma la data de la rutina al formato esperado por el endpoint
  const prepareRutinaData = () => {
    return {
      userId: localStorage.getItem("usuarioId"),
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
                reps: isNaN(parseInt(item.series)) ? item.series : parseInt(item.series),
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
              cantRondas: parseInt(block.data.rounds,10) || null,
              durationMin: null,
              tipoEscalera: null,
              ejercicios: block.data.setsReps.slice(1).map(item => ({
                reps: isNaN(parseInt(item.series)) ? item.series : parseInt(item.series),
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
                // Convertir a número (o null si está vacío o no es número)
                durationMin: block.data.totalMinutes 
                  ? parseInt(block.data.totalMinutes, 10) 
                  : null,
                tipoEscalera: null,
                ejercicios: block.data.setsReps.map(item => ({
                  reps: isNaN(parseInt(item.series)) ? item.series : parseInt(item.series),
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
              durationMin: parseInt(block.data.duration,10) || null,
              tipoEscalera: null,
              ejercicios: block.data.setsReps.map(item => ({
                reps: isNaN(parseInt(item.series)) ? item.series : parseInt(item.series),
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
    }
  };

  // --- Envío final de la rutina ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const rutinaData = prepareRutinaData();
    console.log("Final data to send:", rutinaData);
    try {
      // Se envía la rutina al endpoint (asegurate de tener implementado createRutina en tu apiService)
      const response = await apiService.createRutina(rutinaData);
      console.log("Rutina creada:", response);
      // Opcional: reiniciar el formulario o redirigir al usuario
    } catch (error) {
      console.error("Error al crear rutina:", error);
    }
  };

  return (
    <div className='page-layout'>
      <SidebarMenu isAdmin={false} />
      <div className='content-layout mi-rutina-ctn'>
        <div className="mi-rutina-title">
          <h2>Crear Rutina</h2>
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
              {/* Botón para agregar un bloque */}
              <PrimaryButton
                text="Agregar bloque"
                linkTo="#"
                onClick={handleMostrarDropdown}
              />

              {/* Dropdown para seleccionar tipo de bloque */}
              {showBlockTypeDropdown && (
                <CustomDropdown
                  placeholderOption="Tipo de serie"
                  options={tiposDeSerie}
                  value=""
                  onChange={handleAddBlock}
                />
              )}

              {/* Renderizamos cada bloque agregado */}
              {blocks.map((block) => (
                <div 
                  key={block.id} 
                  className="block-container" 
                  style={{ marginTop: '20px', borderTop: '1px solid #ccc', padding: '10px', position: 'relative' }}
                >
                  {/* Botón de eliminación */}
                  <button 
                    onClick={() => handleDeleteBlock(block.id)}
                    style={{
                      position: 'absolute',
                      top: '5px',
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
                  <h4>{block.type}</h4>

                  {block.type === "Series y repeticiones" && (
                    <div className="sets-reps-ctn">
                      {block.data.setsReps.map((setRep, idx) => (
                        <div key={idx} style={{ display: 'flex', marginBottom: '8px' }}>
                          <CustomInput
                            placeholder="ej. 3x12"
                            width="110px"
                            value={setRep.series}
                            onChange={(e) =>
                              handleSetRepChange(block.id, idx, 'series', e.target.value)
                            }
                          />
                          <CustomInput
                            placeholder="ej. Curl de biceps con mancuerna 10kg"
                            width="350px"
                            value={setRep.exercise}
                            onChange={(e) =>
                              handleSetRepChange(block.id, idx, 'exercise', e.target.value)
                            }
                          />
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
                          width="70px"
                          value={block.data.rounds}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'rounds', e.target.value)
                          }
                        />
                        <span> Rondas con </span>
                        <CustomInput
                          placeholder="90"
                          width="90px"
                          value={block.data.descanso}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'descanso', e.target.value)
                          }
                        />
                        <span> segundos de descanso </span>
                      </div>
                      <div className="sets-reps-ctn">
                        {block.data.setsReps.map((setRep, idx) => (
                          <div key={idx} style={{ display: 'flex', marginBottom: '8px' }}>
                            <CustomInput
                              placeholder="ej. 3x12"
                              width="110px"
                              value={setRep.series}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'series', e.target.value)
                              }
                            />
                            <CustomInput
                              placeholder="ej. Curl de biceps con mancuerna 10kg"
                              width="350px"
                              value={setRep.exercise}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'exercise', e.target.value)
                              }
                            />
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
                          width="60px"
                          value={block.data.interval}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'interval', e.target.value)
                          }
                        />
                        <CustomInput
                          placeholder="minuto"
                          width="180px"
                          disabled
                        />
                        <span> por </span>
                        <CustomInput
                          placeholder="20"
                          width="90px"
                          value={block.data.totalMinutes}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'totalMinutes', e.target.value)
                          }
                        />
                        <CustomInput
                          placeholder="minutos"
                          width="180px"
                          disabled
                        />
                      </div>
                      <div className="sets-reps-ctn">
                        {block.data.setsReps.map((setRep, idx) => (
                          <div key={idx} style={{ display: 'flex', marginBottom: '8px' }}>
                            <CustomInput
                              placeholder="ej. 3x12"
                              width="110px"
                              value={setRep.series}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'series', e.target.value)
                              }
                            />
                            <CustomInput
                              placeholder="ej. Curl de biceps con mancuerna 10kg"
                              width="350px"
                              value={setRep.exercise}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'exercise', e.target.value)
                              }
                            />
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
                          width="90px"
                          value={block.data.duration}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'duration', e.target.value)
                          }
                        />
                        <CustomInput
                          placeholder="minutos"
                          width="180px"
                          disabled
                        />
                      </div>
                      <div className="sets-reps-ctn">
                        {block.data.setsReps.map((setRep, idx) => (
                          <div key={idx} style={{ display: 'flex', marginBottom: '8px' }}>
                            <CustomInput
                              placeholder="ej. 3x12"
                              width="110px"
                              value={setRep.series}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'series', e.target.value)
                              }
                            />
                            <CustomInput
                              placeholder="ej. Curl de biceps con mancuerna 10kg"
                              width="350px"
                              value={setRep.exercise}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'exercise', e.target.value)
                              }
                            />
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
                          placeholder="Tipo de escalera"
                          width="200px"
                          value={block.data.escaleraType}
                          onChange={(e) =>
                            handleBlockFieldChange(block.id, 'escaleraType', e.target.value)
                          }
                        />
                      </div>
                      <div className="sets-reps-ctn">
                        {block.data.setsReps.map((setRep, idx) => (
                          <div key={idx} style={{ display: 'flex', marginBottom: '8px' }}>
                            <CustomInput
                              placeholder="ej. Curl de biceps con mancuerna 10kg"
                              width="350px"
                              value={setRep.exercise}
                              onChange={(e) =>
                                handleSetRepChange(block.id, idx, 'exercise', e.target.value)
                              }
                            />
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

              {/* Botón final para enviar la rutina */}
              <PrimaryButton
                text="Crear rutina"
                linkTo="#"
                onClick={handleSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearRutina;