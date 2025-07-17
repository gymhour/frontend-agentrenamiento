import React, { useEffect, useState } from 'react';
import '../../../App.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import apiClient from '../../../axiosConfig';
import './usuariosList.css';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import { toast } from "react-toastify";
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import { FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const UsuariosList = ({ fromAdmin, fromEntrenador }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [filtros, setFiltros] = useState({ tipo: '', nombre: '', apellido: '', email: '' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const defaultAvatar = "https://..."; // tu URL
  const opcionesTipo = fromAdmin ? ['Cliente', 'Entrenador', 'Admin'] : ['Cliente'];
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      // Armamos sólo los parámetros que tienen valor
      const params = {};
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.nombre) params.nombre = filtros.nombre;
      if (filtros.apellido) params.apellido = filtros.apellido;
      if (filtros.email) params.email = filtros.email;
      params.page = page;

      const response = await apiClient.get('/usuarios', { params });
      const lista = response.data.data || [];
      const listaUsuariosClientes = lista.filter(u => u.tipo === "cliente")

      setUsuarios(fromAdmin ? lista : listaUsuariosClientes);
      const pageSize = lista.length;
      setHasMore(pageSize > 0);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, [page]);

  const handleChangeFiltro = e =>
    setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const aplicarFiltros = e => { e.preventDefault(); setPage(1); fetchUsuarios(); };

  // 2) Actualizar estado localmente y en backend
  const updateUsuarioEstado = async (id, nuevoEstado) => {
    setLoading(true);
    try {
      // llamada al endpoint
      await apiClient.put(`/usuarios/estado/${id}`, { estado: nuevoEstado });

      // actualizamos el array sin recargar toda la página
      setUsuarios(prev =>
        prev.map(u =>
          u.ID_Usuario === id
            ? { ...u, estado: nuevoEstado }
            : u
        )
      );

      toast.success(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
    } catch {
      toast.error('Error al actualizar estado');
    } finally {
      setLoading(false);
    }
  };

  // 3) Abrir / cerrar popup
  const openEstadoPopup = id => {
    setSelectedUserId(id);
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedUserId(null);
  };

  // 4) Confirmación del popup nos da booleano
  const handlePopupConfirm = estadoBool => {
    if (selectedUserId !== null) {
      updateUsuarioEstado(selectedUserId, estadoBool);
    }
    closePopup();
  };

  // Paginación
  const goPrevPage = () => page > 1 && setPage(p => p - 1);
  const goNextPage = () => hasMore && setPage(p => p + 1);

  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={fromAdmin} isEntrenador={fromEntrenador} />

      <div className='content-layout'>
        <h2>Lista de usuarios</h2>

        <div style={{ margin: '30px 0px' }}>
          <button
            className='toggle-filters-button'
            onClick={() => setShowFilters(prev => !prev)}
          >
            Filtros {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        {
          showFilters &&
          <form className="filtros-form" onSubmit={aplicarFiltros} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Select de tipo */}
            <div className='usuarios-filtros-form-inputs-ctn'>
              <label htmlFor="tipo">Tipo:</label>
              <CustomDropdown
                id="tipo"
                name="tipo"
                value={filtros.tipo}
                onChange={handleChangeFiltro}
                options={opcionesTipo}
                placeholderOption="— Todos —"
              />
            </div>
            {/* Input nombre */}
            <div className='usuarios-filtros-form-inputs-ctn'>
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={filtros.nombre}
                onChange={handleChangeFiltro}
                placeholder="Ej: Luis"
              />
            </div>

            {/* Input apellido */}
            <div className='usuarios-filtros-form-inputs-ctn'>
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={filtros.apellido}
                onChange={handleChangeFiltro}
                placeholder="Ej: Carvi"
              />
            </div>

            {/* Input email */}
            <div className='usuarios-filtros-form-inputs-ctn'>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                value={filtros.email}
                onChange={handleChangeFiltro}
                placeholder="Ej: vdev@gmail.com"
              />
            </div>

            {/* Botón para aplicar filtros */}
            <div style={{ alignSelf: 'flex-end' }}>
              <PrimaryButton onClick={fetchUsuarios} text="Aplicar filtros" />
            </div>
          </form>
        }


        {usuarios.length === 0 ? (
          <p>No hay usuarios para mostrar.</p>
        ) : (
          <table className='usuarios-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Plan</th>
                <th>Registro</th>
                <th>Estado</th>
                {fromAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.ID_Usuario}>
                  <td>{u.ID_Usuario}</td>
                  <td style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div
                      className="usuarios-table-userimage"
                      style={{
                        backgroundImage: `url(${u.avatarUrl || defaultAvatar})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                    {u.email}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{u.tipo}</td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {u.plan?.nombre || '—'}
                  </td>
                  <td>{new Date(u.fechaRegistro).toLocaleDateString()}</td>
                  <td>{u.estado ? 'Activo' : 'Inactivo'}</td>
                  {fromAdmin && (
                    <td style={{ display: 'flex', gap: '10px' }}>
                      <PrimaryButton
                        text="Editar"
                        linkTo={`/admin/editar-usuario/${u.ID_Usuario}`}
                      />
                      {u.tipo !== 'admin' && (
                        <SecondaryButton
                          text="Cambiar estado"
                          onClick={() => openEstadoPopup(u.ID_Usuario)}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Paginación */}
        <div className="paginacion-controls" style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={goPrevPage}
            disabled={page === 1}
            className="btn-page"
          >
            <FaChevronLeft />
          </button>
          <span>Página {page}</span>
          <button
            onClick={goNextPage}
            disabled={!hasMore}
            className="btn-page"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Popup sólo para admins */}
        {fromAdmin && (
          <ConfirmationPopup
            isOpen={isPopupOpen}
            onClose={closePopup}
            onConfirm={handlePopupConfirm}
            message="¿Qué acción deseas realizar?"
            options={["Activar", "Desactivar"]}
            placeholderOption="Elige estado"
          />
        )}
      </div>
    </div>
  );
};

export default UsuariosList;