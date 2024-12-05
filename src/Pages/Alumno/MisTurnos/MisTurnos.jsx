import React from 'react';
import '../../../App.css';
import './misTurnos.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import TurnosCard from '../../../Components/TurnosCard/TurnosCard';
import {ReactComponent as AddCircleIcon} from '../../../assets/icons/add-circle.svg';

const MisTurnos = () => {
    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={false}/>
            <div className='content-layout mis-turnos-ctn'> 
                <div className="proximos-turnos-ctn">
                    <div className="proximo-turno-title">
                        <h2> Próximo turno </h2>
                        <SecondaryButton text="Agendar nuevo" icon={AddCircleIcon}></SecondaryButton>
                    </div>
                    <div className="proximo-turno-turnos">
                        <TurnosCard nombreTurno="Crossfit" fechaTurno="Hoy 27/11/2024" horaTurno="10:00 AM" />
                    </div>
                </div>
                <div className="historial-turnos-ctn">
                    <div className="historial-turno-title">
                        <h2> Historial </h2>
                    </div>
                    <div className="proximo-turno-turnos">
                        <TurnosCard nombreTurno="Crossfit" fechaTurno="26/11/2024" horaTurno="10:00 AM" />
                        <TurnosCard nombreTurno="Musculación libre" fechaTurno="25/11/2024" horaTurno="11:00 AM" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MisTurnos;