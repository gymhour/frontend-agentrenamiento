import { useEffect, useState } from 'react';
import '../../../App.css'
import React from 'react';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import apiClient from '../../../axiosConfig';
import './usuariosList.css'
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp';
import { useNavigate } from 'react-router-dom';

const UsuariosList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const navigate = useNavigate();

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/usuarios');
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
            await apiClient.delete(`/usuarios/${idUsuario}`);
            // Eliminación del usuario eliminado en la UI
            setUsuarios(prevUsuarios => prevUsuarios.filter(usuario => usuario.ID_Usuario !== idUsuario));
        } catch (error) {
            console.error('Error al eliminar el usuario - UsuariosList.jsx', error);
        }
    };

    const handleDeleteClick = (idUsuario) => {
        setUserToDelete(idUsuario);
        setIsPopupOpen(true);
    };

    const handlePopupConfirm = () => {
        if (userToDelete !== null) {
            deleteUsuario(userToDelete);
            setUserToDelete(null);
        }
        setIsPopupOpen(false);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setUserToDelete(null);
    };

    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={true} />
            <div className='content-layout'>
                <h2 style={{ marginBottom: '30px' }}> Lista de usuarios </h2>

                {
                    loading ?
                        <p> Cargando usuarios...</p>
                        :
                        usuarios.length === 0 ? (
                            <p>No hay usuarios para mostrar.</p>
                        ) : (
                            <table className='usuarios-table'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Email</th>
                                        <th>Tipo</th>
                                        <th>Fecha de Registro</th>
                                        <th>Acciones</th>
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
                                            <PrimaryButton
                                                text="Editar usuario"
                                                linkTo={`/admin/editar-usuario/${usuario.ID_Usuario}`}
                                            />
                                            <SecondaryButton
                                                text="Eliminar usuario"
                                                onClick={() => handleDeleteClick(usuario.ID_Usuario)}
                                            />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                }
            </div>
            <ConfirmationPopup
                isOpen={isPopupOpen}
                onClose={handlePopupClose}
                onConfirm={handlePopupConfirm}
                message="¿Estás seguro de que deseas eliminar este usuario?"
            />
        </div>
    )
}

export default UsuariosList;