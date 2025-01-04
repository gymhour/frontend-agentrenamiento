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
import LoaderFullScreen from '../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const token = response.data.token;

      // Almacena el token en localStorage
      localStorage.setItem('token', token);

      // Decodifica el token
      const decodedToken = jwtDecode(token);

      // Verifica el correo electrónico y redirige según corresponda
      if (decodedToken.tipo === 'admin' || decodedToken.tipo === "Admin") {
        navigate('/admin/inicio');
      } else {
        navigate('/alumno/inicio');
      }

      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      toast.error("Error al iniciar sesión. Comprueba tus credenciales")
      // toast.error(error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login-container' style={{ backgroundImage: `url(${LoginBackgroundImage})` }}>
      {isLoading && <LoaderFullScreen />}
      <div className="login-subcontainer">
        <div className="gym-logo-container">
          <img src={ClientLogo} alt="Logo del gimnasio - cliente" width={120} />
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
          </form>
        </div>
        <div className="our-logo-container">
          <img src={OurLogo} alt="Logo de nuestra empresa" width={120} />
        </div>
      </div>
    </div>
  );
};

export default Login;
