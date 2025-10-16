import React, { useEffect, useState } from 'react';
import '../../../App.css';
import './RutinasAdmin.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu.jsx';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton.jsx';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton.jsx';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp';
import apiService from '../../../services/apiService.js';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen.jsx';
import { ReactComponent as EditIcon } from '../../../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/icons/trash.svg';
import { ReactComponent as VideoIcon } from "../../../assets/icons/video-icon.svg";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaChevronDown, FaChevronUp, FaCopy } from 'react-icons/fa';

/* ===================== Helpers ===================== */
const WEEK_ORDER = [
  'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo',
  'Miércoles', 'Sábado'
];

const isDiaN = (k) => /^dia(\d+)$/i.test(k);
const diaNIndex = (k) => {
  const m = /^dia(\d+)$/i.exec(k);
  return m ? parseInt(m[1], 10) : Infinity;
};

const smartSortDiaKeys = (diasObj) => {
  const keys = Object.keys(diasObj || {});
  if (!keys.length) return keys;

  const hasAnyDiaN = keys.some(isDiaN);
  if (hasAnyDiaN) {
    const sinDia = keys.filter(k => k === 'sin_dia');
    const diaNs = keys.filter(isDiaN).sort((a, b) => diaNIndex(a) - diaNIndex(b));
    const others = keys.filter(k => !isDiaN(k) && k !== 'sin_dia').sort((a, b) => a.localeCompare(b));
    return [...diaNs, ...others, ...sinDia];
  }

  const sinDia = keys.filter(k => k === 'sin_dia');
  const week = keys.filter(k => WEEK_ORDER.includes(k))
    .sort((a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b));
  const others = keys.filter(k => !WEEK_ORDER.includes(k) && k !== 'sin_dia').sort((a, b) => a.localeCompare(b));
  return [...week, ...others, ...sinDia];
};

const normalizeDias = (rutina) => {
  const d = rutina?.dias || {};
  const ordered = smartSortDiaKeys(d);
  return ordered.map((key, idx) => ({
    key,
    nombre: d[key]?.nombre || key || `Día ${idx + 1}`,
    descripcion: d[key]?.descripcion || '',
    bloques: Array.isArray(d[key]?.bloques) ? d[key].bloques : []
  }));
};

const getBloqueItems = (b) => Array.isArray(b?.ejercicios) ? b.ejercicios : [];

// Encabezado por tipo (en SETS_REPS no mostramos header)
const headerForBlock = (b) => {
  switch (b?.type) {
    case 'SETS_REPS': return '';
    case 'ROUNDS': return b?.cantRondas ? `${b.cantRondas} rondas de:` : 'Rondas:';
    case 'EMOM': return b?.durationMin ? `EMOM ${b.durationMin}min:` : 'EMOM:';
    case 'AMRAP': return b?.durationMin ? `AMRAP ${b.durationMin}min:` : 'AMRAP:';
    case 'TABATA': return b?.durationMin ? `TABATA ${b.durationMin}min:` : 'TABATA:';
    case 'LADDER': return b?.tipoEscalera || 'Escalera';
    default: return '';
  }
};

// texto base del item
const itemText = (it, tipo) => {
  const name = it?.ejercicio?.nombre || 'Ejercicio';
  const reps = (it?.reps ?? '').toString().trim();
  const extra = (it?.setRepWeight ?? '').toString().trim();
  const showExtra = extra && extra.toLowerCase() !== name.toLowerCase();

  if (tipo === 'LADDER') return showExtra ? `${name} — ${extra}` : name;

  const left = reps ? `${reps} ${name}` : name;
  return showExtra ? `${left} — ${extra}` : left;
};

// fallback SETS_REPS vacío
const setsRepsFallback = (b) => {
  const parts = [
    b?.setsReps ? `${b.setsReps}` : '',
    b?.nombreEj ? `${b.nombreEj}` : '',
    b?.weight ? `— ${b.weight}` : ''
  ].filter(Boolean);
  const txt = parts.join(' ').trim();
  return txt || null;
};

/* ==================================================== */

const RutinasAdmin = () => {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRutinaId, setSelectedRutinaId] = useState(null);
  const [openState, setOpenState] = useState({});
  const navigate = useNavigate();

  // === Nueva función: renderEjercicioItem ===
  const renderEjercicioItem = (it, tipo) => {
    const txt = itemText(it, tipo);
    const id = it?.ejercicio?.ID_Ejercicio || it?.ID_Ejercicio;
    const esGenerico = it?.ejercicio?.esGenerico ?? true;

    if (id && esGenerico === false) {
      return (
        <span className="ejercicio-link-wrap">
          <Link
            to={`/admin/ejercicios/${id}`}
            className="ejercicio-link"
            title="Ver detalle del ejercicio"
          >
            {txt}
          </Link>
          <VideoIcon className="video-icon" aria-hidden="true" />
        </span>
      );
    }

    return <span>{txt}</span>;
  };

  const fetchRutinas = async () => {
    const userId = localStorage.getItem('usuarioId');
    try {
      const { rutinas: lista = [] } = await apiService.getUserRutinas(userId);
      setRutinas(lista);
      const init = {};
      (lista || []).forEach(r => {
        const dias = normalizeDias(r);
        init[r.ID_Rutina] = {};
        dias.forEach((d, i) => { init[r.ID_Rutina][d.key] = (i === 0); });
      });
      setOpenState(init);
    } catch (error) {
      console.error('Error al obtener rutinas:', error);
      toast.error('No se pudieron cargar las rutinas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRutinas();
  }, []);

  const openDeletePopup = id => { setSelectedRutinaId(id); setIsPopupOpen(true); };
  const closePopup = () => { setIsPopupOpen(false); setSelectedRutinaId(null); };

  const handleConfirmDelete = async () => {
    if (!selectedRutinaId) return;
    setLoading(true);
    try {
      await apiService.deleteRutina(selectedRutinaId);
      toast.success('Rutina eliminada correctamente.');
      await fetchRutinas();
    } catch (error) {
      console.error('Error al eliminar rutina', error);
      toast.error('No se pudo eliminar la rutina.');
      setLoading(false);
    } finally {
      closePopup();
    }
  };

  const toggleDia = (rutinaId, diaKey) => {
    setOpenState(prev => ({
      ...prev,
      [rutinaId]: { ...(prev[rutinaId] || {}), [diaKey]: !prev?.[rutinaId]?.[diaKey] }
    }));
  };

  // duplicar rutina
  const buildDuplicatePayload = (rutina) => {
    const currentUserId = Number(localStorage.getItem('usuarioId')) || null;
    const alumnoId = rutina?.alumno?.ID_Usuario ?? currentUserId;
    const originalDias = rutina?.dias || {};
    const diasPayload = {};

    Object.keys(originalDias).forEach((diaKey, idx) => {
      const dia = originalDias[diaKey] || {};
      const bloques = Array.isArray(dia.bloques) ? dia.bloques : [];
      const bloquesPayload = bloques.map((b) => {
        const ejercicios = Array.isArray(b?.ejercicios) ? b.ejercicios : [];
        const bloqueEjercicios = ejercicios.map((it) => {
          const ejercicioId = it?.ejercicio?.ID_Ejercicio ?? it?.ID_Ejercicio ?? null;
          return {
            ejercicioId,
            reps: it?.reps ?? '',
            setRepWeight: (it?.setRepWeight ?? '').toString().trim() || undefined,
          };
        });
        return {
          type: b?.type || 'SETS_REPS',
          setsReps: b?.setsReps ?? null,
          nombreEj: b?.nombreEj ?? null,
          weight: b?.weight ?? null,
          descansoRonda: b?.descansoRonda ?? null,
          cantRondas: b?.cantRondas ?? null,
          durationMin: b?.durationMin ?? null,
          tipoEscalera: b?.tipoEscalera ?? null,
          bloqueEjercicios,
        };
      });

      diasPayload[diaKey] = {
        nombre: dia?.nombre || `Día ${idx + 1}`,
        descripcion: dia?.descripcion || '',
        bloques: bloquesPayload,
      };
    });

    return {
      ID_Usuario: alumnoId,
      ID_Entrenador: null,
      nombre: `${rutina?.nombre || 'Rutina'} (1)`,
      desc: rutina?.desc || '',
      claseRutina: rutina?.claseRutina || 'Combinada',
      grupoMuscularRutina: rutina?.grupoMuscularRutina || 'Mixto',
      dias: diasPayload,
    };
  };

  const handleDuplicate = async (rutina) => {
    try {
      setLoading(true);
      const payload = buildDuplicatePayload(rutina);
      await apiService.createRutina(payload);
      toast.success('Rutina duplicada correctamente.');
      await fetchRutinas();
    } catch (error) {
      console.error('Error al duplicar rutina:', error);
      toast.error('No se pudo duplicar la rutina.');
      setLoading(false);
    }
  };

  if (loading) return <LoaderFullScreen />;

  return (
    <div className='page-layout'>
      <SidebarMenu isAdmin={true} />
      <div className='content-layout mi-rutina-ctn'>
        <div className="mi-rutina-title">
          <h2>Mis Rutinas</h2>
          <PrimaryButton text="Crear rutina" linkTo="/admin/crear-rutina" />
        </div>

        <div className="mis-rutinas-list">
          {rutinas.length === 0 ? (
            <p>No hay rutinas cargadas</p>
          ) : rutinas.map(rutina => {
            const dias = normalizeDias(rutina);

            return (
              <div key={rutina.ID_Rutina} className="rutina-card">
                <div className='rutina-header'>
                  <h3>{rutina.nombre}</h3>
                  <div className="rutina-header-acciones">
                    <button onClick={() => handleDuplicate(rutina)} title='Duplicar rutina'><FaCopy size={18} /></button>
                    <button onClick={() => openDeletePopup(rutina.ID_Rutina)} title='Eliminar rutina'><DeleteIcon width={20} height={20} /></button>
                    <button onClick={() => navigate(`/admin/editar-rutina/${rutina.ID_Rutina}`)} title='Editar rutina'><EditIcon width={20} height={20} /></button>
                  </div>
                </div>

                <div className="rutina-data">
                  <p><strong>Clase:</strong> {rutina.claseRutina || '—'}</p>
                  <p><strong>Grupo muscular:</strong> {rutina.grupoMuscularRutina || '—'}</p>
                  <p><strong>Días totales:</strong> {dias.length}</p>
                </div>

                {/* ===== DÍAS ===== */}
                {dias.length <= 1 ? (
                  <div className='rutina-dia'>
                    {dias[0] && <h4>{dias[0].nombre}</h4>}
                    {dias[0]?.descripcion && <p className='dia-desc'>{dias[0].descripcion}</p>}

                    {(dias[0]?.bloques || []).map((b, i) => {
                      const items = getBloqueItems(b);
                      const header = headerForBlock(b);
                      if (b.type === 'SETS_REPS') {
                        const fallback = items.length === 0 ? setsRepsFallback(b) : null;
                        return (
                          <div key={i} className='bloque-card'>
                            {(items.length > 0) ? (
                              <ul className='bloque-list'>
                                {items.map((it, j) => <li key={j}>{renderEjercicioItem(it, b.type)}</li>)}
                              </ul>
                            ) : (
                              fallback && <ul className='bloque-list'><li>{fallback}</li></ul>
                            )}
                          </div>
                        );
                      }
                      return (
                        <div key={i} className='bloque-card'>
                          {header && <p className='bloque-header'>{header}</p>}
                          {items.length > 0 && (
                            <ul className='bloque-list'>
                              {items.map((it, j) => <li key={j}>{renderEjercicioItem(it, b.type)}</li>)}
                            </ul>
                          )}
                          {b.type === 'ROUNDS' && b.descansoRonda != null && (
                            <p className='bloque-footnote'>Descanso: {b.descansoRonda}s</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className='rutina-dias-accordion'>
                    {dias.map((d, idx) => {
                      const isOpen = !!openState?.[rutina.ID_Rutina]?.[d.key];
                      return (
                        <div key={d.key} className={`accordion-item ${isOpen ? 'open' : ''}`}>
                          <button
                            className='accordion-trigger'
                            onClick={() => toggleDia(rutina.ID_Rutina, d.key)}
                            aria-expanded={isOpen}
                          >
                            <span>{d.nombre || `Día ${idx + 1}`}</span>
                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                          </button>

                          {isOpen && (
                            <div className='accordion-content'>
                              {d.descripcion && <p className='dia-desc'>{d.descripcion}</p>}
                              {(d.bloques || []).map((b, i) => {
                                const items = getBloqueItems(b);
                                const header = headerForBlock(b);
                                if (b.type === 'SETS_REPS') {
                                  const fallback = items.length === 0 ? setsRepsFallback(b) : null;
                                  return (
                                    <div key={i} className='bloque-card'>
                                      {(items.length > 0)
                                        ? <ul className='bloque-list'>{items.map((it, j) => <li key={j}>{renderEjercicioItem(it, b.type)}</li>)}</ul>
                                        : fallback && <ul className='bloque-list'><li>{fallback}</li></ul>
                                      }
                                    </div>
                                  );
                                }
                                return (
                                  <div key={i} className='bloque-card'>
                                    {header && <p className='bloque-header'>{header}</p>}
                                    {items.length > 0 && (
                                      <ul className='bloque-list'>
                                        {items.map((it, j) => <li key={j}>{renderEjercicioItem(it, b.type)}</li>)}
                                      </ul>
                                    )}
                                    {b.type === 'ROUNDS' && b.descansoRonda != null && (
                                      <p className='bloque-footnote'>Descanso: {b.descansoRonda}s</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div style={{ marginTop: 12 }}>
                  <button className='rutina-ver-detalle-btn' onClick={() => navigate(`/admin/rutinas/${rutina.ID_Rutina}`)}>
                    Ver más detalles
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <ConfirmationPopup
          isOpen={isPopupOpen}
          message="¿Estás seguro que deseas eliminar esta rutina?"
          onClose={closePopup}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default RutinasAdmin;