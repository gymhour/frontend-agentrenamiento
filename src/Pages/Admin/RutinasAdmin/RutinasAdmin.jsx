import React, { useEffect, useState } from 'react'
import '../../../App.css'
import './RutinasAdmin.css'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu.jsx'
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton.jsx'
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp'
import apiService from '../../../services/apiService.js'
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen.jsx'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg'
import { ReactComponent as DeleteIcon } from '../../../assets/icons/trash.svg'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const RutinasAdmin = () => {
  const [rutinas, setRutinas] = useState([])
  const [loading, setLoading] = useState(true)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedRutinaId, setSelectedRutinaId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem('usuarioId')
    const fetchRutinas = async () => {
      try {
        const { rutinas: lista } = await apiService.getUserRutinas(userId)
        setRutinas(lista)
      } catch (error) {
        console.error('Error al obtener rutinas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRutinas()
  }, [])

  const openDeletePopup = id => {
    setSelectedRutinaId(id)
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    setSelectedRutinaId(null)
  }

  const handleConfirmDelete = async () => {
    if (selectedRutinaId) {
      setLoading(true)
      try {
        await apiService.deleteRutina(selectedRutinaId)
        setRutinas(prev => prev.filter(r => r.ID_Rutina !== selectedRutinaId))
        setLoading(false)
        toast.success("Rutina eliminada correctamente.")
      } catch (error) {
        console.error('Error al eliminar rutina', error)
        setLoading(false)
        toast.error("No se pudo eliminar la ruta. Intente nuevamente.")
      }
      closePopup()
    }
  }

  if (loading) return <LoaderFullScreen />

  return (
    <div className='page-layout'>
      <SidebarMenu isAdmin={true} />
      <div className='content-layout mi-rutina-ctn'>
        <div className="mi-rutina-title">
          <div>
            <h2>Mis Rutinas</h2>
          </div>
          <PrimaryButton text="Crear rutina" linkTo="/admin/crear-rutina" />
        </div>

        <div className="mis-rutinas-list">
          {rutinas.length === 0 ? (
            <p>No hay rutinas cargadas</p>
          ) : rutinas.map(rutina => (
            <div key={rutina.ID_Rutina} className="rutina-card">
              <div className='rutina-header'>
                <h3>{rutina.nombre}</h3>
                <div className="rutina-header-acciones">
                  <button
                    onClick={() => openDeletePopup(rutina.ID_Rutina)}
                    className='mi-rutina-eliminar-btn'
                  >
                    <DeleteIcon width={20} height={20} />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/editar-rutina/${rutina.ID_Rutina}`)}
                    className='mi-rutina-eliminar-btn'
                    title='Editar rutina'
                  >
                    <EditIcon width={20} height={20} />
                  </button>
                </div>
              </div>

              <div className="rutina-data">
                <p><strong>Clase:</strong> {rutina.claseRutina || '—'}</p>
                <p><strong>Grupo muscular:</strong> {rutina.grupoMuscularRutina || '—'}</p>
                <p>
                  <strong>Días:</strong>{' '}
                  {rutina.dias && rutina.dias.length > 0 ? rutina.dias.join(', ') : '—'}
                </p>
              </div>

              {rutina.bloques && rutina.bloques.length > 0 && (
                <div className="bloques-list">
                  {rutina.bloques.map(bloque => (
                    <div key={bloque.ID_Bloque} className="bloque-card">

                      {/* SETS & REPS — igual a MiRutina */}
                      {bloque.type === 'SETS_REPS' && (
                        <div>
                          {bloque.ejercicios.map(ej => {
                            const name = ej.ejercicio.nombre
                            const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl)
                            return (
                              <p key={ej.ID_Ejercicio}>
                                {bloque.setsReps}{' '}
                                {hasDetail ? (
                                  <Link to={`/admin/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
                                    {name}
                                  </Link>
                                ) : (
                                  name
                                )}
                              </p>
                            )
                          })}
                        </div>
                      )}

                      {/* ROUNDS — igual a MiRutina */}
                      {bloque.type === 'ROUNDS' && (
                        <div>
                          {(() => {
                            const count = bloque.cantRondas ?? bloque.ejercicios[0]?.reps
                            return count ? <p>{`${count} rondas de:`}</p> : null
                          })()}
                          <ul style={{ paddingLeft: '20px' }}>
                            {bloque.ejercicios.map(ej => {
                              const name = ej.ejercicio.nombre
                              const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl)
                              return (
                                <li key={ej.ID_Ejercicio}>
                                  {ej.reps}{' '}
                                  {hasDetail ? (
                                    <Link to={`/admin/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
                                      {name}
                                    </Link>
                                  ) : (
                                    name
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                          {bloque.descansoRonda != null && (
                            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                              {`con ${bloque.descansoRonda} segs de descanso`}
                            </p>
                          )}
                        </div>
                      )}

                      {/* EMOM — igual a MiRutina */}
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


                      {/* AMRAP — igual a MiRutina */}
                      {bloque.type === 'AMRAP' && (
                        <div>
                          <p>{`AMRAP ${bloque.durationMin}min:`}</p>
                          <ul style={{ paddingLeft: '20px' }}>
                            {bloque.ejercicios.map(ej => {
                              const name = ej.ejercicio.nombre
                              const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl)
                              return (
                                <li key={ej.ID_Ejercicio}>
                                  {ej.reps}{' '}
                                  {hasDetail ? (
                                    <Link to={`/admin/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
                                      {name}
                                    </Link>
                                  ) : (
                                    name
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}

                      {/* LADDER — igual a MiRutina */}
                      {bloque.type === 'LADDER' && (
                        <>
                          <p>{bloque.tipoEscalera}</p>
                          <ul style={{ paddingLeft: '20px' }}>
                            {bloque.ejercicios.map(ej => {
                              const label = ej.setRepWeight ?? ej.ejercicio.nombre
                              const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl)
                              return (
                                <li key={ej.ID_Ejercicio}>
                                  {hasDetail ? (
                                    <Link to={`/admin/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
                                      {label}
                                    </Link>
                                  ) : (
                                    label
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        </>
                      )}

                      {/* TABATA — estilo consistente + links */}
                      {bloque.type === 'TABATA' && (
                        <div>
                          <p>{`TABATA ${bloque.durationMin}min:`}</p>
                          {bloque.ejercicios?.length > 0 && (
                            <ul style={{ paddingLeft: '20px' }}>
                              {bloque.ejercicios.map(ej => {
                                const name = ej.ejercicio.nombre
                                const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl)
                                return (
                                  <li key={ej.ID_Ejercicio}>
                                    {ej.reps ? `${ej.reps} ` : ''}
                                    {hasDetail ? (
                                      <Link to={`/admin/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
                                        {name}
                                      </Link>
                                    ) : (
                                      name
                                    )}
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <ConfirmationPopup
          isOpen={isPopupOpen}
          message="¿Estás seguro que deseas eliminar esta rutina?"
          onClose={closePopup}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  )
}

export default RutinasAdmin