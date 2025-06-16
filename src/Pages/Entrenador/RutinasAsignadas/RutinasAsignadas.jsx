import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu'
import apiService from '../../../services/apiService'
import { toast } from 'react-toastify'
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen'
import './RutinasAsignadas.css' // Usamos el mismo CSS que MiRutina
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg';
import { useNavigate } from 'react-router-dom'

const RutinasAsignadas = () => {
    const [loading, setLoading] = useState(false)
    const [rutinas, setRutinas] = useState([])
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchUsers()
        loadRutinasAsignadas()
    }, [])

    // Traer todos los usuarios cliente para el filtro
    const fetchUsers = async () => {
        try {
            const data = await apiService.getAllUsuarios()
            setUsers(data.data.filter(u => u.tipo === 'cliente'))
        } catch (error) {
            console.error('Error cargando usuarios:', error)
            toast.error('No se pudieron cargar los usuarios para el filtro.')
        }
    }

    // Cargar todas las rutinas asignadas por el entrenador originalmente
    const loadRutinasAsignadas = async () => {
        setLoading(true)
        const entrenadorId = localStorage.getItem('usuarioId')
        try {
            const data = await apiService.getRutinasEntrenadores(entrenadorId)
            const lista = Array.isArray(data) ? data : data.rutinas || []
            // Enriquecer con datos de usuario asignado
            const enriched = await Promise.all(
                lista.map(async (rutina) => {
                    if (rutina.ID_Usuario) {
                        try {
                            const user = await apiService.getUserById(rutina.ID_Usuario)
                            return { ...rutina, Usuario: user }
                        } catch {
                            console.error(`Error cargando usuario ${rutina.ID_Usuario}`)
                        }
                    }
                    return rutina
                })
            )
            setRutinas(enriched)
        } catch (error) {
            console.error('Error cargando rutinas:', error)
            toast.error('Error al cargar las rutinas. Intenta nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    // Filtro por usuario seleccionado
    const handleSearch = async () => {
        if (!selectedUser) return
        setLoading(true)
        try {
            // Obtener rutinas para el usuario
            const data = await apiService.getUserRutinas(selectedUser.value)
            const lista = data.rutinas || []
            // Enriquecer cada rutina con el mismo usuario seleccionado
            const userData = users.find(u => u.ID_Usuario === selectedUser.value)
            const enriched = lista.map(rutina => ({ ...rutina, Usuario: userData }))
            setRutinas(enriched)
        } catch (error) {
            console.error('Error filtrando rutinas:', error)
            toast.error('No se pudieron filtrar las rutinas para ese usuario.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='page-layout'>
            {loading && <LoaderFullScreen />}
            <SidebarMenu isAdmin={false} isEntrenador={true} />
            <div className='content-layout mi-rutina-ctn'>
                <div className='mi-rutina-title' style={{marginBottom: '20px'}}>
                    <h2>Rutinas asignadas</h2>
                </div>

                {/* Filtros de usuario */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    <Select
                        options={users.map(u => ({
                            label: `${u.nombre} ${u.apellido} (${u.email})`,
                            value: u.ID_Usuario
                        }))}
                        value={selectedUser}
                        onChange={setSelectedUser}
                        placeholder='Seleccioná un usuario'
                        isSearchable
                    />

                    <PrimaryButton onClick={handleSearch} text="Buscar" />
                </div>

                <div className='mis-rutinas-list'>
                    {!loading && rutinas.length === 0 && (
                        <p>No tienes rutinas asignadas en este momento.</p>
                    )}

                    {rutinas.map(rutina => (
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

                                <p>
                                    <strong>Días:</strong> {rutina.DiasRutina?.map(d => d.dia).join(', ')}
                                </p>
                            </div>


                            <div className="rutina-asignada">
                                Asignado a <b> {rutina.Usuario && <span> {rutina.Usuario.nombre} {rutina.Usuario.apellido} </span>} </b>
                            </div>

                            {rutina.Bloques && rutina.Bloques.length > 0 && (
                                <div className='bloques-list'>
                                    {rutina.Bloques.map(bloque => (
                                        <div key={bloque.ID_Bloque} className='bloque-card'>
                                            {bloque.type === 'SETS_REPS' && (
                                                <>
                                                    <p>
                                                        {`${bloque.setsReps} ${bloque.nombreEj} ${bloque.weight || ''}`.trim()}
                                                    </p>
                                                    {bloque.ejercicios.map(ej => (
                                                        <p key={ej.ID_Ejercicio}>
                                                            {`${ej.reps} ${ej.setRepWeight}`}
                                                        </p>
                                                    ))}
                                                </>
                                            )}

                                            {bloque.type === 'ROUNDS' && (
                                                <>
                                                    <p>{`${bloque.cantRondas} rondas de:`}</p>
                                                    <ul style={{ paddingLeft: '20px' }}>
                                                        <li>
                                                            {`${bloque.setsReps} ${bloque.nombreEj} ${bloque.weight || ''}`.trim()}
                                                        </li>
                                                        {bloque.ejercicios.map(ej => (
                                                            <li key={ej.ID_Ejercicio}>
                                                                {`${ej.reps} ${ej.setRepWeight}`}
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
                                                                {`${ej.reps} ${ej.setRepWeight}`}
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
                                                                {`0-${idx}: ${ej.reps} ${ej.setRepWeight}`}
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
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RutinasAsignadas