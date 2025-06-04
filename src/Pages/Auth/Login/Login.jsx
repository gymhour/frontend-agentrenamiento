import React, { useState } from 'react';
// Css
import './login.css';
// Assets
import LoginBackgroundImage from '../../../assets/login/login_background.png';
import ClientLogo from '../../../assets/client/wembleylogo.png'
import OurLogo from '../../../assets/gymhour/logo_gymhour.png'
// Funciones
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import apiClient from '../../../axiosConfig';
import { jwtDecode } from 'jwt-decode';
// Componentes
import CustomInput from '../../../Components/utils/CustomInput/CustomInput';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
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
      // console.log("Decoded token", decodedToken)
      localStorage.setItem("usuarioId", decodedToken.id);
  
      // Obtén el tipo en minúsculas para evitar problemas de mayúsculas/minúsculas
      const tipoNormalized = decodedToken.tipo.toLowerCase();
  
      // Redirige según el rol
      if (tipoNormalized === 'admin') {
        navigate('/admin/inicio');
      } else if (tipoNormalized === 'entrenador') {
        navigate('/entrenador/inicio');
      } else {
        // Por defecto asumimos que es alumno (u otro tipo que quieras manejar)
        navigate('/alumno/inicio');
      }
  
      toast.success('Inicio de sesión exitoso');
    } catch (error) {
      toast.error("Error al iniciar sesión. Comprueba tus credenciales");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className='login-container' style={{ backgroundImage: `url(${LoginBackgroundImage})` }}>
      {/* {isLoading && <LoaderFullScreen />} */}
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
            {/* TODO: Agregar el ojito */}
            <CustomInput
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className='btn-login' type="submit" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
            <Link to="/forgot-password" className='forgot-password-link'>
              Me olvidé mi contraseña          
            </Link>
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
