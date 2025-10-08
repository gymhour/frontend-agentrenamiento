import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import apiService from '../../../services/apiService';
import './RutinaDetail.css';

const TYPE_LABELS = {
    SETS_REPS: 'Series y repeticiones',
    ROUNDS: 'Rondas',
    EMOM: 'EMOM',
    AMRAP: 'AMRAP',
    TABATA: 'Tabata',
    LADDER: 'Escalera',
    FOR_TIME: 'For time',
};

const RutinaDetail = ({ fromAdmin, fromEntrenador, fromAlumno }) => {
    const { id } = useParams();
    const [rutina, setRutina] = useState(null);
    const [activeDiaKey, setActiveDiaKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const pretty = (v, fallback = '—') =>
        (v === null || v === undefined || v === '') ? fallback : v;

    // Normaliza y ordena dia1, dia2, ...
    const normalizeDias = (diasObj) => {
        if (!diasObj || typeof diasObj !== 'object') return [];
        const keys = Object.keys(diasObj).sort((a, b) => {
            const na = parseInt(a.replace(/\D/g, ''), 10) || 0;
            const nb = parseInt(b.replace(/\D/g, ''), 10) || 0;
            return na - nb;
        });
        return keys.map((key) => ({ key, ...diasObj[key] }));
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setError('');
                const data = await apiService.getRutinaById(id);
                if (!mounted) return;
                setRutina(data);
                const diasArr = normalizeDias(data?.dias);
                setActiveDiaKey(diasArr[0]?.key || null);
            } catch (e) {
                console.error(e);
                if (!mounted) return;
                setError('No se pudo cargar la rutina. Intentá nuevamente.');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [id]);

    const dias = useMemo(() => normalizeDias(rutina?.dias), [rutina]);

    const headerSubtitle = useMemo(() => {
        if (!rutina) return '';
        const parts = [];
        if (rutina.claseRutina) parts.push(rutina.claseRutina);
        if (rutina.grupoMuscularRutina) parts.push(rutina.grupoMuscularRutina);
        return parts.join(' • ');
    }, [rutina]);

    const getRepsChip = (ejItem, bloque) => {
        return ejItem?.reps || ejItem?.setRepWeight || bloque?.setsReps || '';
    };

    const typeLabel = (t) => TYPE_LABELS[t] || pretty(t, 'Bloque');

    return (
        <div className="page-layout">
            <SidebarMenu
                isAdmin={fromAdmin}
                isEntrenador={fromEntrenador}
                isAlumno={fromAlumno}
            />
            <div className="content-layout">
                {/* Estados */}
                {loading && <div className="gh-card gh-muted">Cargando rutina…</div>}
                {!loading && error && <div className="gh-card gh-error">{error}</div>}

                {!loading && !error && rutina && (
                    <>
                        {/* Header */}
                        <div className="gh-card" style={{ display: 'grid', gap: 12 }}>
                            <div style={{ display: 'grid', gap: 6 }}>
                                <h2 className="gh-title" style={{ margin: 0 }}>
                                    {pretty(rutina.nombre, 'Rutina sin nombre')}
                                </h2>
                                {headerSubtitle && (
                                    <p className="gh-muted sm" style={{ margin: 0 }}>{headerSubtitle}</p>
                                )}
                            </div>

                            <div className="gh-grid-3">
                                <div className="gh-surface">
                                    <div className="gh-label xs">Alumno</div>
                                    <div className="gh-text">
                                        {pretty(
                                            rutina?.alumno
                                                ? `${pretty(rutina.alumno.nombre, '')} ${pretty(rutina.alumno.apellido, '')}`.trim()
                                                : ''
                                        )}
                                    </div>
                                </div>
                                <div className="gh-surface">
                                    <div className="gh-label xs">Entrenador</div>
                                    <div className="gh-text">
                                        {pretty(
                                            rutina?.entrenador
                                                ? `${pretty(rutina.entrenador.nombre, '')} ${pretty(rutina.entrenador.apellido, '')}`.trim()
                                                : '—'
                                        )}
                                    </div>
                                </div>
                                <div className="gh-surface">
                                    <div className="gh-label xs">Creada</div>
                                    <div className="gh-text">
                                        {pretty(
                                            rutina?.createdAt
                                                ? new Date(rutina.createdAt).toLocaleDateString()
                                                : ''
                                        )}
                                    </div>
                                </div>
                            </div>

                            {pretty(rutina.desc, '') && (
                                <div className="gh-surface">
                                    <p className="gh-text" style={{ margin: 0 }}>{rutina.desc}</p>
                                </div>
                            )}
                        </div>

                        {/* Tabs de días */}
                        <div className="gh-card" style={{ display: 'grid', gap: 12 }}>
                            <div className="gh-tabs">
                                <div className="gh-tabs-list" role="tablist" aria-label="Días de la rutina">
                                    {dias.length === 0 && (
                                        <span className="gh-muted sm">Esta rutina no tiene días cargados.</span>
                                    )}
                                    {dias.map((d) => (
                                        <button
                                            key={d.key}
                                            role="tab"
                                            aria-selected={activeDiaKey === d.key}
                                            className={`gh-tab ${activeDiaKey === d.key ? 'active' : ''}`}
                                            onClick={() => setActiveDiaKey(d.key)}
                                        >
                                            {pretty(d?.nombre, d.key.replace('dia', 'Día '))}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Panel del día activo */}
                            {dias.map((d) => {
                                const isActive = d.key === activeDiaKey;
                                if (!isActive) return null;

                                const bloques = Array.isArray(d?.bloques) ? d.bloques : [];
                                return (
                                    <div key={`${d.key}-panel`} role="tabpanel">
                                        {bloques.length === 0 ? (
                                            <div className="gh-muted">Este día no tiene bloques cargados.</div>
                                        ) : (
                                            <div className="gh-grid-2 gh-grid-fullwidth">
                                                {bloques.map((b) => (
                                                    <div className="gh-surface" key={b.ID_Bloque} style={{ display: 'grid', gap: 12 }}>
                                                        {/* header bloque */}
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                gap: 8,
                                                                flexWrap: 'wrap'
                                                            }}
                                                        >
                                                            <h4 className="gh-feature-title" style={{ margin: 0 }}>
                                                                {(() => {
                                                                    const type = b?.type;
                                                                    const dur = pretty(b.durationMin, '');
                                                                    const rondas = pretty(b.cantRondas, '');
                                                                    const escalera = pretty(b.tipoEscalera, '');

                                                                    if (type === 'SETS_REPS') return 'Series y repeticiones';
                                                                    if (type === 'ROUNDS' && rondas) return `${rondas} Rondas`;
                                                                    if (type === 'EMOM' && dur) return `EMOM ${dur}min`;
                                                                    if (type === 'AMRAP' && dur) return `AMRAP ${dur}min`;
                                                                    if (type === 'TABATA' && dur) return `Tabata ${dur}min`;
                                                                    if (type === 'LADDER' && escalera) return `Escalera: ${escalera}`;
                                                                    return typeLabel(type);
                                                                })()}
                                                            </h4>
                                                        </div>


                                                        {/* ejercicios minimal: imagen + nombre + reps + peso */}
                                                        <div style={{ display: 'grid', gap: 10 }}>
                                                            {(b.ejercicios || []).length === 0 ? (
                                                                <div className="gh-muted sm">Este bloque no tiene ejercicios.</div>
                                                            ) : (
                                                                b.ejercicios.map((e, idx) => {
                                                                    const ej = e?.ejercicio || {};
                                                                    const nombre = pretty(ej?.nombre, 'Ejercicio');
                                                                    const media = ej?.mediaUrl || '';
                                                                    const repsChip = getRepsChip(e, b);
                                                                    const weightChip =
                                                                        e?.setRepWeight && e?.setRepWeight !== repsChip
                                                                            ? e.setRepWeight
                                                                            : !e?.setRepWeight && b?.weight
                                                                                ? b.weight
                                                                                : '';

                                                                    return (
                                                                        <div
                                                                            key={`${b.ID_Bloque}-${e.ID_Ejercicio}-${idx}`}
                                                                            className="gh-list-item gh-ej-row"
                                                                        >
                                                                            {/* imagen */}
                                                                            {media ? (
                                                                                <img
                                                                                    className="gh-ej-thumb"
                                                                                    src={media}
                                                                                    alt={nombre}
                                                                                    onError={(ev) => {
                                                                                        ev.currentTarget.style.display = 'none';
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <div className="gh-ej-thumb placeholder" />
                                                                            )}

                                                                            {/* info principal */}
                                                                            <div className="gh-ej-main">
                                                                                <div className="gh-ej-title">
                                                                                    <span className="gh-text bold">{nombre}</span>
                                                                                </div>
                                                                                <div className="gh-ej-info">
                                                                                    {repsChip && (
                                                                                        <span className="gh-muted sm">{repsChip}</span>
                                                                                    )}
                                                                                    {weightChip && (
                                                                                        <span className="gh-muted sm" style={{ marginLeft: 8 }}>
                                                                                            {weightChip}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            )}
                                                        </div>


                                                        {/* footer bloque */}
                                                        {pretty(b.descansoRonda, '') && (
                                                            <div className="gh-inline">
                                                                <span className="gh-chip">{`Descanso entre rondas: ${b.descansoRonda}`}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RutinaDetail;
