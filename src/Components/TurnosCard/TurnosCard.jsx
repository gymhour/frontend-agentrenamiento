import React from 'react';
import './turnosCard.css';
import { ReactComponent as TurnoIcon } from '../../assets/icons/turno-icon.svg';

const TurnosCard = ({nombreTurno, fechaTurno, horaTurno}) => {
    return(
        <div className='turnos-card-ctn'>
            <TurnoIcon className='icon'> </TurnoIcon>
            <p> {nombreTurno} </p>
            <p> {fechaTurno} </p>
            <p> {horaTurno} </p>
        </div>
    )
}

export default TurnosCard;