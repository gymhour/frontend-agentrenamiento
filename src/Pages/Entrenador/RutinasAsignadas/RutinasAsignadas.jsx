import React from 'react'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu'

const RutinasAsignadas = () => {
    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={false} isEntrenador={true} />
            <div className='content-layout'> 
                <h2> Rutinas asignadas </h2>
            </div>
        </div>
    )
}

export default RutinasAsignadas