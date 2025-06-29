import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu'
import apiService from '../../../services/apiService'
import { toast } from 'react-toastify'
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen'
import './RutinasAsignadas.css' // Usamos el mismo CSS que MiRutina
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg'
import { useNavigate } from 'react-router-dom'

const RutinasAsignadas = () => {
  const [loading, setLoading] = useState(false)
  const [allRutinas, setAllRutinas] = useState([])      // Guarda todas las rutinas
  const [rutinas, setRutinas] = useState([])            // Rutinas a mostrar (posiblemente filtradas)
  const [users, setUsers] = useState([])                // Lista de clientes para el filtro
  const [selectedUser, setSelectedUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
    loadRutinasAsignadas()
  }, [])

  // Traer todos los usuarios de tipo 'cliente'
  const fetchUsers = async () => {
    try {
      const { data } = await apiService.getAllUsuarios()
      setUsers(data.filter(u => u.tipo === 'cliente'))
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      toast.error('No se pudieron cargar los usuarios para el filtro.')
    }
  }

  // Cargar todas las rutinas asignadas por este entrenador
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

  // Filtrar por usuario seleccionado
  const handleSearch = () => {
    if (!selectedUser) {
      // Si limpio el select, muestro todo
      setRutinas(allRutinas)
    } else {
      const filtrado = allRutinas.filter(r => 
        // Asumo que rutina.alumno tiene el campo ID_Usuario
        Number(r.alumno.ID_Usuario) === Number(selectedUser.value)
      )
      setRutinas(filtrado)
    }
  }

  if (loading) return <LoaderFullScreen />

  return (
    <div className='page-layout'>
      <SidebarMenu isAdmin={false} isEntrenador={true} />
      <div className='content-layout mi-rutina-ctn'>

        <div className='mi-rutina-title' style={{ marginBottom: '20px' }}>
          <h2>Rutinas asignadas</h2>
        </div>

        {/* ——— Filtro por usuario ——— */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
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
          <PrimaryButton onClick={handleSearch} text="Buscar" />
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

                      {/* SETS & REPS */}
                      {bloque.type === 'SETS_REPS' && (
                        <>
                          <p>
                            {`${bloque.setsReps} ${bloque.nombreEj || ''} ${bloque.weight || ''}`.trim()}
                          </p>
                          {bloque.ejercicios.map(ej => (
                            <p key={ej.ID_Ejercicio}>
                              {`${ej.ejercicio.nombre}: ${ej.reps} ${ej.setRepWeight}`}
                            </p>
                          ))}
                        </>
                      )}

                      {/* ROUNDS */}
                      {bloque.type === 'ROUNDS' && (
                        <>
                          <p>{`${bloque.cantRondas} rondas de:`}</p>
                          <ul style={{ paddingLeft: '20px' }}>
                            <li>
                              {`${bloque.setsReps} ${bloque.nombreEj || ''} ${bloque.weight || ''}`.trim()}
                            </li>
                            {bloque.ejercicios.map(ej => (
                              <li key={ej.ID_Ejercicio}>
                                {`${ej.ejercicio.nombre}: ${ej.reps} ${ej.setRepWeight}`}
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

                      {/* AMRAP */}
                      {bloque.type === 'AMRAP' && (
                        <>
                          <p>{`AMRAP ${bloque.durationMin}min:`}</p>
                          <ul style={{ paddingLeft: '20px' }}>
                            {bloque.ejercicios.map(ej => (
                              <li key={ej.ID_Ejercicio}>
                                {`${ej.ejercicio.nombre}: ${ej.reps} ${ej.setRepWeight}`}
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
                                {`0-${idx}: ${ej.ejercicio.nombre} ${ej.reps} ${ej.setRepWeight}`}
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
                            {bloque.ejercicios.map(ej => (
                              <li key={ej.ID_Ejercicio}>{ej.setRepWeight}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {/* TABATA */}
                      {bloque.type === 'TABATA' && (
                        <p>{`TABATA ${bloque.durationMin}min`}</p>
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
