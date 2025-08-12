import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu'
import apiService from '../../../services/apiService'
import { toast } from 'react-toastify'
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen'
import './RutinasAsignadas.css'
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg'
import { useNavigate, Link } from 'react-router-dom'
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton'

const RutinasAsignadas = () => {
  const [loading, setLoading] = useState(false)
  const [allRutinas, setAllRutinas] = useState([])
  const [rutinas, setRutinas] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
    loadRutinasAsignadas()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await apiService.getAllUsuarios()
      setUsers(data.filter(u => u.tipo === 'cliente'))
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      toast.error('No se pudieron cargar los usuarios para el filtro.')
    }
  }

  const loadRutinasAsignadas = async () => {
    setLoading(true)
    const entrenadorId = localStorage.getItem('usuarioId')
    try {
      const { rutinas: lista } = await apiService.getRutinasEntrenadores(entrenadorId)
      setAllRutinas(lista)
      setRutinas(lista)
    } catch (error) {
      console.error('Error cargando rutinas:', error)
      toast.error('Error al cargar las rutinas. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (!selectedUser) {
      setRutinas(allRutinas)
      return
    }
    const userId = Number(selectedUser.value)
    const filtrado = allRutinas.filter(r =>
      Number(r.alumno.ID_Usuario) === userId
    )
    setRutinas(filtrado)
  }

  const limpiarFiltros = () => {
    setSelectedUser(null);
    setRutinas(allRutinas);
  };
  
  if (loading) return <LoaderFullScreen />

  return (
    <div className='page-layout'>
      <SidebarMenu isAdmin={false} isEntrenador={true} />
      <div className='content-layout mi-rutina-ctn'>

        <div className='mi-rutina-title' style={{ marginBottom: '20px' }}>
          <h2>Rutinas asignadas</h2>
        </div>

        {/* ——— Filtro por usuario ——— */}
        <div className='rutinas-asignadas-filtro-ctn'>
          <Select
            options={users.map(u => ({
              label: `${u.nombre} ${u.apellido} (${u.email})`,
              value: u.ID_Usuario
            }))}
            value={selectedUser}
            onChange={setSelectedUser}
            placeholder='Seleccioná un usuario'
            isClearable
            isSearchable
          />
          <div className="rutinas-asignadas-filtros-btns">
            <PrimaryButton onClick={handleSearch} text="Buscar" />
            <SecondaryButton onClick={limpiarFiltros} text="Limpiar" />
          </div>
        </div>

        {/* ——— Listado de rutinas ——— */}
        <div className='mis-rutinas-list'>
          {rutinas.length === 0 ? (
            <p>No tienes rutinas asignadas en este momento.</p>
          ) : rutinas.map(rutina => (
            <div key={rutina.ID_Rutina} className='rutina-card'>
              <div className='rutina-header'>
                <h3>{rutina.nombre}</h3>
                <div className="rutina-header-acciones">
                  <button
                    onClick={() => navigate(`/entrenador/editar-rutina/${rutina.ID_Rutina}`)}
                    className='mi-rutina-eliminar-btn'
                    title='Editar rutina'
                  >
                    <EditIcon width={20} height={20} />
                  </button>
                </div>
              </div>

              <div className='rutina-data'>
                <p><strong>Días:</strong> {rutina.dias.join(', ')}</p>
              </div>

              {rutina.bloques && rutina.bloques.length > 0 && (
                <div className='bloques-list'>
                  {rutina.bloques.map(bloque => (
                    <div key={bloque.ID_Bloque} className='bloque-card'>

                      {/* SETS & REPS (igual que MiRutina) */}
                      {bloque.type === 'SETS_REPS' && (
                        <div>
                          {bloque.ejercicios.map(ej => {
                            const name = ej.ejercicio.nombre
                            const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl)
                            return (
                              <p key={ej.ID_Ejercicio}>
                                {bloque.setsReps}{' '}
                                {hasDetail ? (
                                  <Link to={`/entrenador/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
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

                      {/* ROUNDS (igual que MiRutina) */}
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
                                    <Link to={`/entrenador/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
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

                      {/* EMOM (igual que MiRutina) */}
                      {bloque.type === 'EMOM' && (
                        <div>
                          <p>{`EMOM ${bloque.durationMin}min:`}</p>
                          <ul style={{ paddingLeft: '20px' }}>
                            {bloque.ejercicios.map((ej, idx) => {
                              const name = ej.ejercicio.nombre
                              const hasDetail = !!(ej.ejercicio.descripcion || ej.ejercicio.mediaUrl)
                              return (
                                <li key={ej.ID_Ejercicio}>
                                  {`0-${idx}: ${ej.reps} `}
                                  {hasDetail ? (
                                    <Link to={`/entrenador/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
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

                      {/* AMRAP (igual que MiRutina) */}
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
                                    <Link to={`/entrenador/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
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

                      {/* LADDER (igual que MiRutina) */}
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
                                    <Link to={`/entrenador/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
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

                      {/* TABATA — mantenemos el estilo y agregamos lista linkeable */}
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
                                      <Link to={`/entrenador/ejercicios/${ej.ejercicio.ID_Ejercicio}`} className='exercise-link'>
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

              <div className="rutina-asignada">
                <strong>Asignada a:</strong> {rutina.alumno.nombre} {rutina.alumno.apellido}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RutinasAsignadas