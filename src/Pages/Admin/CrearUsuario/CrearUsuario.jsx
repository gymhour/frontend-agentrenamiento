import React, { useState } from 'react';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import apiClient from '../../../axiosConfig';
import { toast } from 'react-toastify';

const CrearUsuario = () => {
  const initialFormData = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    profesion: '',
    direc: '',
    tel: '',
    tipo: 'cliente',
    fechaCumple: '',
    estado: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isoFecha = formData.fechaCumple
        ? new Date(formData.fechaCumple).toISOString()
        : null;

      await apiClient.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido,
        profesion: formData.profesion,
        direc: formData.direc,
        tel: formData.tel,
        tipo: formData.tipo.toLowerCase(),
        fechaCumple: isoFecha,
        estado: formData.estado,
      });

      toast.success('Usuario añadido correctamente');
      setFormData(initialFormData);
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo registrar el usuario';
      toast.error(msg);
    }
  };

  const tipos = ['Cliente', 'Entrenador', 'Admin'];
  const opcionesEstado = ['Si', 'No'];

  return (
    <div className='page-layout'>
      <SidebarMenu isAdmin={true} />
      <div className='content-layout'>
        <h2>Crear usuario</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px', paddingTop: '30px' }}
        >
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            placeholder='Ingresa tu email'
          />

          <label htmlFor='password'>Contraseña:</label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
            placeholder='Ingresa tu contraseña'
          />

          <label htmlFor='nombre'>Nombre:</label>
          <input
            type='text'
            id='nombre'
            name='nombre'
            value={formData.nombre}
            onChange={handleChange}
            placeholder='Ingresa el nombre'
          />

          <label htmlFor='apellido'>Apellido:</label>
          <input
            type='text'
            id='apellido'
            name='apellido'
            value={formData.apellido}
            onChange={handleChange}
            placeholder='Ingresa el apellido'
          />

          <label htmlFor='profesion'>Profesión:</label>
          <input
            type='text'
            id='profesion'
            name='profesion'
            value={formData.profesion}
            onChange={handleChange}
            placeholder='Ingresa la profesión'
          />

          <label htmlFor='direc'>Dirección:</label>
          <input
            type='text'
            id='direc'
            name='direc'
            value={formData.direc}
            onChange={handleChange}
            placeholder='Ingresa la dirección'
          />

          <label htmlFor='tel'>Teléfono:</label>
          <input
            type='tel'
            id='tel'
            name='tel'
            value={formData.tel}
            onChange={handleChange}
            placeholder='Ingresa el teléfono'
          />

          <label htmlFor='tipo'>Tipo de usuario:</label>
          <CustomDropdown
            options={tipos}
            value={formData.tipo}
            onChange={(val) => setFormData((f) => ({
              ...f,
              tipo: typeof val === 'string' ? val : val.target.value,
            }))}
            name='tipo'
            id='tipo'
          />

          <label htmlFor='estado'>Activo:</label>
          <CustomDropdown
            options={opcionesEstado}
            value={formData.estado ? 'Si' : 'No'}
            onChange={(val) => setFormData((f) => ({
              ...f,
              estado: typeof val === 'string' ? val === 'Si' : val.target.value === 'Si',
            }))}
            name='estado'
            id='estado'
          />

          <label htmlFor='fechaCumple'>Fecha de Nacimiento:</label>
          <input
            type='date'
            id='fechaCumple'
            name='fechaCumple'
            value={formData.fechaCumple}
            onChange={handleChange}
          />

          <PrimaryButton text='Crear usuario' type='submit' onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;