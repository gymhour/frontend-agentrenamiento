import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import apiService from '../../../services/apiService';
import { toast } from 'react-toastify';

const EditarUsuario = () => {
  const { id } = useParams();

  const initialFormData = {
    email: '',
    nombre: '',
    apellido: '',
    profesion: '',
    direc: '',
    tel: '',
    tipo: 'Cliente',
    fechaCumple: '',
    estado: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [avatarFile, setAvatarFile] = useState(null);

  const tipos = ['Cliente', 'Entrenador', 'Admin'];
  const opcionesEstado = ['Si', 'No'];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiService.getUserById(id);
        const fechaISO = user.fechaCumple
          ? new Date(user.fechaCumple).toISOString().slice(0, 10)
          : '';
        const rawTipo = user.tipo || '';
        const tipoCapitalizado = rawTipo
          ? rawTipo.charAt(0).toUpperCase() + rawTipo.slice(1)
          : 'Cliente';

        setFormData({
          email:      user.email    || '',
          nombre:     user.nombre   || '',
          apellido:   user.apellido || '',
          profesion:  user.profesion|| '',
          direc:      user.direc    || '',
          tel:        user.tel      || '',
          tipo:       tipoCapitalizado,
          fechaCumple: fechaISO,
          estado:     !!user.estado,
        });
      } catch (err) {
        console.error(err);
        toast.error('No se pudo cargar los datos del usuario');
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleTipoChange = (val) => {
    const tipo = typeof val === 'string' ? val : val.target.value;
    setFormData(f => ({ ...f, tipo }));
  };

  const handleEstadoChange = (val) => {
    const estado = typeof val === 'string'
      ? val === 'Si'
      : val.target.value === 'Si';
    setFormData(f => ({ ...f, estado }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isoFecha = formData.fechaCumple
        ? new Date(formData.fechaCumple).toISOString()
        : '';

      const payload = new FormData();
      payload.append('email', formData.email);
      payload.append('nombre', formData.nombre);
      payload.append('apellido', formData.apellido);
      payload.append('direc', formData.direc);
      payload.append('tel', formData.tel);
      payload.append('tipo', formData.tipo.toLowerCase());
      payload.append('fechaCumple', isoFecha);
      // payload.append('estado', formData.estado);

      if (formData.tipo === 'Entrenador' && formData.profesion) {
        payload.append('profesion', formData.profesion);
      }

      if (avatarFile) {
        payload.append('avatar', avatarFile);
      }

      await apiService.updateUserById(id, payload);
      toast.success('Usuario actualizado correctamente');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error al actualizar usuario';
      toast.error(msg);
    }
  };

  return (
    <div className="page-layout">
      <SidebarMenu isAdmin={true} />
      <div className="content-layout">
        <h2>Editar usuario</h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '320px',
            paddingTop: '30px',
          }}
        >
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Ingresa tu email"
          />

          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingresa el nombre"
          />

          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Ingresa el apellido"
          />

          <label htmlFor="tipo">Tipo de usuario:</label>
          <CustomDropdown
            options={tipos}
            value={formData.tipo}
            onChange={handleTipoChange}
            name="tipo"
            id="tipo"
          />

          {formData.tipo === 'Entrenador' && (
            <>
              <label htmlFor="profesion">Profesión:</label>
              <input
                type="text"
                id="profesion"
                name="profesion"
                value={formData.profesion}
                onChange={handleChange}
                placeholder="Ingresa la profesión"
              />
            </>
          )}

          <label htmlFor="direc">Dirección:</label>
          <input
            type="text"
            id="direc"
            name="direc"
            value={formData.direc}
            onChange={handleChange}
            placeholder="Ingresa la dirección"
          />

          <label htmlFor="tel">Teléfono:</label>
          <input
            type="tel"
            id="tel"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            placeholder="Ingresa el teléfono"
          />

          <label htmlFor="estado">Activo:</label>
          <CustomDropdown
            options={opcionesEstado}
            value={formData.estado ? 'Si' : 'No'}
            onChange={handleEstadoChange}
            name="estado"
            id="estado"
          />

          <label htmlFor="fechaCumple">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="fechaCumple"
            name="fechaCumple"
            value={formData.fechaCumple}
            onChange={handleChange}
          />

          <label htmlFor="avatar">Avatar:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
          />

          <PrimaryButton text="Actualizar usuario" type="submit" onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default EditarUsuario;