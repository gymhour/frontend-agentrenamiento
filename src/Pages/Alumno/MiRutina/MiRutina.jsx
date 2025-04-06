import React, { useEffect, useState } from 'react';
import '../../../App.css';
import './MiRutina.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu.jsx';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton.jsx';
import apiService from '../../../services/apiService';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen.jsx';
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/icons/trash.svg';


const MiRutina = () => {
  // Estado para guardar las rutinas que traemos de la API
  const [rutinas, setRutinas] = useState([]);
  // Estado para manejar el loading
  const [loading, setLoading] = useState(true);

  // useEffect para cargar rutinas al montar el componente
  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const data = await apiService.getRutinas();
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
      { loading && <LoaderFullScreen/> }
      <SidebarMenu isAdmin={false} />
      <div className='content-layout mi-rutina-ctn'>
        <div className="mi-rutina-title">
          <h2>Mi Rutina</h2>
          <p>Creá tu rutina semanal y consultá la de tu clase o la asignada por tu entrenador personal.</p>
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
                    <button onClick={() => deleteRutina(rutina.ID_Rutina)} className='mi-rutina-eliminar-btn'>
                      <DeleteIcon width={20} height={20}/>
                    </button>
                    <button className='mi-rutina-eliminar-btn'>
                      <EditIcon width={20} height={20}/>
                    </button>
                  </div>
                </div>

                <div className="rutina-data">
                  {/* Aca deberia ir categoria y duración también */}
                  <p> Día de la semana: {rutina.dayOfWeek}</p>
                </div>

                {/* Mostrar bloques de cada rutina */}
                {rutina.Bloques && rutina.Bloques.length > 0 && (
                  <div className="bloques-list">
                    {rutina.Bloques.map((bloque) => (
                      <div key={bloque.ID_Bloque} className="bloque-card">
                        {/* Tipo de serie */}
                        <p className='bloques-list-bloque'> {bloque.type}</p>
                        {bloque.setsReps && <p>Sets/Reps: {bloque.setsReps}</p>}
                        {bloque.nombreEj && <p>Ejercicio: {bloque.nombreEj}</p>}
                        {bloque.descansoRonda && (
                          <p>Descanso: {bloque.descansoRonda} seg</p>
                        )}
                        {bloque.cantRondas && <p>Rondas: {bloque.cantRondas}</p>}
                        {bloque.durationMin && <p>Minutos: {bloque.durationMin}</p>}
                        {bloque.tipoEscalera && <p>Escalera: {bloque.tipoEscalera}</p>}

                        {/* Ejercicios de cada bloque */}
                        {bloque.ejercicios && bloque.ejercicios.length > 0 && (
                          <ul style={{ paddingLeft: '20px' }}>
                            {bloque.ejercicios.map((ej) => (
                              <li key={ej.ID_Ejercicio}>
                                {ej.reps
                                  ? `${ej.reps} reps - ${ej.setRepWeight}`
                                  : ej.setRepWeight}
                              </li>
                            ))}
                          </ul>
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

export default MiRutina;