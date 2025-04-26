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

const CuotasUsuarios = () => {
  const [cuotas, setCuotas]         = useState([]);
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [showModal, setShowModal]   = useState(false);

  // Popups de confirmación
  const [popupOpen, setPopupOpen]     = useState(false);
  const [actionType, setActionType]   = useState(''); // 'pay' | 'delete'
  const [selectedCuota, setSelectedCuota] = useState(null);

  // Form state
  const [selectedEmail, setSelectedEmail] = useState('');
  const [mes, setMes]                     = useState('');
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
      setCuotas(cuotasRes.data);
      setUsers(usersRes.data);
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

  // Formateos
  const formatMonth = m =>
    new Date(m + '-01').toLocaleString('es-AR', { month: 'long', year: 'numeric' });
  const formatDate = iso =>
    iso ? new Date(iso).toLocaleDateString('es-AR') : '–';
  const formatCurrency = val =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  // Apertura del popup
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

  // Confirmación de la acción
  const handleConfirm = async () => {
    if (!selectedCuota) return;
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
    }
  };

  // Envío del formulario de nueva cuota
  const handleSubmit = async e => {
    e.preventDefault();
    const user = users.find(u => u.email === selectedEmail);
    if (!user) return alert('Seleccioná un usuario válido.');

    const vence = `${mes}-10T23:59:59.000Z`;
    const payload = { mes, importe: Number(importe), vence, plan, formaPago };

    try {
      await apiClient.post(`/cuotas/usuario/${user.ID_Usuario}`, payload);
      setShowModal(false);
      setSelectedEmail(''); setMes(''); setImporte(''); setPlan(''); setFormaPago('');
      fetchData();
    } catch (err) {
      console.error('Error al crear cuota:', err);
      alert('No se pudo crear la cuota.');
    }
  };

  return (
    <div className="page-layout">
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
                {/* <th>ID</th> */}
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
                  {/* <td>{c.ID_Cuota}</td> */}
                  <td>{c.User?.email || '–'}</td>
                  <td>{c.mes}</td>
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
              <label>Usuario</label>
              <CustomDropdown
                options={users.map(u => u.email)}
                value={selectedEmail}
                onChange={e => setSelectedEmail(e.target.value)}
                placeholderOption="Seleccioná un usuario"
                required
              />

              <label>Mes</label>
              <CustomInput
                type="month"
                value={mes}
                onChange={e => setMes(e.target.value)}
                required
              />

              <label>Importe</label>
              <CustomInput
                type="number"
                placeholder="50000"
                value={importe}
                onChange={e => setImporte(e.target.value)}
                required
              />

              <label>Plan</label>
              <CustomInput
                placeholder="Plan Básico"
                value={plan}
                onChange={e => setPlan(e.target.value)}
                required
              />

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