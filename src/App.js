import './App.css';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import NotFound from './Pages/NotFound/NotFound';
import AlumnoInicio from './Pages/Alumno/Inicio/AlumnoInicio';


function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />

      {/* Rutas protegidas */}
      <Route 
        path="/inicio-alumno" 
        element={
          <ProtectedRoute>
            <AlumnoInicio />
          </ProtectedRoute>
        } 
      />

      {/* Ruta de error */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
