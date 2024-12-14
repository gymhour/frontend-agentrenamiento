import { useEffect, useState } from 'react';
import '../../../App.css'
import React from 'react';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import apiClient from '../../../axiosConfig';
import './usuariosList.css'
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';

const UsuariosList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const fetchUsuarios = async () => {
      try {
        const response = await apiClient.get('https://gymbackend-qr97.onrender.com/usuarios');
        setUsuarios(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchUsuarios();
      }, []);

    const deleteUsuario = async (idUsuario) => {
        try {
            const response = await apiClient.delete(`https://gymbackend-qr97.onrender.com/usuarios/${idUsuario}`);
        } catch (error) {
            console.error('Error al eliminar el usuario - UsuariosList.jsx', error);
        }
    };
    
    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={true}/>
            <div className='content-layout'> 
                <h2 style={{marginBottom: '30px'}}> Lista de usuarios </h2>
                {
                    loading ? 
                        <p> Cargando usuarios...</p>
                    :
                    <table className='usuarios-table'>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Tipo</th>
                            <th>Fecha de Registro</th>
                            <th> Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.ID_Usuario}>
                            <td>{usuario.ID_Usuario}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.tipo || 'N/A'}</td>
                            <td>{new Date(usuario.fechaRegistro).toLocaleDateString()}</td>
                            <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <PrimaryButton text="Editar usuario"/>
                                <SecondaryButton text="Eliminar usuario" onClick={() => deleteUsuario(usuario.ID_Usuario)}/>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    )
}

export default UsuariosList;