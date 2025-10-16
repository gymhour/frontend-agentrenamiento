import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import apiService from '../../../services/apiService';
import { toast } from 'react-toastify';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-left.svg';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';

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
    plan: '',
    estado: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [avatarFile, setAvatarFile] = useState(null);
  const [planOptions, setPlanOptions] = useState([]);

  const tipos = ['Cliente', 'Entrenador', 'Admin'];
  const opcionesEstado = ['Si', 'No'];
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      try {
        const user = await apiService.getUserById(id);
  
        const fechaISO = user?.fechaCumple
          ? new Date(user.fechaCumple).toISOString().slice(0, 10)
          : '';
  
        const tipoLower = (user?.tipo || '').toLowerCase();
        const tipoCapitalizado =
          tipoLower ? tipoLower.charAt(0).toUpperCase() + tipoLower.slice(1) : 'Cliente';
  
        // Nombre de plan si existe (API puede devolver { plan: { nombre, ID_Plan } } o solo ID)
        const planNombre =
          user?.plan?.nombre
            || user?.plan?.label
            || ''; // si no hay plan, queda vacío y no rompe
  
        setFormData({
          email:       user?.email    || '',
          nombre:      user?.nombre   || '',
          apellido:    user?.apellido || '',
          profesion:   user?.profesion|| '',
          direc:       user?.direc    || '',
          tel:         user?.tel      || '',
          tipo:        tipoCapitalizado,
          fechaCumple: fechaISO,
          estado:      !!user?.estado,
          // Solo precargar plan para clientes; en admin/entrenador lo dejamos vacío
          plan:        tipoLower === 'cliente' ? planNombre : ''
        });
  
      } catch (err) {
        console.error(err);
        toast.error('No se pudo cargar los datos del usuario');
      } finally {
        setIsLoading(false);
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
    setIsLoading(true)
    try {
      const isoFecha = formData.fechaCumple
        ? new Date(formData.fechaCumple).toISOString()
        : '';

      const selectedPlan = planOptions.find(p => p.label === formData.plan);
      
      const payload = new FormData();
      payload.append('email', formData.email);
      payload.append('nombre', formData.nombre);
      payload.append('apellido', formData.apellido);
      payload.append('direc', formData.direc);
      payload.append('tel', formData.tel);
      payload.append('tipo', formData.tipo.toLowerCase());
      payload.append('fechaCumple', isoFecha);

      if (formData.tipo === 'Cliente' && selectedPlan) {
        payload.append('ID_Plan', selectedPlan.value);
      }

      if (formData.tipo === 'Entrenador' && formData.profesion) {
        payload.append('profesion', formData.profesion);
      }

      if (avatarFile) {
        payload.append('avatar', avatarFile);
      }

      await apiService.updateUserById(id, payload);
      setIsLoading(false)
      toast.success('Usuario actualizado correctamente');
      navigate("/admin/usuarios");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error al actualizar usuario';
      setIsLoading(false)
      toast.error(msg);
    }
  };

  return (
    <>
      {/* Estilos para dos columnas en escritorio y una columna en mobile */}
      <style>{`
        .form-two {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          width: 100%;
          max-width: 640px;
          padding-top: 30px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: calc(50% - 8px);
        }
        .form-field.full-width {
          width: 100%;
        }
        @media (max-width: 768px) {
          .form-field {
            width: 100%;
          }
        }
        .button-container {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 16px;
        }
      `}</style>

      <div className="page-layout">
        { isLoading && <LoaderFullScreen/> }
        <SidebarMenu isAdmin={true} />
        <div className="content-layout">
          <SecondaryButton
            text="Volver atrás"
            linkTo="/admin/usuarios"
            icon={ArrowLeftIcon}
            reversed={true}
          />
          <h2>Editar usuario</h2>
          <form
            onSubmit={handleSubmit}
            className="form-two"
          >
            <div className="form-field">
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
            </div>

            <div className="form-field">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa el nombre"
              />
            </div>

            <div className="form-field">
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ingresa el apellido"
              />
            </div>

            <div className="form-field">
              <label htmlFor="tipo">Tipo de usuario:</label>
              <CustomDropdown
                options={tipos}
                value={formData.tipo}
                onChange={handleTipoChange}
                name="tipo"
                id="tipo"
              />
            </div>

            {formData.tipo === 'Cliente' && (
            <div className="form-field">
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
            </div>
          )}

            {formData.tipo === 'Entrenador' && (
              <div className="form-field">
                <label htmlFor="profesion">Profesión:</label>
                <input
                  type="text"
                  id="profesion"
                  name="profesion"
                  value={formData.profesion}
                  onChange={handleChange}
                  placeholder="Ingresa la profesión"
                />
              </div>
            )}

            <div className="form-field">
              <label htmlFor="direc">Dirección:</label>
              <input
                type="text"
                id="direc"
                name="direc"
                value={formData.direc}
                onChange={handleChange}
                placeholder="Ingresa la dirección"
              />
            </div>

            <div className="form-field">
              <label htmlFor="tel">Teléfono:</label>
              <input
                type="tel"
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder="Ingresa el teléfono"
              />
            </div>

            {/* <div className="form-field">
              <label htmlFor="estado">Activo:</label>
              <CustomDropdown
                options={opcionesEstado}
                value={formData.estado ? 'Si' : 'No'}
                onChange={handleEstadoChange}
                name="estado"
                id="estado"
              />
            </div> */}

            <div className="form-field">
              <label htmlFor="fechaCumple">Fecha de Nacimiento:</label>
              <input
                type="date"
                id="fechaCumple"
                name="fechaCumple"
                value={formData.fechaCumple}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="avatar">Avatar:</label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="form-field full-width button-container">
              <PrimaryButton text="Actualizar usuario" type="submit" onClick={handleSubmit}  />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditarUsuario;
