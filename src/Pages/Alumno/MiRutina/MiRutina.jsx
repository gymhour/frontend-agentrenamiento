import React, { useEffect, useState } from 'react';
import '../../../App.css';
import './MiRutina.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu.jsx';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton.jsx';
import apiService from '../../../services/apiService';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen.jsx';
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/icons/trash.svg';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp.jsx';
import { toast } from 'react-toastify';

const MiRutina = () => {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRutinaId, setSelectedRutinaId] = useState(null);

  // useEffect para cargar rutinas al montar el componente
  useEffect(() => {
    let userId = localStorage.getItem("usuarioId")
    const fetchRutinas = async () => {
      try {
        const data = await apiService.getUserRutinas(userId);
        // En la respuesta que compartiste, el array viene en data.rutinas
        setRutinas(data.rutinas);
      } catch (error) {
        console.error("Error al obtener rutinas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRutinas();
  }, []);

  const deleteRutina = async (idRutina) => {
    setLoading(true)
    try {
      await apiService.deleteRutina(idRutina);
      setRutinas((prevRutinas) =>
        prevRutinas.filter((rutina) => rutina.ID_Rutina !== idRutina)
      );
      toast.success("Rutina eliminada correctamente");
      setLoading(false)
    } catch (error) {
      toast.error("La rutina no se pudo eliminar. Por favor, intente nuevamente.")
      setLoading(false);
    }
  };

  const handlePopUpOpen = (id) => {
    setSelectedRutinaId(id);
    setIsPopupOpen(true);
  };

  const handlePopupConfirm = () => {
    setIsPopupOpen(false);
    if (selectedRutinaId) {
      deleteRutina(selectedRutinaId);
      setSelectedRutinaId(null);
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setSelectedRutinaId(null);
  };

  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={false} />
      <div className='content-layout mi-rutina-ctn'>
        <div className="mi-rutina-title">
          <div>
            <h2>Mis rutinas</h2>
            {/* <p>Creá tu rutina semanal y consultá la de tu clase o la asignada por tu entrenador personal.</p> */}
          </div>
          <PrimaryButton text="Crear rutina" linkTo="/alumno/crear-rutina" />
        </div>

        <div className="mis-rutinas-list">
          {rutinas.length === 0 ? (
            <p>No hay rutinas cargadas</p>
          ) : (
            rutinas.map((rutina) => (
              <div key={rutina.ID_Rutina} className="rutina-card">
                <div className='rutina-header'>
                  <h3>{rutina.nombre}</h3>
                  <div className="rutina-header-acciones">
                    <button onClick={() => handlePopUpOpen(rutina.ID_Rutina)} className='mi-rutina-eliminar-btn'>
                      <DeleteIcon width={20} height={20} />
                    </button>
                    {/* <button className='mi-rutina-eliminar-btn'>
                      <EditIcon width={20} height={20}/>
                    </button> */}
                  </div>
                </div>

                <div className="rutina-data">
                  {/* Aca deberia ir categoria y duración también */}
                  <p> Día de la semana:   {rutina.DiasRutina.map(d => d.dia).join(", ")}                  </p>
                </div>

                {rutina.Entrenador && (
                  <p>
                    Asignada por:&nbsp;
                    {rutina.Entrenador.nombre} {rutina.Entrenador.apellido}
                  </p>
                )}

                {rutina.Bloques && rutina.Bloques.length > 0 && (
                  <div className="bloques-list">
                    {rutina.Bloques.map((bloque) => (
                      <div key={bloque.ID_Bloque} className="bloque-card">
                        {/* SETS & REPS */}
                        {bloque.type === 'SETS_REPS' && (
                          <div>
                            <p>
                              {`${bloque.setsReps} ${bloque.nombreEj} ${bloque.weight || ''}`.trim()}
                            </p>
                            {/* <ul style={{ paddingLeft: '20px' }}> */}
                            {bloque.ejercicios.map((ej) => (
                              <p key={ej.ID_Ejercicio}>
                                {`${ej.reps} ${ej.setRepWeight}`}
                              </p>
                            ))}
                            {/* </ul> */}
                          </div>
                        )}

                        {/* ROUNDS */}
                        {bloque.type === 'ROUNDS' && (
                          <>
                            <p>{`${bloque.cantRondas} rondas de:`}</p>

                            <ul style={{ paddingLeft: '20px' }}>
                              <li>
                                {`${bloque.setsReps} ${bloque.nombreEj} ${bloque.weight || ''}`.trim()}
                              </li>

                              {bloque.ejercicios.map((ej) => (
                                <li key={ej.ID_Ejercicio}>
                                  {`${ej.reps} ${ej.setRepWeight}`}
                                </li>
                              ))}
                            </ul>

                            {bloque.descansoRonda != null && (
                              <p style={{ color: "rgba(255,255,255,0.6)" }}>{`con ${bloque.descansoRonda} segs de descanso`}</p>
                            )}
                          </>
                        )}

                        {/* AMRAP */}
                        {bloque.type === 'AMRAP' && (
                          <>
                            <p>{`AMRAP ${bloque.durationMin}min:`}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map((ej) => (
                                <li key={ej.ID_Ejercicio}>
                                  {`${ej.reps} ${ej.setRepWeight}`}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}

                        {/* EMOM */}
                        {bloque.type === 'EMOM' && (
                          <>
                            <p>{`EMOM ${bloque.durationMin}min:`}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map((ej, idx) => (
                                <li key={ej.ID_Ejercicio}>
                                  {`0-${idx}: ${ej.reps} ${ej.setRepWeight}`}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}

                        {/* LADDER */}
                        {bloque.type === 'LADDER' && (
                          <>
                            <p>{bloque.tipoEscalera}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map((ej) => (
                                <li key={ej.ID_Ejercicio}>{ej.setRepWeight}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <ConfirmationPopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        onConfirm={handlePopupConfirm}
        message="¿Estás seguro de que deseas eliminar esta rutina?"
      />
    </div>
  );
};

export default MiRutina;