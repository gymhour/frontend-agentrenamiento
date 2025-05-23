import React, { useEffect, useState } from 'react';
import '../../../App.css';
import '../MiRutina/MiRutina.css'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu.jsx';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton.jsx';
import apiService from '../../../services/apiService';
import LoaderSection from '../../../Components/utils/LoaderSection/LoaderSection.jsx';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen.jsx';

const RutinasRecomendadas = () => {
  // Estado para guardar las rutinas que traemos de la API
  const [rutinas, setRutinas] = useState([]);
  // Estado para manejar el loading
  const [loading, setLoading] = useState(true);

  // useEffect para cargar rutinas al montar el componente
  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const { rutinas } = await apiService.getRutinas();
      
        // Filtrar solo las rutinas de admin o entrenador
        const rutinasFiltradas = rutinas.filter(rutina =>
          rutina.User &&
          (rutina.User.tipo === 'admin' || rutina.User.tipo === 'entrenador')
        );
  
        setRutinas(rutinasFiltradas);
      } catch (error) {
        console.error("Error al obtener rutinas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRutinas();
  }, []);

  // Función para eliminar una rutina
  const deleteRutina = async (idRutina) => {
    try {
      await apiService.deleteRutina(idRutina);
      console.log("Rutina " + idRutina + " eliminada correctamente");
      setRutinas((prevRutinas) =>
        prevRutinas.filter((rutina) => rutina.ID_Rutina !== idRutina)
      );
    } catch (error) {
      console.error("Error al eliminar rutina", error);
    }
  };

  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen/> }
      <SidebarMenu isAdmin={false}/>
      <div className='content-layout mi-rutina-ctn'>
        <div className="mi-rutina-title">
          <h2>Rutinas Recomendadas</h2>
          {/* <p>Explorá rutinas que pueden ayudarte a alcanzar tus objetivos.</p> */}
        </div>

        {/* Si está cargando, muestra el LoaderSection */}
          <div className="mis-rutinas-list">
            {rutinas.length === 0 ? (
              <p>No hay rutinas cargadas</p>
            ) : (
              rutinas.map((rutina) => (
                <div key={rutina.ID_Rutina} className="rutina-card">
                  <div className='rutina-header'>
                    <h3>{rutina.nombre}</h3>
                    {/* <button 
                      onClick={() => deleteRutina(rutina.ID_Rutina)} 
                      className='mi-rutina-eliminar-btn'
                    >
                      Eliminar
                    </button> */}
                  </div>
                  {/* <p>{rutina.desc}</p> */}
                  <div className="rutina-data">
                  {/* Aca deberia ir categoria y duración también */}
                  <p> Día de la semana: {rutina.dayOfWeek}</p>
                </div>
                {rutina.Bloques && rutina.Bloques.length > 0 && (
                  <div className="bloques-list">
                    {rutina.Bloques.map((bloque) => (
                      <div key={bloque.ID_Bloque} className="bloque-card">
                        {/* SETS & REPS */}
                        {bloque.type === 'SETS_REPS' && (
                          <p>
                            {`${bloque.setsReps} ${bloque.nombreEj} ${bloque.weight || ''}`.trim()}
                          </p>
                        )}

                        {/* ROUNDS */}
                        {bloque.type === 'ROUNDS' && (
                          <>
                            <p>{`${bloque.cantRondas} rondas de:`}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map((ej) => (
                                <li key={ej.ID_Ejercicio}>
                                  {`${ej.reps} ${ej.setRepWeight}`}
                                </li>
                              ))}
                            </ul>
                            {bloque.descansoRonda != null && (
                              <p>{`con ${bloque.descansoRonda} segs de descanso`}</p>
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
    </div>
  );
};

export default RutinasRecomendadas;
