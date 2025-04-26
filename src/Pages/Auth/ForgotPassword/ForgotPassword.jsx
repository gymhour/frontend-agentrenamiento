import React, { useState } from 'react';
import LoginBackgroundImage from "../../../assets/login/login_background.png"
import CustomInput from '../../../Components/utils/CustomInput/CustomInput';
import { Link } from 'react-router-dom';
import './ForgotPassword.css'
import apiService from '../../../services/apiService';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { email: email}

        try {
            const response = await apiService.forgotPassword(body);
            console.log("Response", response);
            toast.success('Email enviado correctamente. Por favor, revise su correo.');
        } catch (error) {
            toast.error("Error al enviar mail de recuperación de contraseña.")
        }
    }

    return (
        <>
            <div className='reset-container' style={{ backgroundImage: `url(${LoginBackgroundImage})` }}>
                <div className="reset-subcontainer">
                    <div className='reset-subcontainer-title'>
                        <h4> Restablecer contraseña </h4>
                        <p> Introduce la dirección de correo electrónico asociada a tu cuenta y te enviaremos un vínculo para restablecer tu contraseña.
                        </p>
                    </div>
                    <div className="reset-form-container">
                        <form onSubmit={handleSubmit}>
                            <CustomInput
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                width='100%'
                                required
                            />
                            <button type="submit">Continuar</button>
                        </form>
                    </div>
                    <div className='reset-back-login-container'>
                        <Link to="/" className='back-login-link'> Volver a inicio de sesión </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword;