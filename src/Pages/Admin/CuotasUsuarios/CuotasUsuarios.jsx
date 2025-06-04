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

import Select from 'react-select';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CuotasUsuarios = () => {
  // Estado general
  const [cuotas, setCuotas]             = useState([]);
  const [users, setUsers]               = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [showModal, setShowModal]       = useState(false);

  // Popup de confirmación
  const [popupOpen, setPopupOpen]       = useState(false);
  const [actionType, setActionType]     = useState(''); // 'pay' | 'delete'
  const [selectedCuota, setSelectedCuota] = useState(null);

  // Estado del formulario “Nueva cuota”
  const [selectedEmail, setSelectedEmail] = useState('');
  const [mesDate, setMesDate]             = useState(null); // almacenamos un Date (mes/año)
  const [importe, setImporte]             = useState('');
  const [plan, setPlan]                   = useState('');
  const [formaPago, setFormaPago]         = useState('');

  // Carga inicial de datos
  const fetchData = async () => {
    setLoading(true);
    try {
      const [cuotasRes, usersRes] = await Promise.all([
        apiClient.get('/cuotas'),
        apiClient.get('/usuarios')
      ]);
      setCuotas(cuotasRes.data.data);
      setUsers(usersRes.data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Formateos para la tabla
  const formatMonth = m =>
    new Date(m + '-01').toLocaleString('es-AR', { month: 'long', year: 'numeric' });
  const formatDate = iso =>
    iso ? new Date(iso).toLocaleDateString('es-AR') : '–';
  const formatCurrency = val =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  // Abrir/cerrar popup de confirmación
  const openConfirmation = (type, cuota) => {
    setActionType(type);
    setSelectedCuota(cuota);
    setPopupOpen(true);
  };
  const closeConfirmation = () => {
    setPopupOpen(false);
    setActionType('');
    setSelectedCuota(null);
  };

  // Confirmar acción “Pagar” o “Eliminar”
  const handleConfirm = async () => {
    if (!selectedCuota) return;
    setLoading(true);
    try {
      if (actionType === 'pay') {
        await apiClient.put(`/cuotas/${selectedCuota.ID_Cuota}/pay`);
      } else if (actionType === 'delete') {
        await apiClient.delete(`/cuotas/${selectedCuota.ID_Cuota}`);
      }
      closeConfirmation();
      fetchData();
    } catch (err) {
      console.error(`Error al ${actionType} la cuota:`, err);
      alert(`No se pudo ${actionType === 'pay' ? 'pagar' : 'eliminar'} la cuota.`);
    } finally {
      setLoading(false);
    }
  };

  // Envío del formulario para crear nueva cuota
  const handleSubmit = async e => {
    e.preventDefault();
    setShowModal(false);
    setLoading(true);

    // Buscamos el usuario por email
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

    // Convertimos la fecha mesDate (Date) a string "YYYY-MM"
    const year = mesDate.getFullYear();
    const monthNumber = mesDate.getMonth() + 1; // 0-based
    const mesString = `${year}-${monthNumber < 10 ? '0' + monthNumber : monthNumber}`;

    // Fecha de vencimiento interna: por ejemplo el día 10 de ese mes (a las 23:59:59 UTC)
    const vence = `${mesString}-10T23:59:59.000Z`;

    const payload = {
      mes: mesString,
      importe: Number(importe),
      vence,
      plan,
      formaPago
    };

    try {
      await apiClient.post(`/cuotas/usuario/${user.ID_Usuario}`, payload);
      // Limpiamos campos
      setSelectedEmail('');
      setMesDate(null);
      setImporte('');
      setPlan('');
      setFormaPago('');
      fetchData();
    } catch (err) {
      console.error('Error al crear cuota:', err);
      alert('No se pudo crear la cuota.');
    } finally {
      setLoading(false);
    }
  };

  // Estilos oscuros para react-select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#2c2f36',
      borderColor: state.isFocused ? '#555' : '#444',
      minHeight: '44px',
      boxShadow: 'none',
      '&:hover': { borderColor: '#666' },
    }),
    singleValue: provided => ({
      ...provided,
      color: '#fff',
    }),
    input: provided => ({
      ...provided,
      color: '#fff',
    }),
    placeholder: provided => ({
      ...provided,
      color: '#aaa',
    }),
    menu: provided => ({
      ...provided,
      backgroundColor: '#2c2f36',
      marginTop: 0,
      borderRadius: 0,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#3a3f47' : '#2c2f36',
      color: '#fff',
      cursor: 'pointer',
    }),
    dropdownIndicator: provided => ({
      ...provided,
      color: '#bbb',
      '&:hover': { color: '#ddd' },
    }),
    indicatorSeparator: provided => ({
      ...provided,
      backgroundColor: '#444',
    }),
  };

  return (
    <div className="page-layout">
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={true} />

      <div className="content-layout">
        <div className="header-actions">
          <h2>Cuotas de Usuarios</h2>
          <PrimaryButton text="Nueva cuota" onClick={() => setShowModal(true)} />
        </div>

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
                  <td>{formatMonth(c.mes)}</td>
                  <td>{formatCurrency(c.importe)}</td>
                  <td>{formatDate(c.vence)}</td>
                  <td>{c.plan}</td>
                  <td>
                    <span className={`badge ${c.pagada ? 'paid' : 'pending'}`}>
                      {c.pagada ? 'Pagada' : 'Pendiente'}
                    </span>
                  </td>
                  <td>{c.formaPago}</td>
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
      </div>

      {/* Modal para nueva cuota */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Nueva cuota</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              {/* — Usuario (react-select con búsqueda y estilo dark) — */}
              <label>Usuario</label>
              <Select
                options={users.map(u => ({
                  label: `${u.nombre} ${u.apellido} (${u.email})`,
                  value: u.email
                }))}
                value={
                  selectedEmail
                    ? { label: `${users.find(u => u.email === selectedEmail)?.nombre || ''} ${
                        users.find(u => u.email === selectedEmail)?.apellido || ''
                      } (${selectedEmail})`, value: selectedEmail }
                    : null
                }
                onChange={option => setSelectedEmail(option.value)}
                placeholder="Seleccioná un usuario"
                styles={customSelectStyles}
                isSearchable
                required
              />

              {/* — Mes (picker mes/año) — */}
              <label>Mes</label>
              <ReactDatePicker
                selected={mesDate}
                onChange={date => setMesDate(date)}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholderText="Seleccioná mes y año"
                className="custom-datepicker custom-datepicker-mes"
                required
              />

              {/* — Importe — */}
              <label>Importe</label>
              <CustomInput
                type="number"
                placeholder="50000"
                value={importe}
                onChange={e => setImporte(e.target.value)}
                required
              />

              {/* — Plan (dropdown hardcodeado) — */}
              <label>Plan</label>
              <CustomDropdown
                options={['Plan Básico', 'Plan Intermedio', 'Plan Premium']}
                value={plan}
                onChange={e => setPlan(e.target.value)}
                placeholderOption="Seleccioná un plan"
                required
              />

              {/* — Forma de pago — */}
              <label>Forma de pago</label>
              <CustomDropdown
                options={['Efectivo', 'Transferencia', 'Tarjeta']}
                value={formaPago}
                onChange={e => setFormaPago(e.target.value)}
                placeholderOption="Seleccioná forma de pago"
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

      {/* Confirmation Popup */}
      <ConfirmationPopup
        isOpen={popupOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirm}
        message={
          actionType === 'pay'
            ? `¿Confirmar pago de la cuota ${selectedCuota?.ID_Cuota}?`
            : `¿Eliminar la cuota ${selectedCuota?.ID_Cuota}?`
        }
      />
    </div>
  );
};

export default CuotasUsuarios;
