import React from 'react';
import './turnosCard.css';
import { ReactComponent as TurnoIcon } from '../../assets/icons/turno-icon.svg';

const TurnosCard = ({ id, nombreTurno, fechaTurno, onCancelTurno }) => {
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  const formattedDate = formatDate(fechaTurno);
  const showCancelButton = new Date(fechaTurno) > new Date();

  return (
    <div className='turnos-card-ctn'>
      <div className="turno-icon">
        <TurnoIcon className='icon' />
      </div>
      <div className="turno-name">
        <p>{nombreTurno ?? "Nombre no disponible"}</p>
      </div>
      <div className="turno-date">
        <p>{formattedDate}</p>
      </div>
      <div className="turno-cancel">
        <button 
          className="cancel-button" 
          onClick={() => onCancelTurno(id)}
          style={{ visibility: showCancelButton ? 'visible' : 'hidden' }}
        >
          Cancelar turno
        </button>
      </div>
    </div>
  );
};

export default TurnosCard;