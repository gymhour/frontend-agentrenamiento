import React from 'react';
import '../../../App.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';

const AdminInicio = () => {
    return(
        <div className='page-layout'>
            <SidebarMenu isAdmin={true}/>
            <div className='content-layout'>
                <h2> Admin </h2>
            </div>            
        </div>
    );
}

export default AdminInicio;