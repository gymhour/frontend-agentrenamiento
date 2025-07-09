import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import apiService from '../../../services/apiService';
import apiClient from '../../../axiosConfig';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp';
import CustomInput from '../../../Components/utils/CustomInput/CustomInput';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import './EjerciciosAdmin.css';
import EjercicioCard from '../../../Components/EjercicioCard/EjercicioCard';

const EjerciciosAdmin = () => {
  const defaultImage =
    'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';

  const [loading, setLoading] = useState(false);
  const [ejercicios, setEjercicios] = useState([]);

  // Modal y selección
  const [showModal, setShowModal] = useState(false);
  const [editingEjercicio, setEditingEjercicio] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  // Campos del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instrucciones, setInstrucciones] = useState('');

  // Buscador
  const [searchTerm, setSearchTerm] = useState('');
  const filteredEjercicios = useMemo(() => {
    if (!searchTerm) return ejercicios;
    const term = searchTerm.toLowerCase();
    return ejercicios.filter(e =>
      e.nombre?.toLowerCase().includes(term)
    );
  }, [ejercicios, searchTerm]);

  // --- Fetch y orden alfabético ---
  const fetchEjercicios = async () => {
    setLoading(true);
    try {
      const data = await apiService.getEjercicios();
      const sorted = [...data].sort((a, b) =>
        (a.nombre || '').localeCompare(b.nombre || '', 'es', { sensitivity: 'base' })
      );
      setEjercicios(sorted);
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar los ejercicios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEjercicios();
  }, []);

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
    setEditingEjercicio(null);
    setNombre('');
    setDescripcion('');
    setImageFile(null);
    setYoutubeUrl('');
    setInstrucciones('');
    setShowModal(true);
  };

  const handleEdit = ejercicio => {
    setEditingEjercicio(ejercicio);
    setNombre(ejercicio.nombre || '');
    setDescripcion(ejercicio.descripcion || '');
    setYoutubeUrl(ejercicio.youtubeUrl || '');
    setInstrucciones(ejercicio.instrucciones || '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async evt => {
    evt.preventDefault();
    setLoading(true);
    try {
      setShowModal(false);
      const payload = new FormData();
      payload.append('nombre', nombre);
      payload.append('descripcion', descripcion);
      payload.append('youtubeUrl', youtubeUrl);
      payload.append('instrucciones', instrucciones);
      if (imageFile) payload.append('imagen', imageFile);

      if (editingEjercicio) {
        await apiClient.put(
          `/ejercicios/${editingEjercicio.ID_Ejercicio}`,
          payload
        );
        toast.success('Ejercicio actualizado correctamente.');
      } else {
        await apiClient.post('/ejercicios', payload);
        toast.success('Ejercicio creado correctamente.');
      }
      await fetchEjercicios();
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar ejercicio. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const openDeletePopup = ejercicio => setToDelete(ejercicio);
  const closeDeletePopup = () => setToDelete(null);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setLoading(true);
    try {
      closeDeletePopup();
      await apiService.deleteEjercicios(toDelete.ID_Ejercicio);
      toast.success(`Ejercicio "${toDelete.nombre}" eliminado.`);
      await fetchEjercicios();
    } catch (err) {
      closeDeletePopup();
      console.error(err);
      toast.error('Error al eliminar ejercicio.');
    } finally {
      setLoading(false);
    }
  };

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
          type='text'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder='Buscar ejercicios...'
        />

        <div className='ejercicios-list'>
          {Object.keys(grouped)
            .sort()
            .map(letter => (
              <div key={letter} className='exercise-group'>
                <h2 className='exercise-group__letter'>{letter}</h2>
                <div className='exercise-group__grid'>
                  {grouped[letter].map(e => (
                    <EjercicioCard
                      key={e.ID_Ejercicio}
                      ejercicio={e}
                      defaultImage={defaultImage}
                      onEdit={handleEdit}
                      onDelete={openDeletePopup}
                    />
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
            <form className='plan-form'>
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
                <label>URL de YouTube</label>
                <CustomInput
                  type='text'
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder='https://www.youtube.com/...'
                />
              </div>
              <div className='form-input-container'>
                <label>Instrucciones</label>
                <textarea
                  value={instrucciones}
                  onChange={e => setInstrucciones(e.target.value)}
                  placeholder='- Mantener la espalda recta - Bajar hasta el fondo.'
                  rows={4}
                  className='custom-textarea'
                />
              </div>
              <div className='form-input-container'>
                <label>Imagen</label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  style={{maxWidth: '300px'}}
                />
              </div>
              <div className='modal-actions'>
                <SecondaryButton
                  text='Cancelar'
                  onClick={() => setShowModal(false)}
                />
                <PrimaryButton
                  onClick={handleSubmit}
                  text={editingEjercicio ? 'Actualizar' : 'Crear'}
                  type='submit'
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
  );
};

export default EjerciciosAdmin;