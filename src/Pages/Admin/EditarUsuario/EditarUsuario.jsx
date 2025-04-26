import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import apiService from '../../../services/apiService';
import { toast } from 'react-toastify';

const EditarUsuario = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    email: '',
    userType: '',
    nombre: '',
    apellido: '',
    direccion: '',
    profesion: '',
    tel: '',
    estado: '',
    fechaCumple: '',
  });

  const tiposDeUsuario = ['Cliente', 'Entrenador', 'Admin'];
  const opcionesEstado = ['Si', 'No'];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await apiService.getUserById(id);

        // formatea fechaCumple a YYYY-MM-DD para el <input type="date">
        const fechaISO = user.fechaCumple;
        const fecha = fechaISO
          ? new Date(fechaISO).toISOString().slice(0, 10)
          : '';

        // capitaliza el tipo de usuario
        const rawTipo = user.tipo || '';
        const tipo = rawTipo
          ? rawTipo.charAt(0).toUpperCase() + rawTipo.slice(1)
          : '';

        setFormData({
          email:      user.email    || '',
          userType:   tipo,
          nombre:     user.nombre   || '',
          apellido:   user.apellido || '',
          direccion:  user.direc    || '',
          profesion:  user.profesion|| '',
          tel:        user.tel      || '',
          estado:     user.estado ? 'Si' : 'No',
          fechaCumple: fecha,
        });
      } catch (error) {
        toast.error('Error al cargar la información del usuario');
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isoFecha = formData.fechaCumple ? new Date(formData.fechaCumple).toISOString() : null;
      const payload = {
        email:      formData.email,
        tipo:       formData.userType.toLowerCase(),
        nombre:     formData.nombre,
        apellido:   formData.apellido,
        direc:      formData.direccion,
        profesion:  formData.profesion,
        tel:        formData.tel,
        estado:     formData.estado === 'Si',
        fechaCumple: isoFecha,
      };

      await apiService.updateUserById(id, payload);
      toast.success('Usuario actualizado correctamente');
    } catch (error) {
      toast.error('No se pudo actualizar el usuario');
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
            width: '300px',
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

          <label htmlFor="direccion">Dirección:</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ingresa la dirección"
          />

          <label htmlFor="userType">Tipo de usuario:</label>
          <CustomDropdown
            options={tiposDeUsuario}
            value={formData.userType}
            onChange={handleChange}
            name="userType"
            id="userType"
          />

          <label htmlFor="profesion">Profesión:</label>
          <input
            type="text"
            id="profesion"
            name="profesion"
            value={formData.profesion}
            onChange={handleChange}
            placeholder="Ingresa la profesión"
          />

          <label htmlFor="estado">Activo:</label>
          <CustomDropdown
            options={opcionesEstado}
            value={formData.estado}
            onChange={handleChange}
            name="estado"
            id="estado"
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

          <label htmlFor="fechaCumple">Fecha de Cumpleaños:</label>
          <input
            type="date"
            id="fechaCumple"
            name="fechaCumple"
            value={formData.fechaCumple}
            onChange={handleChange}
          />

          <PrimaryButton text="Actualizar usuario" onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default EditarUsuario;