import React from 'react';
import './EjercicioCard.css';

const EjercicioCard = ({
  ejercicio,
  defaultImage,
  onClick,
  onEdit,
  onDelete
}) => {
  const { nombre, descripcion, mediaUrl, youtubeUrl } = ejercicio;
  const thumbnail = mediaUrl || defaultImage;

  // Extrae el ID de YouTube para el embed
  function extractVideoId(url) {
    const reg = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/;
    const m = url?.match?.(reg);
    return m ? m[1] : '';
  }

  const handleView = (e) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div
      className="exercise-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' ? onClick() : null) : undefined}
    >
      <div className="exercise-card__media">
        {youtubeUrl ? (
          <iframe
            className="media__iframe"
            src={`https://www.youtube.com/embed/${extractVideoId(youtubeUrl)}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={nombre}
          />
        ) : (
          <img
            className="media__img"
            src={thumbnail}
            alt={nombre || 'Ejercicio sin nombre'}
          />
        )}
      </div>

      <div className="exercise-card__info">
        <h3 className="info__title">{nombre || 'Sin nombre'}</h3>
        <p className="info__desc">
          {descripcion || 'Descripción no disponible'}
        </p>
      </div>

      <div className="exercise-card__footer">
        {onClick && (
          <button
            type="button"
            className="action-btn view"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          >
            Ver
          </button>
        )}

        {(onEdit || onDelete) && (
          <div className="exercise-card__actions">
            {onEdit && (
              <button
                type="button"
                className="action-btn edit"
                onClick={(e) => { e.stopPropagation(); onEdit(ejercicio); }}
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="action-btn delete"
                onClick={(e) => { e.stopPropagation(); onDelete(ejercicio); }}
              >
                Eliminar
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default EjercicioCard;
