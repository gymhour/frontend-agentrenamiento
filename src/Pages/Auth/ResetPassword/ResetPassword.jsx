import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LoginBackgroundImage from "../../../assets/login/login_background.png";
import CustomInput from '../../../Components/utils/CustomInput/CustomInput';
import apiService from '../../../services/apiService';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [searchParams]    = useSearchParams();
  const token             = searchParams.get('token') || '';
  const navigate          = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Token inválido o faltante en la URL');
      return;
    }

    const body = { 
      newPassword: nuevaContraseña,
      token
    };

    try {
      await apiService.resetPassword(body);
      toast.success('Contraseña actualizada correctamente. Te redirigimos al inicio.');
      navigate('/');
    } catch (error) {
      toast.error('Error al crear nueva contraseña');
    }
  };

  return (
    <div
      className='reset-container'
      style={{ backgroundImage: `url(${LoginBackgroundImage})` }}
    >
      <div className="reset-subcontainer">
        <div className='reset-subcontainer-title'>
          <h4>Ingrese su nueva contraseña</h4>
        </div>
        <div className="reset-form-container">
          <form onSubmit={handleSubmit}>
            <CustomInput
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaContraseña}
              onChange={(e) => setNuevaContraseña(e.target.value)}
              width='100%'
              required
            />
            <button type="submit">Continuar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;