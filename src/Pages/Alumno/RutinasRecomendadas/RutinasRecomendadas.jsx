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
import { Link } from 'react-router-dom';

const RutinasRecomendadas = () => {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);

  // estados de dropdown (selección actual)
  const [selClase, setSelClase] = useState('');
  const [selGrupo, setSelGrupo] = useState('');
  const [selDia, setSelDia] = useState('');
  // filtros aplicados (solo cambian al presionar Filtrar)
  const [fClase, setFClase] = useState('');
  const [fGrupo, setFGrupo] = useState('');
  const [fDia, setFDia] = useState('');
  // toggle de sección de filtros
  const [showFilters, setShowFilters] = useState(false);

  // Helper: deduplicar rutinas por ID
  const dedupeRutinas = (arr = []) => {
    const map = new Map();
    for (const r of arr) {
      const key = r?.ID_Rutina ?? r?.id ?? `${r?.nombre ?? ''}-${r?.createdAt ?? ''}`;
      if (!map.has(key)) map.set(key, r);
    }
    return Array.from(map.values());
  };

  useEffect(() => {
    let cancelled = false;

    const fetchRutinas = async () => {
      setLoading(true);
      try {
        const admins = await apiService.getUsuariosAdmins();

        const adminIds = (admins || [])
          .filter(a => String(a?.tipo || '').toLowerCase() === 'admin' && a?.estado !== false)
          .map(a => a.ID_Usuario)
          .filter(Boolean);

        if (adminIds.length === 0) {
          if (!cancelled) setRutinas([]);
          return;
        }

        // Traer rutinas de cada admin en paralelo
        const results = await Promise.allSettled(
          adminIds.map(id => apiService.getUserRutinas(id)) // debe devolver { rutinas: [...] }
        );

        // Juntar exitosas, deduplicar
        const todas = results.flatMap(r =>
          r.status === 'fulfilled' ? (r.value?.rutinas || []) : []
        );

        const unicas = dedupeRutinas(todas);

        if (!cancelled) setRutinas(unicas);
      } catch (error) {
        console.error('Error al obtener rutinas:', error);
        if (!cancelled) setRutinas([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRutinas();
    return () => { cancelled = true; };
  }, []);

  const clases = Array.from(new Set(rutinas.map(r => r.claseRutina).filter(Boolean)));
  const grupos = Array.from(new Set(rutinas.map(r => r.grupoMuscularRutina).filter(Boolean)));
  const dias = Array.from(new Set(rutinas.flatMap(r => r.dias).filter(Boolean)));

  const filteredRutinas = rutinas.filter(r => (
    (fClase === '' || r.claseRutina === fClase) &&
    (fGrupo === '' || r.grupoMuscularRutina === fGrupo) &&
    (fDia === '' || r.dias.includes(fDia))
  ));

  const aplicarFiltro = () => { setFClase(selClase); setFGrupo(selGrupo); setFDia(selDia); };
  const limpiarFiltro = () => { setSelClase(''); setSelGrupo(''); setSelDia(''); setFClase(''); setFGrupo(''); setFDia(''); };

  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen />}
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
          <div className="filtros-section">
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
            <div className='filtros-section-btns'>
              <PrimaryButton onClick={aplicarFiltro} text="Filtrar" />
              <SecondaryButton onClick={limpiarFiltro} text="Limpiar filtros" />
            </div>
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
                  {/* <p>Día de la semana: {rutina.dias.join(', ')}</p> */}
                  <p><strong>Clase:</strong> {rutina.claseRutina || '—'}</p>
                  <p><strong>Grupo muscular:</strong> {rutina.grupoMuscularRutina || '—'}</p>
                  <p>
                    <strong>Días:</strong>{' '}
                    {rutina.dias && rutina.dias.length > 0 ? rutina.dias.join(', ') : '—'}
                  </p>
                </div>

                {rutina.entrenador && (
                  <p>
                    Asignada por: {rutina.entrenador.nombre} {rutina.entrenador.apellido}
                  </p>
                )}

                {rutina.bloques && rutina.bloques.length > 0 && (
                  <div className="bloques-list">
                    {rutina.bloques.map(bloque => (
                      <div key={bloque.ID_Bloque} className="bloque-card">

                        {bloque.type === 'SETS_REPS' && (
                          <div>
                            {bloque.ejercicios.map(ej => {
                              const name = ej.ejercicio.nombre;
                              const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl);
                              return (
                                <p key={ej.ID_Ejercicio}>
                                  {bloque.setsReps}{' '}
                                  {hasDetail ? (
                                    <Link to={`/alumno/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
                                      {name}
                                    </Link>
                                  ) : (
                                    name
                                  )}
                                </p>
                              );
                            })}
                          </div>
                        )}

                        {bloque.type === 'ROUNDS' && (
                          <div>
                            {(() => {
                              const count = bloque.cantRondas ?? bloque.ejercicios[0]?.reps;
                              return count ? <p>{`${count} rondas de:`}</p> : null;
                            })()}
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map(ej => {
                                const name = ej.ejercicio.nombre;
                                const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl);
                                return (
                                  <li key={ej.ID_Ejercicio}>
                                    {ej.reps}{' '}
                                    {hasDetail ? (
                                      <Link to={`/alumno/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
                                        {name}
                                      </Link>
                                    ) : (
                                      name
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {bloque.type === 'EMOM' && (
                          <div>
                            <p>{`EMOM ${bloque.durationMin}min:`}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map((ej, idx) => {
                                const name = ej.ejercicio.nombre;
                                const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl);

                                const start = idx + 0;
                                const end = idx + 1;

                                return (
                                  <li key={ej.ID_Ejercicio}>
                                    {`${start}-${end}: ${ej.reps} `}
                                    {hasDetail ? (
                                      <Link
                                        to={`/alumno/ejercicios/${ej.ejercicio.ID_Ejercicio}`}
                                        className="exercise-link"
                                      >
                                        {name}
                                      </Link>
                                    ) : (
                                      name
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {bloque.type === 'AMRAP' && (
                          <div>
                            <p>{`AMRAP ${bloque.durationMin}min:`}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map(ej => {
                                const name = ej.ejercicio.nombre;
                                const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl);
                                return (
                                  <li key={ej.ID_Ejercicio}>
                                    {ej.reps}{' '}
                                    {hasDetail ? (
                                      <Link to={`/alumno/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
                                        {name}
                                      </Link>
                                    ) : (
                                      name
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {bloque.type === 'LADDER' && (
                          <>
                            <p>{bloque.tipoEscalera}</p>
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map(ej => {
                                const label = ej.setRepWeight ?? ej.ejercicio.nombre;
                                const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl);
                                return (
                                  <li key={ej.ID_Ejercicio}>
                                    {hasDetail ? (
                                      <Link to={`/alumno/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
                                        {label}
                                      </Link>
                                    ) : (
                                      label
                                    )}
                                  </li>
                                );
                              })}
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