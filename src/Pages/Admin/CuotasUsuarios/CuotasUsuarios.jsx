// src/pages/CuotasUsuarios/CuotasUsuarios.jsx
import React, { useEffect, useState } from 'react';
import '../../../App.css';
import './CuotasUsuarios.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import CustomInput from '../../../Components/utils/CustomInput/CustomInput';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp';
import apiClient from '../../../axiosConfig';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp } from 'react-icons/fa';
import apiService from '../../../services/apiService';

const CuotasUsuarios = () => {
  // — Estados de datos y carga —
  const [cuotas, setCuotas] = useState([]);
  const [users, setUsers] = useState([]); // Para crear nuevas cuotas
  const [planOptions, setPlanOptions] = useState([]); // Opciones dinámicas de planes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // — Estados de popup de crear/eliminar/pagar cuota —
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [actionType, setActionType] = useState(''); // 'pay' | 'delete'
  const [selectedCuota, setSelectedCuota] = useState(null);

  // — Estados del formulario “Nueva cuota” —
  const [selectedEmail, setSelectedEmail] = useState('');
  const [mesDate, setMesDate] = useState(null);
  const [importe, setImporte] = useState('');

  // — Estados para carga masiva —
  const [bulkMesDate, setBulkMesDate] = useState(null);
  const [bulkVenceDate, setBulkVenceDate] = useState(null);

  // — Estados para inputs de filtros (se aplican solo al clicar “Aplicar filtros”) —
  const [inputEmail, setInputEmail] = useState('');
  const [inputEstado, setInputEstado] = useState(''); // '' | 'true' | 'false'
  const [inputMesDate, setInputMesDate] = useState(null);
  const [inputPlan, setInputPlan] = useState('');

  // — Estados para filtros “aplicados” y paginación —
  const [filterEmail, setFilterEmail] = useState('');
  const [filterEstado, setFilterEstado] = useState(''); // '' | 'true' | 'false'
  const [filterMesDate, setFilterMesDate] = useState(null);
  const [filterPlan, setFilterPlan] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Pagar
  const [formaPago, setFormaPago] = useState('Efectivo');

  // Definí solo las etiquetas que querés mostrar
  const opcionesFiltroEstado = ['Todos —', 'Pendiente', 'Pagada', 'Vencida'];

  // Funciones de mapeo
  const labelToEstado = label => {
    if (label === 'Pagada')  return 'true';
    if (label === 'Pendiente') return 'false';
    if (label === 'Vencida')  return 'vencida';
    return '';
  };
  const estadoToLabel = estado => {
    if (estado === 'true')    return 'Pagada';
    if (estado === 'false')   return 'Pendiente';
    if (estado === 'vencida') return 'Vencida';
    return 'Todos —';
  };

  // — Datos por defecto —
  const defaultAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s";

  // — Construir string "YYYY-MM" a partir de un Date —
  const buildMesString = (dateObj) => {
    if (!dateObj) return '';
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    return `${year}-${month < 10 ? '0' + month : month}`;
  };

  // — Fetch inicial de usuarios (para creación de nuevas cuotas) —
  const fetchUsuarios = async () => {
    try {
      const usersRes = await apiClient.get('/usuarios');
      setUsers(usersRes.data.data || []);
    } catch (err) {
      console.error('Error obteniendo usuarios:', err);
    }
  };

  // — Fetch de planes (para filtro dinámico) —
  const fetchPlanes = async () => {
    try {
      const planesRes = await apiService.getPlanes();
      setPlanOptions(planesRes || []);
    } catch (err) {
      console.error('Error obteniendo planes:', err);
    }
  };

  // — Fetch de cuotas según filtros “aplicados” y página —
  const fetchCuotas = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterEmail) params.email = filterEmail;
      // Revisar esto - filtros en la API
      if (filterEstado) params.estado = filterEstado;
      if (filterPlan) params.plan = filterPlan;
      if (filterMesDate) params.mes = buildMesString(filterMesDate);
      params.page = page;

      const response = await apiClient.get('/cuotas', { params });
      const lista = response.data.data || [];

      lista.sort((a, b) =>
        new Date(b.mes + '-01') - new Date(a.mes + '-01')
      );

      setCuotas(lista);
      setHasMore(lista.length > 0);
      setError(null);
    } catch (err) {
      console.error('Error al obtener cuotas:', err);
      setError(err);
      setCuotas([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // — useEffect para cargar datos al montar —
  useEffect(() => {
    fetchUsuarios();
    fetchPlanes();
  }, []);

  // — useEffect para recargar cuotas cuando cambian filtros “aplicados” o página —
  useEffect(() => {
    fetchCuotas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterEmail, filterEstado, filterMesDate, filterPlan]);

  // — Abrir/cerrar popup de confirmación —
  const openConfirmation = (type, cuota) => {
    setActionType(type);
    setSelectedCuota(cuota);
    if (type === 'pay') setFormaPago('Efectivo');
    setPopupOpen(true);
  };

  const closeConfirmation = () => {
    setPopupOpen(false);
    setActionType('');
    setSelectedCuota(null);
  };

  // — Confirmar acción “Pagar” o “Eliminar” —
  const handleConfirm = async () => {
    if (!selectedCuota) return;
    setLoading(true);
    try {
      if (actionType === 'pay') {
        await apiClient.put(
          `/cuotas/${selectedCuota.ID_Cuota}/pay`,
          { formaPago }
        );
      } else if (actionType === 'delete') {
        await apiClient.delete(`/cuotas/${selectedCuota.ID_Cuota}`);
      }
      closeConfirmation();
      fetchCuotas();
    } finally {
      setLoading(false);
    }
  };

  // — Envío del formulario “Nueva cuota” —
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);
    setLoading(true);

    const user = users.find(u => u.email === selectedEmail);
    if (!user) {
      alert('Seleccioná un usuario válido.');
      setLoading(false);
      return;
    }
    if (!mesDate) {
      alert('Seleccioná un mes válido.');
      setLoading(false);
      return;
    }

    const mesString = buildMesString(mesDate);
    const vence = `${mesString}-10T23:59:59.000Z`;

    const payload = {
      mes: mesString,
      importe: Number(importe),
      vence,
    };

    try {
      await apiClient.post(`/cuotas/usuario/${user.ID_Usuario}`, payload);
      setSelectedEmail('');
      setMesDate(null);
      setImporte('');
      // Reiniciar a página 1 y recargar cuotas con filtros actuales
      setPage(1);
    } catch (err) {
      console.error('Error al crear cuota:', err);
      alert('No se pudo crear la cuota.');
    } finally {
      setLoading(false);
    }
  };

  // Envio del formulario de Cuotas masivas
  const handleBulkGenerate = async () => {
    if (!bulkMesDate) { alert('Selecciona un mes válido.'); return; }
    if (!bulkVenceDate) { alert('Selecciona fecha de vencimiento.'); return; }
    setLoading(true);
    const mesString = buildMesString(bulkMesDate);
    const venceDate = new Date(bulkVenceDate);
    venceDate.setHours(23, 59, 59, 0);
    const payload = { mes: mesString, vence: venceDate.toISOString() };
    try {
      await apiService.postCuotasMasivas(payload);
      setShowBulkModal(false);
      setPage(1);
      fetchCuotas();
    } catch (err) {
      console.error('Error al generar cuotas masivas:', err);
      alert('No se pudieron generar las cuotas masivas.');
    } finally {
      setLoading(false);
    }
  };

  // — Función que aplica filtros cuando el usuario clickea “Aplicar filtros” —
  const applyFilters = () => {
    setPage(1);
    setFilterEmail(inputEmail.trim());
    setFilterEstado(inputEstado);
    setFilterPlan(inputPlan);
    setFilterMesDate(inputMesDate);
  };

  // — Limpiar tanto inputs como filtros aplicados —
  const clearFilters = () => {
    setInputEmail('');
    setInputEstado('');
    setInputPlan('');
    setInputMesDate(null);

    setPage(1);
    setFilterEmail('');
    setFilterEstado('');
    setFilterPlan('');
    setFilterMesDate(null);
  };

  // — Paginación —
  const goPrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };
  const goNextPage = () => {
    if (hasMore) setPage(prev => prev + 1);
  };

  // — Formateos para la tabla —
  const formatMonth = (m) => {
    if (!m) return '–';
    const [year, month] = m.split('-').map(Number);
    return new Date(year, month - 1, 1)
      .toLocaleString('es-AR', { month: 'long', year: 'numeric' });
  };

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('es-AR') : '–';
  const formatCurrency = (val) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  // — Clase para ReactDatePicker (dark-mode) —
  const datePickerClass = 'custom-datepicker custom-datepicker-mes';

  return (
    <div className="page-layout">
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={true} />

      <div className="content-layout">
        {/* Encabezado con botón nueva cuota */}
        <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Cuotas de Usuarios</h2>
          <div className='generate-cuotas-btns'>
            <PrimaryButton text="Generar cuotas de este mes" onClick={() => setShowBulkModal(true)} />
            <SecondaryButton text="Nueva cuota" onClick={() => setShowModal(true)} />
          </div>
        </div>

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
          <div className="filtros-section" style={{ margin: '20px 0', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="inputEmail">Email:</label>
              <CustomInput
                id="inputEmail"
                type="text"
                placeholder="Ej: valen2@example.com"
                value={inputEmail}
                onChange={e => setInputEmail(e.target.value)}
                width='300px'
              />
            </div>

            {/* Estado */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="inputEstado">Estado:</label>
              <CustomDropdown
                id="inputEstado"
                options={opcionesFiltroEstado}
                value={estadoToLabel(inputEstado)}
                onChange={e => {
                  setInputEstado(labelToEstado(e.target.value));
                }}
              />
            </div>

            {/* Mes */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label>Mes:</label>
              <ReactDatePicker
                selected={inputMesDate}
                onChange={date => setInputMesDate(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="MM/AAAA"
                className={datePickerClass}
              />
            </div>

            {/* Plan dinámico */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="inputPlan">Plan:</label>
              <CustomDropdown
                id="inputPlan"
                options={planOptions.map(p => p.nombre)}
                placeholderOption="— Todos —"
                value={inputPlan}
                onChange={e => setInputPlan(e.target.value)}
              />
            </div>

            {/* Botones de “Aplicar filtros” y “Limpiar filtros” */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <PrimaryButton onClick={applyFilters} text="Aplicar filtros" />
              <SecondaryButton onClick={clearFilters} text="Limpiar filtros" />
            </div>
          </div>
        }

        {/* — Tabla de cuotas — */}
        {loading ? (
          <p>Cargando cuotas...</p>
        ) : error ? (
          <p className="text-error">Error cargando datos.</p>
        ) : cuotas.length === 0 ? (
          <p>No hay cuotas para mostrar.</p>
        ) : (
          <table className="cuotas-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Mes</th>
                <th>Importe</th>
                <th>Vence</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Forma de Pago</th>
                <th>Fecha Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map(c => (
                <tr key={c.ID_Cuota}>
                  <td>
                    {c.User
                      ? `${c.User.nombre} ${c.User.apellido}`
                      : '–'}
                  </td>
                  <td className='cuotas-usuario-mes-col'>{formatMonth(c.mes)}</td>
                  <td>{formatCurrency(c.importe)}</td>
                  <td>{formatDate(c.vence)}</td>
                  <td>{c.User.plan.nombre}</td>
                  <td>
                    <span
                      className={`badge ${c.vencida ? 'expired' : c.pagada ? 'paid' : 'pending'
                        }`}
                    >
                      {c.vencida
                        ? 'Vencida'
                        : c.pagada
                          ? 'Pagada'
                          : 'Pendiente'}
                    </span>
                  </td>
                  <td>{c.formaPago ? c.formaPago : '-'}</td>
                  <td>{formatDate(c.fechaPago)}</td>
                  <td className="acciones-cell">
                    <button
                      className="accion-button"
                      onClick={() => openConfirmation('pay', c)}
                      disabled={c.pagada}
                    >
                      Pagar
                    </button>
                    <button
                      className="accion-button delete"
                      onClick={() => openConfirmation('delete', c)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* — Controles de paginación — */}
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
      </div>

      {/* — Modal para crear nueva cuota — */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Nueva cuota</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              {/* Usuario (dropdown que muestra “Nombre Apellido (email)”) */}
              <label>Usuario</label>
              <CustomDropdown
                options={users.filter(u => u.estado === true ).map(u => `${u.nombre} ${u.apellido} (${u.email})`)}
                value={
                  selectedEmail
                    ? `${users.find(u => u.email === selectedEmail)?.nombre || ''} ${users.find(u => u.email === selectedEmail)?.apellido || ''} (${selectedEmail})`
                    : ''
                }
                placeholderOption="Seleccioná un usuario"
                onChange={e => {
                  const txt = e.target.value;
                  const match = txt.match(/\(([^)]+)\)$/);
                  if (match) setSelectedEmail(match[1]);
                  else setSelectedEmail('');
                }}
                required
              />

              {/* Mes (picker mes/año) */}
              <label>Mes</label>
              <ReactDatePicker
                selected={mesDate}
                onChange={date => setMesDate(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="Seleccioná mes y año"
                className={datePickerClass}
                required
              />

              {/* Importe */}
              <label>Importe</label>
              <CustomInput
                type="number"
                placeholder="50000"
                value={importe}
                onChange={e => setImporte(e.target.value)}
                required
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-secondary-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="modal-primary-button">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Generar cuotas masivas</h3>
            <div className="modal-form">
              <label>Mes</label>
              <ReactDatePicker
                selected={bulkMesDate}
                onChange={date => setBulkMesDate(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="MM/AAAA"
                className={datePickerClass}
              />
              <label>Vence</label>
              <ReactDatePicker
                selected={bulkVenceDate}
                onChange={date => setBulkVenceDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccione fecha de vencimiento"
                className={datePickerClass}
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-secondary-button"
                  onClick={() => setShowBulkModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="modal-primary-button"
                  onClick={handleBulkGenerate}
                >
                  Generar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* — Popup de confirmación para pagar/eliminar — */}
      <ConfirmationPopup
        isOpen={popupOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirm}
        message={
          actionType === 'pay'
            ? `¿Confirmar pago de la cuota ${selectedCuota?.ID_Cuota}?`
            : `¿Eliminar la cuota ${selectedCuota?.ID_Cuota}?`
        }
      >
        {actionType === 'pay' && (
          <div className='form-input-ctn' style={{ margin: '1rem 0' }}>
            <label htmlFor="formaPago">Forma de pago</label>
            <CustomDropdown
              id="formaPago"
              value={formaPago}
              onChange={e => setFormaPago(e.target.value)}
              options={["Efectivo", "Tarjeta de crédito", "Tarjeta de débito"]}
            />
          </div>
        )}
      </ConfirmationPopup>
    </div>
  );
};

export default CuotasUsuarios;