import React, { useState, useEffect, useMemo } from 'react';
import '../../../App.css';
import './alumnoInicio.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { ReactComponent as AddIconCircle } from '../../../assets/icons/add-circle.svg';
import { ReactComponent as ArrowRightIcon } from '../../../assets/icons/arrow-right.svg';
import { ReactComponent as CloseIcon } from '../../../assets/icons/close.svg';
import TurnosCard from '../../../Components/TurnosCard/TurnosCard';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import apiService from '../../../services/apiService';
import ClasesActividadesCard from '../ClasesActividadesCard/ClasesActividadesCard';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp';
import { toast } from 'react-toastify';

const AlumnoInicio = () => {
  const [clases, setClases] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [turnoToCancel, setTurnoToCancel] = useState(null);

  // 👇 Estado para recordatorios de cuotas
  const [cuotaReminder, setCuotaReminder] = useState(null); // { message, remindersCount, reminders: [...] }
  const [showReminder, setShowReminder] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const usuarioId = localStorage.getItem('usuarioId');

        const [clasesData, turnosData, usuarioData] = await Promise.all([
          apiService.getClases(),
          apiService.getTurnosUsuario(usuarioId),
          apiService.getUserById(usuarioId),
        ]);

        setClases(clasesData || []);
        setTurnos(turnosData || []);
        setNombreUsuario(`${usuarioData?.nombre || ''} ${usuarioData?.apellido || ''}`.trim());
        setError('');

        // Traemos recordatorios de cuotas (si falla, no rompemos la home)
        try {
          const reminderResp = await apiService.getCuotasReminder(usuarioId);
          setCuotaReminder(reminderResp);
          setShowReminder(true);
        } catch (remErr) {
          // Puede no haber recordatorios o devolver 404/204; lo ignoramos
          setCuotaReminder(null);
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar los datos. Intente nuevamente.');
        toast.error('Error al cargar los datos. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleOpenCancelPopup = (id) => {
    setTurnoToCancel(id);
    setIsPopupOpen(true);
  };

  const handleConfirmCancellation = async () => {
    setIsPopupOpen(false);
    setLoading(true);
    try {
      await apiService.deleteTurno(turnoToCancel);
      setTurnos((prev) => prev.filter((t) => t.id_turno !== turnoToCancel));
      toast.success('Turno cancelado exitosamente.');
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al cancelar el turno. Por favor, inténtalo nuevamente.');
      toast.error('Error al cancelar el turno. Por favor, inténtalo nuevamente.');
    } finally {
      setLoading(false);
      setTurnoToCancel(null);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setTurnoToCancel(null);
  };

  const latestTurnos = useMemo(() => {
    return [...turnos]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 3);
  }, [turnos]);

  // Helpers de formato
  const formatCurrency = (n) => {
    if (typeof n !== 'number') return n;
    try {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);
    } catch {
      return `$${n}`;
    }
  };

  const formatISO = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatMesYYYYMM = (yyyyMm) => {
    if (!yyyyMm || !/^\d{4}-\d{2}$/.test(yyyyMm)) return yyyyMm || '—';
    const [y, m] = yyyyMm.split('-');
    return `${m}/${y}`; // MM/YYYY
  };

  return (
    <div className="page-layout">
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={false} />

      <div className="content-layout">
        <div className="inicio-bienvenida-ctn">
          <h2> ¡Hola, {nombreUsuario || 'alumno'}! </h2>
        </div>

        {/* ===== Recordatorio de cuotas ===== */}
        {showReminder && cuotaReminder?.remindersCount > 0 && (
          <div className="cuota-reminder">
            <div className="cuota-reminder__header">
              <h4 className="cuota-reminder__title">Recordatorio de cuota</h4>
              <button
                className="cuota-reminder__close"
                aria-label="Cerrar recordatorio"
                onClick={() => setShowReminder(false)}
              >
                <CloseIcon width={18} height={18} />
              </button>
            </div>

            {cuotaReminder?.message && (
              <p className="cuota-reminder__message">{cuotaReminder.message}</p>
            )}

            <ul className="cuota-reminder__list">
              {(cuotaReminder.reminders || []).map((r) => (
                <li key={r.ID_Cuota} className="cuota-reminder__item">
                  <div className="cuota-reminder__item-row">
                    <span><strong>Mes:</strong> {formatMesYYYYMM(r.mes)}</span>
                    <span><strong>Importe:</strong> {formatCurrency(r.importe)}</span>
                  </div>
                  <div className="cuota-reminder__item-row">
                    <span>
                      <strong>Vence:</strong> {formatISO(r.vence)}
                      {typeof r.daysLeft === 'number' && (
                        <> ({r.daysLeft} día{r.daysLeft === 1 ? '' : 's'} restante{r.daysLeft === 1 ? '' : 's'})</>
                      )}
                    </span>
                    <span>
                      <strong>Estado:</strong> {r.pagada ? 'Pagada' : 'Pendiente'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cuota-reminder__actions">
              <PrimaryButton text="Ver más detalles" onClick={() => { /* TODO: navegación a detalle de cuotas */ }} />
            </div>
          </div>
        )}

        {/* ===== Últimos turnos ===== */}
        <div className="turnos-ctn">
          <div className="turnos-ctn-title">
            <h3> Últimos turnos </h3>
            <SecondaryButton linkTo="/alumno/turnos" text="Ver historial" icon={ArrowRightIcon} />
          </div>

          <div className="turnos-ctn-turnos">
            {error ? (
              <p className="error-message">{error}</p>
            ) : latestTurnos.length > 0 ? (
              latestTurnos.map((turno, index) => (
                <TurnosCard
                  key={`${turno.id_turno}_${index}`}
                  id={turno.id_turno}
                  nombreTurno={turno?.HorarioClase?.Clase?.nombre || 'Clase'}
                  fechaTurno={turno.fecha}
                  horaTurno={turno.hora}
                  onCancelTurno={() => handleOpenCancelPopup(turno.id_turno)}
                />
              ))
            ) : (
              <p>No tienes ningún turno</p>
            )}
          </div>

          <div className="turnos-ctn-btn-agendar-nuevo">
            <PrimaryButton linkTo="/alumno/agendar-turno" text="Agendar nuevo" icon={AddIconCircle} />
          </div>
        </div>

        {/* ===== Clases y actividades ===== */}
        <div className="inicio-clases-act-ctn">
          <div className="inicio-clases-act-title">
            <h3> Clases y actividades </h3>
            <SecondaryButton linkTo="/alumno/clases-actividades" text="Ver todas" icon={ArrowRightIcon} />
          </div>

          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="clases-list">
              {clases.length > 0 ? (
                clases.slice(0, 3).map((clase, index) => (
                  <ClasesActividadesCard key={`${clase.ID_Clase}_${index}`} clase={clase} />
                ))
              ) : (
                <p>No hay clases disponibles.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmationPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onConfirm={handleConfirmCancellation}
        message="¿Estás seguro de que deseas cancelar este turno?"
      />
    </div>
  );
};

export default AlumnoInicio;