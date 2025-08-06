import React, { useEffect, useState } from 'react';
import '../../../App.css';
import './MiRutina.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu.jsx';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton.jsx';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown.jsx';
import apiService from '../../../services/apiService';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen.jsx';
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/icons/trash.svg';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp.jsx';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton.jsx';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const MiRutina = () => {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRutinaId, setSelectedRutinaId] = useState(null);
  const navigate = useNavigate();
  const [selClase, setSelClase] = useState('');
  const [selGrupo, setSelGrupo] = useState('');
  const [selDia, setSelDia] = useState('');
  const [fClase, setFClase] = useState('');
  const [fGrupo, setFGrupo] = useState('');
  const [fDia, setFDia] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('usuarioId');
    apiService.getUserRutinas(userId)
      .then(data => setRutinas(data.rutinas))
      .catch(error => console.error('Error al obtener rutinas:', error))
      .finally(() => setLoading(false));
  }, []);

  // opciones únicas para los dropdowns
  const clases = Array.from(new Set(rutinas.map(r => r.claseRutina)));
  const grupos = Array.from(new Set(rutinas.map(r => r.grupoMuscularRutina)));
  const dias = Array.from(new Set(rutinas.flatMap(r => r.dias)));

  // rutinas filtradas según filtros aplicados
  const filteredRutinas = rutinas.filter(r => (
    (fClase === '' || r.claseRutina === fClase) &&
    (fGrupo === '' || r.grupoMuscularRutina === fGrupo) &&
    (fDia === '' || r.dias.includes(fDia))
  ));

  // manejadores de Buscar y Limpiar
  const aplicarFiltro = () => {
    setFClase(selClase);
    setFGrupo(selGrupo);
    setFDia(selDia);
  };
  const limpiarFiltro = () => {
    setSelClase(''); setSelGrupo(''); setSelDia('');
    setFClase(''); setFGrupo(''); setFDia('');
  };

  // eliminar rutina
  const deleteRutina = async (idRutina) => {
    setLoading(true);
    try {
      await apiService.deleteRutina(idRutina);
      setRutinas(prev => prev.filter(r => r.ID_Rutina !== idRutina));
      toast.success('Rutina eliminada correctamente');
    } catch {
      toast.error('La rutina no se pudo eliminar. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handlePopUpOpen = id => {
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

        <div className='mi-rutina-title'>
          <h2>Mis rutinas</h2>
          <PrimaryButton text='Crear rutina' linkTo='/alumno/crear-rutina' />
        </div>

        <div style={{ margin: '30px 0px' }}>
          <button
            className='toggle-filters-button'
            onClick={() => setShowFilters(prev => !prev)}
          >
            Filtros {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {/* —— FILTROS —— */}
        {showFilters &&
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
        }

        {/* —— LISTADO DE RUTINAS —— */}
        <div className='mis-rutinas-list'>
          {filteredRutinas.length === 0 ? (
            <p>No hay rutinas para estos filtros.</p>
          ) : (
            filteredRutinas.map(rutina => (
              <div key={rutina.ID_Rutina} className='rutina-card'>
                <div className='rutina-header'>
                  <h3>{rutina.nombre}</h3>
                  <div className='rutina-header-acciones'>
                    <button
                      onClick={() => handlePopUpOpen(rutina.ID_Rutina)}
                      className='mi-rutina-eliminar-btn'
                    >
                      <DeleteIcon width={20} height={20} />
                    </button>
                    <button
                      onClick={() => navigate(`/alumno/editar-rutina/${rutina.ID_Rutina}`)}
                      className='mi-rutina-eliminar-btn'
                      title='Editar rutina'
                    >
                      <EditIcon width={20} height={20} />
                    </button>
                  </div>
                </div>

                <div className='rutina-data'>
                  <p>Día de la semana: {rutina.dias.join(', ')}</p>
                </div>

                {rutina.entrenador && (
                  <p>
                    Asignada por: {rutina.entrenador.nombre} {rutina.entrenador.apellido}
                  </p>
                )}

                {rutina.bloques && rutina.bloques.length > 0 && (
                  <div className='bloques-list'>
                    {rutina.bloques.map(bloque => (
                      <div key={bloque.ID_Bloque} className='bloque-card'>

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
                                return (
                                  <li key={ej.ID_Ejercicio}>
                                    {`0-${idx}: ${ej.reps} `}
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

        <ConfirmationPopup
          isOpen={isPopupOpen}
          onClose={handlePopupClose}
          onConfirm={handlePopupConfirm}
          message='¿Estás seguro de que deseas eliminar esta rutina?'
        />

      </div>
    </div>
  );
};

export default MiRutina;
