import './App.css';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import NotFound from './Pages/NotFound/NotFound';
import AlumnoInicio from './Pages/Alumno/Inicio/AlumnoInicio';
import ClasesActividades from './Pages/Alumno/ClasesActividades/ClasesActividades';
import AdminInicio from './Pages/Admin/Inicio/AdminInicio';
import ClasesActividadesAdmin from './Pages/Admin/ClasesActividades/ClasesActividades';


function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />

      {/* Rutas protegidas */}
      {/* Admin */}
      <Route path="/admin/inicio" 
        element={
          <ProtectedRoute>
            <AdminInicio />
          </ProtectedRoute>
        } 
      />     
      <Route path="/admin/clases-actividades" 
        element={
          <ProtectedRoute>
            <ClasesActividadesAdmin />
          </ProtectedRoute>
        } 
      />      
      {/* Alumno */}
      <Route path="/alumno/inicio" 
        element={
          <ProtectedRoute>
            <AlumnoInicio />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/alumno/clases-actividades" 
        element={
          <ProtectedRoute>
            <ClasesActividades/>
          </ProtectedRoute>
        } 
      />

      {/* Ruta de error */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
