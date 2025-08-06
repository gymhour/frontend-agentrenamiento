import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import apiClient from '../../../axiosConfig';
import CustomInput from '../../../Components/utils/CustomInput/CustomInput';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import './EjercicioForm.css';

const EjercicioForm = ({ fromAdmin, fromEntrenador }) => {
  const navigate = useNavigate();
  const { id } = useParams();    
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Si es edición, cargar datos
  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/ejercicios/${id}`);
        setNombre(data.nombre || '');
        setDescripcion(data.descripcion || '');
        setYoutubeUrl(data.youtubeUrl || '');
        setInstrucciones(data.instrucciones || '');
      } catch (err) {
        console.error(err);
        toast.error('No se pudo cargar el ejercicio.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditing]);

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async evt => {
    evt.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('nombre', nombre);
      payload.append('descripcion', descripcion);
      payload.append('youtubeUrl', youtubeUrl);
      payload.append('instrucciones', instrucciones);
      if (imageFile) payload.append('imagen', imageFile);

      if (isEditing) {
        await apiClient.put(`/ejercicios/${id}`, payload);
        toast.success('Ejercicio actualizado correctamente.');
      } else {
        await apiClient.post('/ejercicios', payload);
        toast.success('Ejercicio creado correctamente.');
      }

      // Volver al listado correspondiente
      const basePath = fromAdmin
        ? '/admin/ejercicios'
        : fromEntrenador
        ? '/entrenador/ejercicios'
        : '/ejercicios';
      navigate(basePath);
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar ejercicio. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const basePath = fromAdmin
      ? '/admin/ejercicios'
      : fromEntrenador
      ? '/entrenador/ejercicios'
      : '/ejercicios';
    navigate(basePath);
  };

  return (
    <div className='page-layout'>
      <SidebarMenu isAdmin={fromAdmin} isEntrenador={fromEntrenador} />
      {loading && <LoaderFullScreen />}
      <div className='content-layout'>
        <h2 className='ejercicio-form-title'>
          {isEditing ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
        </h2>

        <form className='exercise-form' onSubmit={handleSubmit}>
          <div className='form-input-ctn'>
            <label>Nombre</label>
            <CustomInput
              type='text'
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder='Nombre del ejercicio'
              required
            />
          </div>

          <div className='form-input-ctn'>
            <label>Descripción</label>
            <CustomInput
              type='text'
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder='Descripción (opcional)'
            />
          </div>

          <div className='form-input-ctn'>
            <label>URL de YouTube</label>
            <CustomInput
              type='text'
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              placeholder='https://www.youtube.com/...'
            />
          </div>

          <div className='form-input-ctn'>
            <label>Instrucciones</label>
            <textarea
              value={instrucciones}
              onChange={e => setInstrucciones(e.target.value)}
              placeholder='- Mantener la espalda recta - Bajar hasta el fondo.'
              rows={4}
              className='custom-textarea'
            />
          </div>

          <div className='form-input-ctn'>
            <label>Imagen</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
            />
          </div>

          <div className='form-actions'>
            <SecondaryButton text='Cancelar' onClick={handleCancel} />
            <PrimaryButton
              type='submit'
              text={isEditing ? 'Actualizar' : 'Crear'}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EjercicioForm;