import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import apiService from '../../../services/apiService';
import './RutinaDetail.css';

// ==== PDF ====
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';

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
        v === null || v === undefined || v === '' ? fallback : v;

    // ---- Normaliza y ordena dia1, dia2, ...
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
        return () => {
            mounted = false;
        };
    }, [id]);

    const dias = useMemo(() => normalizeDias(rutina?.dias), [rutina]);

    const headerSubtitle = useMemo(() => {
        if (!rutina) return '';
        const parts = [];
        if (rutina.claseRutina) parts.push(rutina.claseRutina);
        if (rutina.grupoMuscularRutina) parts.push(rutina.grupoMuscularRutina);
        return parts.join(' • ');
    }, [rutina]);

    // ---- Derivaciones correctas
    const deriveReps = (ejItem, bloque) => ejItem?.reps || bloque?.setsReps || '';
    const derivePeso = (ejItem, bloque) => ejItem?.setRepWeight || bloque?.weight || '';

    // ---- Etiqueta de tipo de bloque
    const typeLabel = (t) => TYPE_LABELS[t] || pretty(t, 'Bloque');

    // ---- Helpers media (video > imagen > placeholder)
    const getYouTubeId = (url) => {
        if (!url) return null;
        try {
            const u = new URL(url);
            if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
            if (u.hostname.includes('youtube.com')) {
                const id = u.searchParams.get('v');
                if (id) return id;
                const m = u.pathname.match(/\/embed\/([A-Za-z0-9_-]{6,})/);
                if (m) return m[1];
            }
        } catch { /* noop */ }
        return null;
    };

    const isVideoFile = (url) => /\.(mp4|webm|ogg)$/i.test(url || '');

    const renderMedia = (ej) => {
        const ytId = getYouTubeId(ej?.youtubeUrl || '');
        if (ytId) {
            const ytUrl =
                ej?.youtubeUrl?.startsWith('http')
                    ? ej.youtubeUrl
                    : `https://www.youtube.com/watch?v=${ytId}`;
            const thumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

            return (
                <a
                    href={ytUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gh-ej-ytlink"
                    title={`Ver en YouTube: ${ej?.nombre || 'ejercicio'}`}
                    aria-label={`Ver ${ej?.nombre || 'ejercicio'} en YouTube`}
                >
                    <img
                        className="gh-ej-thumb"
                        src={thumb}
                        alt=""
                        onError={(ev) => { ev.currentTarget.style.display = 'none'; }}
                    />
                    <span className="gh-ej-ytbadge">YouTube</span>
                </a>
            );
        }

        if (isVideoFile(ej?.mediaUrl)) {
            return (
                <video className="gh-ej-media video" controls preload="metadata">
                    <source src={ej.mediaUrl} />
                </video>
            );
        }
        if (ej?.mediaUrl) {
            return (
                <img
                    className="gh-ej-thumb"
                    src={ej.mediaUrl}
                    alt={ej?.nombre || 'Ejercicio'}
                    onError={(ev) => {
                        ev.currentTarget.style.display = 'none';
                        const sib = ev.currentTarget.nextElementSibling;
                        if (sib && sib.classList.contains('gh-ej-thumb-placeholder')) {
                            sib.classList.add('show');
                        }
                    }}
                />
            );
        }
        return <div className="gh-ej-thumb-placeholder show" aria-hidden="true" />;
    };

    // =========================
    //      EXPORTAR A PDF
    // =========================
    const handleExportPDF = () => {
        if (!rutina) return;

        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const M = 48; // márgenes
        let cursorY = M;

        const addSectionTitle = (text) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text(text, M, cursorY);
            cursorY += 10;
            doc.setDrawColor(150);
            doc.line(M, cursorY, pageW - M, cursorY);
            cursorY += 12;
        };

        const ensureSpace = (minSpace = 120) => {
            if (cursorY + minSpace > pageH - M) {
                doc.addPage();
                cursorY = M;
            }
        };

        // Header documento
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        const titulo = pretty(rutina.nombre, 'Rutina');
        doc.text(titulo, M, cursorY);
        cursorY += 22;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const alumno =
            rutina?.alumno
                ? `${pretty(rutina.alumno.nombre, '')} ${pretty(rutina.alumno.apellido, '')}`.trim()
                : '';
        const entrenador =
            rutina?.entrenador
                ? `${pretty(rutina.entrenador.nombre, '')} ${pretty(rutina.entrenador.apellido, '')}`.trim()
                : '—';
        const creada = rutina?.createdAt ? new Date(rutina.createdAt).toLocaleDateString() : '';

        const headerLines = [
            alumno ? `Alumno: ${alumno}` : '',
            `Entrenador: ${entrenador}`,
            creada ? `Creada: ${creada}` : '',
            headerSubtitle ? `Detalle: ${headerSubtitle}` : ''
        ].filter(Boolean);

        headerLines.forEach((line) => {
            doc.text(line, M, cursorY);
            cursorY += 16;
        });

        if (pretty(rutina.desc, '')) {
            const descLines = doc.splitTextToSize(String(rutina.desc), pageW - M * 2);
            descLines.forEach((l) => {
                doc.text(l, M, cursorY);
                cursorY += 14;
            });
        }

        // Separador
        cursorY += 8;
        doc.setDrawColor(200);
        doc.line(M, cursorY, pageW - M, cursorY);
        cursorY += 18;

        // Por cada día
        const diasArr = normalizeDias(rutina?.dias);
        if (diasArr.length === 0) {
            doc.setFont('helvetica', 'italic');
            doc.text('Esta rutina no tiene días cargados.', M, cursorY);
            doc.save(safeFileName(titulo, alumno));
            return;
        }

        diasArr.forEach((d, idxDia) => {
            ensureSpace(80);
            const nombreDia = pretty(d?.nombre, d?.key?.replace('dia', 'Día ') || `Día ${idxDia + 1}`);
            addSectionTitle(nombreDia);

            const bloques = Array.isArray(d?.bloques) ? d.bloques : [];
            if (bloques.length === 0) {
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(11);
                doc.text('Este día no tiene bloques cargados.', M, cursorY);
                cursorY += 18;
                return;
            }

            bloques.forEach((b, iB) => {
                ensureSpace(80);

                // Header de bloque
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                const type = b?.type;
                const dur = pretty(b?.durationMin, '');
                const rondas = pretty(b?.cantRondas, '');
                const escalera = pretty(b?.tipoEscalera, '');

                let bloqueTitulo = typeLabel(type);
                if (type === 'ROUNDS' && rondas) bloqueTitulo = `${rondas} Rondas`;
                if (type === 'EMOM' && dur) bloqueTitulo = `EMOM ${dur}min`;
                if (type === 'AMRAP' && dur) bloqueTitulo = `AMRAP ${dur}min`;
                if (type === 'TABATA' && dur) bloqueTitulo = `Tabata ${dur}min`;
                if (type === 'LADDER' && escalera) bloqueTitulo = `Escalera: ${escalera}`;

                doc.text(bloqueTitulo, M, cursorY);
                cursorY += 6;

                // Tabla de ejercicios
                const rows = (b?.ejercicios || []).map((e) => {
                    const ej = e?.ejercicio || {};
                    const nombre = pretty(ej?.nombre, 'Ejercicio');
                    const reps = deriveReps(e, b);
                    const peso = derivePeso(e, b);
                    return {
                        ejercicio: nombre,
                        reps: reps || '',
                        peso: peso || ''
                    };
                });

                if (rows.length === 0) {
                    doc.setFont('helvetica', 'italic');
                    doc.setFontSize(10);
                    doc.text('Este bloque no tiene ejercicios.', M, cursorY + 16);
                    cursorY += 32;
                } else {
                    autoTable(doc, {
                        startY: cursorY + 10,
                        margin: { left: M, right: M },
                        theme: 'grid', // opcional, deja bordes finos y claros
                        styles: {
                            font: 'helvetica',
                            fontSize: 10,
                            cellPadding: 6,
                            overflow: 'linebreak',
                            textColor: 0,        // texto de body en negro
                        },
                        headStyles: {
                            fillColor: [240, 240, 240], // gris clarito de fondo (o [255,255,255] si lo querés blanco)
                            textColor: 0,               // <<--- títulos del header en negro
                            fontStyle: 'bold'
                        },
                        head: [['Ejercicio', 'Series / Reps', 'Peso']],
                        body: rows.map((r) => [r.ejercicio, r.reps, r.peso]),
                        didDrawPage: (data) => {
                            const page = doc.getCurrentPageInfo().pageNumber;
                            const total = doc.getNumberOfPages();
                            doc.setFontSize(9);
                            doc.setTextColor(100);
                            doc.text(`Página ${page} de ${total}`, pageW - M, pageH - 10, { align: 'right' });
                        }
                    });

                    cursorY = (doc.lastAutoTable?.finalY || cursorY) + 16;
                }

                // Footer del bloque
                if (pretty(b?.descansoRonda, '')) {
                    ensureSpace(30);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.text(`Descanso entre rondas: ${b.descansoRonda}`, M, cursorY);
                    cursorY += 16;
                }

                // Separador entre bloques
                if (iB !== bloques.length - 1) {
                    doc.setDrawColor(230);
                    doc.line(M, cursorY, pageW - M, cursorY);
                    cursorY += 14;
                }
            });

            // Separador entre días
            if (idxDia !== diasArr.length - 1) {
                ensureSpace(20);
                doc.setDrawColor(180);
                doc.line(M, cursorY, pageW - M, cursorY);
                cursorY += 18;
            }
        });

        // Guardar
        doc.save(safeFileName(titulo, rutina?.alumno));
    };

    const safeFileName = (titulo, alumnoObj) => {
        const alumnoName = alumnoObj
            ? `${pretty(alumnoObj?.nombre, '')} ${pretty(alumnoObj?.apellido, '')}`.trim()
            : 'alumno';
        const today = new Date().toISOString().slice(0, 10);
        const raw = `Rutina_${alumnoName || 'alumno'}_${titulo || 'detalle'}_${today}.pdf`;
        return raw.replace(/[^\w\s.-]/g, '_');
    };

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
                {!loading && error && <div className="gh-error">{error}</div>}

                {!loading && !error && rutina && (
                    <>
                        {/* ====== Acciones globales ====== */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                            <PrimaryButton
                                text="Exportar como PDF"
                                type="button"
                                onClick={handleExportPDF}
                                title="Exportar esta rutina a PDF"
                            />
                        </div>

                        {/* Header rutina */}
                        <div className="header-rutina" style={{ display: 'grid', gap: 12 }}>
                            <div style={{ display: 'grid', gap: 6 }}>
                                <h2 className="gh-title" style={{ margin: 0 }}>
                                    {pretty(rutina.nombre, 'Rutina sin nombre')}
                                </h2>
                                {headerSubtitle && (
                                    <p className="gh-muted sm" style={{ margin: 0 }}>
                                        {headerSubtitle}
                                    </p>
                                )}
                            </div>

                            <div className="gh-grid-3">
                                <div className="gh-surface">
                                    <div className="gh-label xs">Alumno</div>
                                    <div className="gh-text">
                                        {pretty(
                                            rutina?.alumno
                                                ? `${pretty(rutina.alumno.nombre, '')} ${pretty(
                                                    rutina.alumno.apellido,
                                                    ''
                                                )}`.trim()
                                                : ''
                                        )}
                                    </div>
                                </div>
                                <div className="gh-surface">
                                    <div className="gh-label xs">Entrenador</div>
                                    <div className="gh-text">
                                        {pretty(
                                            rutina?.entrenador
                                                ? `${pretty(rutina.entrenador.nombre, '')} ${pretty(
                                                    rutina.entrenador.apellido,
                                                    ''
                                                )}`.trim()
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
                                    <p className="gh-text" style={{ margin: 0 }}>
                                        {rutina.desc}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Tabs de días */}
                        <div className="tab-dias" style={{ display: 'grid', gap: 12 }}>
                            <div className="gh-tabs">
                                <div
                                    className="gh-tabs-list"
                                    role="tablist"
                                    aria-label="Días de la rutina"
                                >
                                    {dias.length === 0 && (
                                        <span className="gh-muted sm">
                                            Esta rutina no tiene días cargados.
                                        </span>
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
                                                    <div
                                                        className="gh-surface"
                                                        key={b.ID_Bloque}
                                                        style={{ display: 'grid', gap: 12 }}
                                                    >
                                                        {/* header del bloque */}
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                gap: 8,
                                                                flexWrap: 'wrap',
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

                                                        {/* lista de ejercicios (media + título + reps) */}
                                                        <div style={{ display: 'grid', gap: 10 }}>
                                                            {(b.ejercicios || []).length === 0 ? (
                                                                <div className="gh-muted sm">
                                                                    Este bloque no tiene ejercicios.
                                                                </div>
                                                            ) : (
                                                                b.ejercicios.map((e, idx) => {
                                                                    const ej = e?.ejercicio || {};
                                                                    const nombre = pretty(ej?.nombre, 'Ejercicio');
                                                                    const reps = deriveReps(e, b);
                                                                    const peso = derivePeso(e, b);
                                                                    const title =
                                                                        peso && String(peso).trim().length > 0
                                                                            ? `${nombre} - ${peso}`
                                                                            : nombre;

                                                                    return (
                                                                        <div
                                                                            key={`${b.ID_Bloque}-${e.ID_Ejercicio}-${idx}`}
                                                                            className="gh-list-item gh-ej-row"
                                                                        >
                                                                            {/* Media */}
                                                                            <div className="gh-media-slot">
                                                                                {renderMedia(ej)}
                                                                                {!ej?.mediaUrl && (
                                                                                    <div className="gh-ej-thumb-placeholder show" />
                                                                                )}
                                                                            </div>

                                                                            {/* Info */}
                                                                            <div className="gh-ej-main">
                                                                                <div className="gh-ej-title">
                                                                                    <span className="gh-text bold">{title}</span>
                                                                                </div>
                                                                                <div className="gh-ej-info">
                                                                                    {reps && <span className="gh-muted sm">{reps}</span>}
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
                                                                <span>{`Descanso entre rondas: ${b.descansoRonda}`}</span>
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