// components/Login.js
import React, { useState } from 'react';
// Css
import './login.css';
// Assets
import LoginBackgroundImage from '../../assets/login/login_background.png';
import ClientLogo from '../../assets/client/wembleylogo.png'
import OurLogo from '../../assets/gymhour/logo_gymhour.png'
// Funciones
import { useNavigate } from 'react-router-dom';
import apiClient from '../../axiosConfig';
import { jwtDecode } from 'jwt-decode';
// Componentes
import CustomInput from '../../Components/utils/CustomInput/CustomInput';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // TODO: Agregar un loader e identificar si el usuario es admin o alumno para llevarlo a su respectivo dashboard.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        const token = response.data.token;

        // Almacena el token en localStorage
        localStorage.setItem('token', token);

        try {
            // Decodifica el token
            const decodedToken = jwtDecode(token);

            console.log(decodedToken);

            // Verifica el correo electrónico y redirige según corresponda
            if (decodedToken.tipo === 'admin' || decodedToken.tipo === "Admin") {
                navigate('/admin/inicio');
            } else {
                navigate('/alumno/inicio');
            }
        } catch (error) {
            console.error("Error al decodificar el token: ", error);
        }

        setMessage('Inicio de sesión exitoso. Token almacenado.');
    } catch (error) {
        setMessage(error.response?.data?.error || 'Error al iniciar sesión');
    }
};

  return (
    <div className='login-container' style={{backgroundImage: `url(${LoginBackgroundImage})`}}>
      <div className="login-subcontainer">
        <div className="gym-logo-container">
          <img src={ClientLogo} alt="Logo del gimnasio - cliente" width={120}/>
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <CustomInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <CustomInput
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Iniciar sesión</button>
            <p className='forgot-password-link'> Me olvidé mi contraseña </p>
            {message && <p>{message}</p>}
          </form>
        </div>
        <div className="our-logo-container">
          <img src={OurLogo} alt="Logo de nuestra empresa" width={120}/>
        </div>
      </div>
    </div>
  );
};

export default Login;
