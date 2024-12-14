import React, { useState } from 'react';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import apiClient from '../../../axiosConfig';

const CrearUsuario = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'Cliente',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await apiClient.post('https://gymbackend-qr97.onrender.com/auth/register', {
                email: formData.email,
                password: formData.password,
                userType: formData.userType.toLowerCase(),
            });
            setMessage('Registro exitoso');
    
            setFormData({
                email: '',
                password: '',
                userType: 'Cliente', 
            });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error al registrarse');
        }
    };
    
        
    const tiposDeUsuario = ["Clientes", "Admin"];

    return (
        <div className='page-layout'>
            <SidebarMenu isAdmin={true} />
            <div className='content-layout'>
                <h2>Crear usuario</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px', paddingTop: '30px' }}>
                    <label htmlFor='email'>Email:</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder='Ingresa tu email'
                    />

                    <label htmlFor='password'>Contraseña:</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder='Ingresa tu contraseña'
                    />

                    <label htmlFor='userType'>Tipo de usuario:</label>
                    <CustomDropdown
                        options={tiposDeUsuario}
                        value={formData.userType}
                        onChange={(e) => handleChange(e)}
                        name='userType'
                        id='userType'
                    />
                    <PrimaryButton text="Crear usuario" onClick={handleSubmit}/>
                    {
                        message ? <p> {message} </p> : ''
                    }
                </form>
            </div>
        </div>
    );
};

export default CrearUsuario;
