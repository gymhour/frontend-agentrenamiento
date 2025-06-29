import React, { useEffect, useState } from 'react';
import '../../../App.css';
import '../MiRutina/MiRutina.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu.jsx';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton.jsx';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton.jsx';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown.jsx';
import apiService from '../../../services/apiService';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen.jsx';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const RutinasRecomendadas = () => {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);

  // estados de dropdown (selección actual)
  const [selClase, setSelClase]   = useState('');
  const [selGrupo, setSelGrupo]   = useState('');
  const [selDia, setSelDia]       = useState('');
  // filtros aplicados (solo cambian al presionar Filtrar)
  const [fClase, setFClase]       = useState('');
  const [fGrupo, setFGrupo]       = useState('');
  const [fDia, setFDia]           = useState('');
  // toggle de sección de filtros
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchRutinas = async () => {
      try {
        const { rutinas: allRutinas } = await apiService.getRutinas();
        // solo rutinas creadas por un entrenador
        const filtradas = allRutinas.filter(r => r.entrenador);
        setRutinas(filtradas);
      } catch (error) {
        console.error('Error al obtener rutinas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRutinas();
  }, []);

  // opciones únicas para los dropdowns — sin valores null o vacíos
  const clases = Array.from(new Set(
    rutinas
      .map(r => r.claseRutina)
      .filter(c => c)
  ));

  const grupos = Array.from(new Set(
    rutinas
      .map(r => r.grupoMuscularRutina)
      .filter(g => g)
  ));

  const dias = Array.from(new Set(
    rutinas
      .flatMap(r => r.dias)
      .filter(d => d)
  ));

  // rutinas filtradas según filtros aplicados
  const filteredRutinas = rutinas.filter(r => (
    (fClase === '' || r.claseRutina === fClase) &&
    (fGrupo === '' || r.grupoMuscularRutina === fGrupo) &&
    (fDia   === '' || r.dias.includes(fDia))
  ));

  // manejadores de Filtrar y Limpiar
  const aplicarFiltro = () => {
    setFClase(selClase);
    setFGrupo(selGrupo);
    setFDia(selDia);
  };
  const limpiarFiltro = () => {
    setSelClase(''); setSelGrupo(''); setSelDia('');
    setFClase('');  setFGrupo('');  setFDia('');
  };

  if (loading) return <LoaderFullScreen />;

  return (
    <div className='page-layout'>
      <SidebarMenu isAdmin={false} />
      <div className='content-layout mi-rutina-ctn'>

        <div className="mi-rutina-title">
          <h2>Rutinas Recomendadas</h2>
        </div>

        <div style={{ margin: '20px 0' }}>
          <button
            className='toggle-filters-button'
            onClick={() => setShowFilters(prev => !prev)}
          >
            Filtros {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {showFilters && (
          <div className="filtros-section" style={{
              margin: '10px 0', display: 'flex', gap: '15px',
              flexWrap: 'wrap', alignItems: 'flex-end'
            }}>
            <CustomDropdown
              options={clases}
              value={selClase}
              onChange={e => setSelClase(e.target.value)}
              placeholderOption='Todas las clases'
            />
            <CustomDropdown
              options={grupos}
              value={selGrupo}
              onChange={e => setSelGrupo(e.target.value)}
              placeholderOption='Todos los grupos musculares'
            />
            <CustomDropdown
              options={dias}
              value={selDia}
              onChange={e => setSelDia(e.target.value)}
              placeholderOption='Todos los días'
            />
            <PrimaryButton onClick={aplicarFiltro} text="Filtrar" />
            <SecondaryButton onClick={limpiarFiltro} text="Limpiar filtros" />
          </div>
        )}

        <div className="mis-rutinas-list">
          {filteredRutinas.length === 0 ? (
            <p>No hay rutinas para estos filtros.</p>
          ) : (
            filteredRutinas.map(rutina => (
              <div key={rutina.ID_Rutina} className="rutina-card">
                <div className='rutina-header'>
                  <h3>{rutina.nombre}</h3>
                </div>

                <div className="rutina-data">
                  <p>Clase: {rutina.claseRutina}</p>
                  <p>Grupo muscular: {rutina.grupoMuscularRutina}</p>
                  <p>Día(s): {rutina.dias.join(', ')}</p>
                </div>

                {rutina.bloques && rutina.bloques.length > 0 && (
                  <div className="bloques-list">
                    {rutina.bloques.map(bloque => (
                      <div key={bloque.ID_Bloque} className="bloque-card">
                        {bloque.type === 'SETS_REPS' && (
                          <>
                            <p>
                              {`${bloque.setsReps} ${bloque.nombreEj || ''} ${bloque.weight || ''}`.trim()}
                            </p>
                            {bloque.ejercicios.map(ej => (
                              <p key={ej.ID_Ejercicio}>
                                {`${ej.ejercicio.nombre || ''}: ${ej.reps} ${ej.setRepWeight}`}
                              </p>
                            ))}
                          </>
                        )}
                        {bloque.type === 'ROUNDS' && (
                          <>
                            <p>{`${bloque.cantRondas} rondas de:`}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              <li>
                                {`${bloque.setsReps} ${bloque.nombreEj || ''} ${bloque.weight || ''}`.trim()}
                              </li>
                              {bloque.ejercicios.map(ej => (
                                <li key={ej.ID_Ejercicio}>
                                  {`${ej.ejercicio.nombre || ''}: ${ej.reps} ${ej.setRepWeight}`}
                                </li>
                              ))}
                            </ul>
                            {bloque.descansoRonda != null && (
                              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                                {`con ${bloque.descansoRonda} segs de descanso`}
                              </p>
                            )}
                          </>
                        )}
                        {bloque.type === 'AMRAP' && (
                          <>
                            <p>{`AMRAP ${bloque.durationMin}min:`}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map(ej => (
                                <li key={ej.ID_Ejercicio}>
                                  {`${ej.ejercicio.nombre || ''}: ${ej.reps} ${ej.setRepWeight}`}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        {bloque.type === 'EMOM' && (
                          <>
                            <p>{`EMOM ${bloque.durationMin}min:`}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map((ej, idx) => (
                                <li key={ej.ID_Ejercicio}>
                                  {`0-${idx}: ${ej.ejercicio.nombre || ''} ${ej.reps} ${ej.setRepWeight}`}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        {bloque.type === 'LADDER' && (
                          <>
                            <p>{bloque.tipoEscalera}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map(ej => (
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