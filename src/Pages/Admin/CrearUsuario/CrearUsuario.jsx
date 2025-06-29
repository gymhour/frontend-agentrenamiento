import React, { useState, useEffect } from 'react';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import apiClient from '../../../axiosConfig';
import apiService from '../../../services/apiService';
import { toast } from 'react-toastify';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../Components/utils/CustomInput/CustomInput';

const CrearUsuario = () => {
  const initialFormData = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    profesion: '',
    direc: '',
    tel: '',
    tipo: '',
    fechaCumple: '',
    plan: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [planOptions, setPlanOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const data = await apiService.getPlanes();
        setPlanOptions(data.map(p => ({ label: p.nombre, value: p.ID_Plan })))
      } catch (error) {
        console.error('Error al cargar planes:', error);
        toast.error('No se pudieron cargar los planes disponibles');
      }
    };
    fetchPlanes();
  }, []);

  const handleChange = (eOrVal) => {
    const { name, value, type, checked } = eOrVal.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const isoFecha = formData.fechaCumple
        ? new Date(formData.fechaCumple).toISOString()
        : '';

      const selectedPlan = planOptions.find(p => p.label === formData.plan);

      const payload = new FormData();
      payload.append('email', formData.email);
      payload.append('password', formData.password);
      payload.append('nombre', formData.nombre);
      payload.append('apellido', formData.apellido);
      payload.append('direc', formData.direc);
      payload.append('tel', formData.tel);
      payload.append('tipo', formData.tipo.toLowerCase());
      payload.append('fechaCumple', isoFecha);
      payload.append('ID_Plan', selectedPlan.value);

      if (formData.tipo === 'Entrenador' && formData.profesion) {
        payload.append('profesion', formData.profesion);
      }

      if (avatarFile) {
        payload.append('avatar', avatarFile);
      }

      await apiClient.post('/usuarios', payload)

      toast.success('Usuario añadido correctamente');
      setFormData(initialFormData);
      setAvatarFile(null);
      navigate("/admin/usuarios")
      setIsLoading(false);
    } catch (error) {
      const msg = error.response?.data?.message || 'No se pudo registrar el usuario';
      toast.error(msg);
      setIsLoading(false);
    }
  };

  const tipos = ['Cliente', 'Entrenador', 'Admin'];

  return (
    <div className="page-layout">
      {isLoading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={true} />
      <div className="content-layout">
        <h2>Crear usuario</h2>
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

          <label htmlFor="password">Contraseña:</label>
          <CustomInput
  type="password"
  id="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  required
  placeholder="Ingresa tu contraseña"
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
            onChange={(val) =>
              setFormData(f => ({
                ...f,
                tipo: typeof val === 'string' ? val : val.target.value,
              }))
            }
            name="tipo"
            id="tipo"
          />

          {formData.tipo === 'Cliente' && (
            <>
              <label htmlFor="plan">Plan:</label>
              <CustomDropdown
                options={planOptions.map(p => p.label)}
                value={formData.plan}
                onChange={e =>
                  setFormData(f => ({
                    ...f,
                    plan: e.target.value
                  }))
                }
                name="plan"
                id="plan"
              />
            </>
          )}

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

          <PrimaryButton text="Crear usuario" type="submit" onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default CrearUsuario;