import { useEffect, useState } from 'react';
import '../../../App.css';
import React from 'react';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import apiClient from '../../../axiosConfig';
import './usuariosList.css';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp';
import { useNavigate } from 'react-router-dom';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import { toast } from "react-toastify";
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import { FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const UsuariosList = ({fromAdmin, fromEntrenador}) => {
  // Estados para datos, filtros y paginación
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo: '',
    nombre: '',
    apellido: '',
    email: ''
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // para saber si existe siguiente página
  const defaultAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s";
  const opcionesTipo = fromAdmin ? ['Cliente', 'Entrenador', 'Admin'] : ['Cliente'];
  const [showFilters, setShowFilters] = useState(false)

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

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Función que se llama al enviar el formulario de filtros
  const aplicarFiltros = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsuarios();
  };

  // Manejo de cambios en cada campo de filtro
  const handleChangeFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const deleteUsuario = async (idUsuario) => {
    setLoading(true);
    try {
      await apiClient.delete(`/usuarios/${idUsuario}`);
      // Eliminación en la UI
      setUsuarios(prevUsuarios =>
        prevUsuarios.filter(usuario => usuario.ID_Usuario !== idUsuario)
      );
      setLoading(false);
      toast.success("Usuario eliminado correctamente");
    } catch (error) {
      toast.error('Error al eliminar el usuario. Por favor, intente nuevamente.');
      setLoading(false);
    }
  };

  const handleDeleteClick = (idUsuario) => {
    setUserToDelete(idUsuario);
    setIsPopupOpen(true);
  };

  const handlePopupConfirm = () => {
    if (userToDelete !== null) {
      deleteUsuario(userToDelete);
      setUserToDelete(null);
    }
    setIsPopupOpen(false);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
    setUserToDelete(null);
  };

  // Paginación: retrocede una página (si no es la 1)
  const goPrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  // Paginación: avanza a siguiente página (si hay más)
  const goNextPage = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={fromAdmin} isEntrenador={fromEntrenador}/>
      <div className='content-layout'>
        <h2 style={{ marginBottom: '20px' }}>Lista de usuarios</h2>

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
                <PrimaryButton  onClick={fetchUsuarios} text="Aplicar filtros" />
              </div>
            </form>
        }


        {/* Tabla de usuarios o mensaje si no hay */}
        {usuarios.length === 0 ? (
          <p>No hay usuarios para mostrar.</p>
        ) : (
          <table className='usuarios-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Fecha de Registro</th>
                {fromAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.ID_Usuario}>
                  <td>{usuario.ID_Usuario}</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      className="usuarios-table-userimage"
                      style={{
                        backgroundImage: `url(${usuario.avatarUrlThumb || defaultAvatar})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    {usuario.email}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {usuario.tipo || 'N/A'}
                  </td>
                  <td>
                    {new Date(usuario.fechaRegistro).toLocaleDateString()}
                  </td>
                  {
                    fromAdmin &&
                    <td style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '20px' }}>
                      <PrimaryButton
                        text="Editar usuario"
                        linkTo={`/admin/editar-usuario/${usuario.ID_Usuario}`}
                      />
                      {usuario.tipo !== "admin" && (
                        <SecondaryButton
                          text="Eliminar usuario"
                          onClick={() => handleDeleteClick(usuario.ID_Usuario)}
                        />
                      )}
                    </td>
                  }
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
            <FaChevronLeft/>
          </button>
          <span>Página {page}</span>
          <button
            onClick={goNextPage}
            disabled={!hasMore}
            className="btn-page"
          >
            <FaChevronRight/>
          </button>
        </div>
      </div>

      {/* Popup de confirmación para eliminar */}
      <ConfirmationPopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        onConfirm={handlePopupConfirm}
        message="¿Estás seguro de que deseas eliminar este usuario?"
      />
    </div>
  );
};

export default UsuariosList;