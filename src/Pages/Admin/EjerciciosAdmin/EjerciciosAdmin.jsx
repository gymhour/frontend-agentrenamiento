import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu'
import apiService from '../../../services/apiService'
import apiClient from '../../../axiosConfig'
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen'
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp'
import CustomInput from '../../../Components/utils/CustomInput/CustomInput'
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton'
import './EjerciciosAdmin.css'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg'
import { ReactComponent as DeleteIcon } from '../../../assets/icons/trash.svg'

const EjerciciosAdmin = () => {
    const defaultImage =
        'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'

    const [loading, setLoading] = useState(false)
    const [ejercicios, setEjercicios] = useState([])

    // Modal y selección
    const [showModal, setShowModal] = useState(false)
    const [editingEjercicio, setEditingEjercicio] = useState(null)
    const [toDelete, setToDelete] = useState(null)

    // Campos del formulario
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [imageFile, setImageFile] = useState(null)

    // Buscador
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEjercicios = useMemo(() => {
        if (!searchTerm) return ejercicios;
        const term = searchTerm.toLowerCase();
        return ejercicios.filter(e =>
            e.nombre?.toLowerCase().includes(term)
        );
    }, [ejercicios, searchTerm]);


    // --- Fetch y orden/alfa ---
    const fetchEjercicios = async () => {
        setLoading(true)
        try {
            const data = await apiService.getEjercicios()
            const sorted = [...data].sort((a, b) =>
                (a.nombre || '')
                    .localeCompare(b.nombre || '', 'es', { sensitivity: 'base' })
            )
            setEjercicios(sorted)
        } catch (err) {
            console.error(err)
            toast.error('No se pudieron cargar los ejercicios.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEjercicios()
    }, [])

    // --- Agrupar por letra inicial ---
    const grouped = useMemo(() => {
        return filteredEjercicios.reduce((acc, e) => {
            const letter = (e.nombre || '')[0]?.toUpperCase() || '';
            if (!letter) return acc;
            (acc[letter] ||= []).push(e);
            return acc;
        }, {});
    }, [filteredEjercicios]);

    // --- Handlers modal / CRUD ---
    const handleCreate = () => {
        setEditingEjercicio(null)
        setNombre('')
        setDescripcion('')
        setImageFile(null)
        setShowModal(true)
    }

    const handleEdit = ejercicio => {
        setEditingEjercicio(ejercicio)
        setNombre(ejercicio.nombre || '')
        setDescripcion(ejercicio.descripcion || '')
        setImageFile(null)
        setShowModal(true)
    }

    const handleFileChange = e => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const handleSubmit = async evt => {
        evt.preventDefault()
        setLoading(true)
        try {
            setShowModal(false)
            const payload = new FormData()
            payload.append('nombre', nombre)
            payload.append('descripcion', descripcion)
            if (imageFile) payload.append('imagen', imageFile)

            if (editingEjercicio) {
                await apiClient.put(
                    `/ejercicios/${editingEjercicio.ID_Ejercicio}`,
                    payload
                )
                toast.success('Ejercicio actualizado correctamente.')
            } else {
                await apiClient.post('/ejercicios', payload)
                toast.success('Ejercicio creado correctamente.')
            }
            await fetchEjercicios()
        } catch (err) {
            console.error(err)
            toast.error('Error al guardar ejercicio. Intente nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    const openDeletePopup = ejercicio => setToDelete(ejercicio)
    const closeDeletePopup = () => setToDelete(null)
    const confirmDelete = async () => {
        if (!toDelete) return
        setLoading(true)
        try {
            closeDeletePopup()
            await apiService.deleteEjercicios(toDelete.ID_Ejercicio)
            toast.success(`Ejercicio "${toDelete.nombre}" eliminado.`)
            await fetchEjercicios()
        } catch (err) {
            closeDeletePopup()
            console.error(err)
            toast.error('Error al eliminar ejercicio.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={true} />
            {loading && <LoaderFullScreen />}

            <div className='content-layout'>
                <div className='exercises-header'>
                    <h2>Listado de Ejercicios</h2>
                    <PrimaryButton text='Nuevo ejercicio' onClick={handleCreate} />
                </div>

                <CustomInput
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar ejercicios..."
                />


                <div className='ejercicios-list'>
                    {Object.keys(grouped)
                        .sort()
                        .map(letter => (
                            <div key={letter} className='exercise-group'>
                                <h2 className='exercise-group__letter'>{letter}</h2>
                                <div className='exercise-group__grid'>
                                    {grouped[letter].map(e => (
                                        <div className='exercise-card' key={e.ID_Ejercicio}>
                                            <div className='exercise-card__img_content'>
                                                <div className='exercise-card__image-wrapper'>
                                                    <img
                                                        src={e.mediaUrl || defaultImage}
                                                        alt={e.nombre || 'Ejercicio sin nombre'}
                                                        className='exercise-card__image'
                                                    />
                                                </div>
                                                <div className='exercise-card__content'>
                                                    <h3 className='exercise-card__title'>
                                                        {e.nombre || 'Sin nombre'}
                                                    </h3>
                                                    <p className='exercise-card__description'>
                                                        {e.descripcion || 'Descripción no disponible'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='exercise-card__actions'>
                                                <EditIcon
                                                    width={20}
                                                    height={20}
                                                    onClick={() => handleEdit(e)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                                <DeleteIcon
                                                    width={20}
                                                    height={20}
                                                    onClick={() => openDeletePopup(e)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Modal Crear/Editar */}
            {showModal && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <h2 style={{ color: '#FAFAFA', marginBottom: '20px' }}>
                            {editingEjercicio ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
                        </h2>
                        <form onSubmit={handleSubmit} className='plan-form'>
                            <div className='form-input-container'>
                                <label>Nombre</label>
                                <CustomInput
                                    type='text'
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    placeholder='Nombre del ejercicio'
                                    required
                                />
                            </div>
                            <div className='form-input-container'>
                                <label>Descripción</label>
                                <CustomInput
                                    type='text'
                                    value={descripcion}
                                    onChange={e => setDescripcion(e.target.value)}
                                    placeholder='Descripción (opcional)'
                                />
                            </div>
                            <div className='form-input-container'>
                                <label>Imagen</label>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className='modal-actions'>
                                <SecondaryButton
                                    text='Cancelar'
                                    onClick={() => setShowModal(false)}
                                />
                                <PrimaryButton
                                    text={editingEjercicio ? 'Actualizar' : 'Crear'}
                                    type='submit'
                                    onClick={handleSubmit}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Popup Confirmación */}
            {toDelete && (
                <ConfirmationPopup
                    isOpen={!!toDelete}
                    message={`¿Está seguro que quiere eliminar el ejercicio "${toDelete.nombre}"?`}
                    onClose={closeDeletePopup}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    )
}

export default EjerciciosAdmin
