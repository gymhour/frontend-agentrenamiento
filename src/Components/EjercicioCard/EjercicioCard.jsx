// EjercicioCard.jsx
import React from 'react';
import './EjercicioCard.css';

const EjercicioCard = ({ ejercicio, defaultImage, onEdit, onDelete }) => {
  const { nombre, descripcion, mediaUrl, youtubeUrl } = ejercicio;
  const thumbnail = mediaUrl || defaultImage;

  return (
    <div className="exercise-card">
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

      <div className="exercise-card__actions">
        <button
            type='button'
          className="action-btn edit"
          onClick={() => onEdit(ejercicio)}
        >
          Editar
        </button>
        <button
        type='button'
          className="action-btn delete"
          onClick={() => onDelete(ejercicio)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

function extractVideoId(url) {
  const reg = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/;
  const m = url.match(reg);
  return m ? m[1] : '';
}

export default EjercicioCard;