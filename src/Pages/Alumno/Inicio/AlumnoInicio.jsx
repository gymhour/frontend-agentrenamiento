import React from 'react';
import '../../../App.css';
import './alumnoInicio.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { ReactComponent as AddIconCircle } from '../../../assets/icons/add-circle.svg';
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-left.svg';
import TurnosCard from '../../../Components/TurnosCard/TurnosCard';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';

const AlumnoInicio = () => {
    return(
        <div className='page-layout'>
            <SidebarMenu isAdmin={false}/>
            <div className='content-layout'>
                <div className="turnos-ctn">
                    <div className="turnos-ctn-title">
                        <h2> Turnos </h2>
                        <SecondaryButton linkTo="/alumno/turnos" text="Ver historial" icon={ArrowLeftIcon}></SecondaryButton>
                    </div>
                    <div className="turnos-ctn-turnos">
                        <TurnosCard nombreTurno="Crossfit" fechaTurno="Hoy 27/11/2024" horaTurno="10:00 AM" />
                    </div>
                    <PrimaryButton linkTo="/alumno/agendar-turno" text="Agregar nuevo" icon={AddIconCircle}></PrimaryButton>
                </div>
            </div>            
        </div>
    );
}

export default AlumnoInicio;