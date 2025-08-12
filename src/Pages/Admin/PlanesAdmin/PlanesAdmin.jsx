import React, { useState, useEffect } from 'react'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu'
import apiService from '../../../services/apiService'
import './PlanesAdmin.css'
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg'
import { ReactComponent as DeleteIcon } from '../../../assets/icons/trash.svg'
import CustomInput from '../../../Components/utils/CustomInput/CustomInput'
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen'
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp'
import { toast } from 'react-toastify'

const PlanesAdmin = () => {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [nuevaDesc, setNuevaDesc] = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [editingPlan, setEditingPlan] = useState(null)

  const fetchPlanes = async () => {
    setLoading(true)
    try {
      const data = await apiService.getPlanes()
      setPlanes(data)
    } catch (error) {
      console.error('Error al obtener planes:', error)
      toast.error('No se pudieron cargar los planes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlanes()
  }, [])

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingPlan(null)
    setNuevoNombre('')
    setNuevoPrecio('')
    setNuevaDesc('')
    setShowModal(true)
  }

  // Abrir modal para editar
  const handleEdit = (plan) => {
    setEditingPlan(plan)
    setNuevoNombre(plan.nombre)
    setNuevoPrecio(plan.precio)
    setNuevaDesc(plan.desc || '')
    setShowModal(true)
  }

  // Cerrar modal y reset
  const handleClose = () => {
    setEditingPlan(null)
    setNuevoNombre('')
    setNuevoPrecio('')
    setNuevaDesc('')
    setShowModal(false)
  }

  // Crear o actualizar plan
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const body = { nombre: nuevoNombre, precio: parseInt(nuevoPrecio, 10), desc: nuevaDesc }
    try {
      if (editingPlan) {
        await apiService.putPlanes(editingPlan.ID_Plan, body)
        toast.success('Plan actualizado correctamente.')
      } else {
        await apiService.postPlanes(body)
        toast.success('Plan creado correctamente.')
      }
      handleClose()
      await fetchPlanes()
    } catch (error) {
      console.error('Error al guardar plan:', error)
      toast.error('Error al guardar plan. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Abrir popup de confirmación
  const openDeletePopup = (plan) => setToDelete(plan)
  const closeDeletePopup = () => setToDelete(null)

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!toDelete) return
    setLoading(true)
    try {
      await apiService.deletePlanes(toDelete.ID_Plan)
      toast.success(`Plan "${toDelete.nombre}" eliminado correctamente.`)
      await fetchPlanes()
    } catch (error) {
      console.error('Error al eliminar plan:', error)
      toast.error('Error al eliminar plan. Intente nuevamente.')
    } finally {
      setLoading(false)
      closeDeletePopup()
    }
  }

  return (
    <div className="page-layout">
      <SidebarMenu isAdmin={true} />
      {loading && <LoaderFullScreen />}
      <div className="content-layout">
        <div className="planes-header">
          <h2>Administración de Planes</h2>
          <PrimaryButton text='Nuevo plan' onClick={handleCreate} />
        </div>

        {!loading && (
          <div className="planes-grid">
            {planes.map((plan) => (
              <div key={plan.ID_Plan} className="plan-card">
                <div className="plan-card-header">
                  <h2 className="plan-name">{plan.nombre}</h2>
                  <span className="plan-id">#{plan.ID_Plan}</span>
                </div>
                <p className="plan-desc">{plan.desc || 'Sin descripción'}</p>
                <p className="plan-price">${plan.precio.toLocaleString()}</p>
                <div className="plan-actions">
                  <div onClick={() => handleEdit(plan)} style={{ cursor: 'pointer' }}>
                    <EditIcon width={20} height={20} />
                  </div>
                  <div onClick={() => openDeletePopup(plan)} style={{ cursor: 'pointer' }}>
                    <DeleteIcon width={20} height={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de crear/editar */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 style={{marginBottom: '20px'}}> {editingPlan ? 'Editar Plan' : 'Nuevo Plan'}</h2>
              <form onSubmit={handleSubmit} className="plan-form">
                <div className="plan-form-input-container">
                  <label>Nombre</label>
                  <CustomInput
                    type="text"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="plan-form-input-container">
                  <label>Precio</label>
                  <CustomInput
                    type="number"
                    value={nuevoPrecio}
                    onChange={(e) => setNuevoPrecio(e.target.value)}
                    required
                  />
                </div>
                <div className="plan-form-input-container">
                  <label>Descripción</label>
                  <CustomInput
                        placeholder="Descripción (opcional)"
                        value={nuevaDesc}
                        onChange={(e) => setNuevaDesc(e.target.value)}
                    />
                </div>
                <div className="modal-actions">
                  <SecondaryButton text="Cancelar" onClick={handleClose} />
                  <PrimaryButton text={editingPlan ? 'Actualizar' : 'Crear'} onClick={handleSubmit} />
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Popup de confirmación */}
        {toDelete && (
          <ConfirmationPopup
            isOpen={!!toDelete}
            message={`¿Está seguro que quiere eliminar el plan "${toDelete.nombre}"? Esta acción no se puede deshacer.`}
            onClose={closeDeletePopup}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </div>
  )
}

export default PlanesAdmin
