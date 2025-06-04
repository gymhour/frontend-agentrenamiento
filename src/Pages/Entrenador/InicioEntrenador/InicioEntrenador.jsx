import React from 'react'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu'

const InicioEntrenador = () => {
  return (
    <div className='page-layout'>
        <SidebarMenu isAdmin={false} isEntrenador={true} />
        <div className='content-layout'> </div>
    </div>
  )
}

export default InicioEntrenador