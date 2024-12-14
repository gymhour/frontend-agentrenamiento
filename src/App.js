import './App.css';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Pages/Login/Login';
import SignUp from './Pages/SignUp/SignUp';
import NotFound from './Pages/NotFound/NotFound';
import AlumnoInicio from './Pages/Alumno/Inicio/AlumnoInicio';
import ClasesActividades from './Pages/Alumno/ClasesActividades/ClasesActividades';
import AdminInicio from './Pages/Admin/Inicio/AdminInicio';
import ClasesActividadesAdmin from './Pages/Admin/ClasesActividadesAdmin/ClasesActividadesAdmin';
import MisTurnos from './Pages/Alumno/MisTurnos/MisTurnos';
import AgendarTurno from './Pages/Alumno/AgendarTurno/AgendarTurno';
import ClasesActividadesDetalle from './Pages/Alumno/ClasesActividadesDetalle/ClasesActividadesDetalle';
import ClasesActividadesForm from './Pages/Admin/ClasesActividadesForm/ClasesActividadesForm';
import ClasesActividadesAdminDetalle from './Pages/Admin/ClasesActividadesAdminDetalle/ClasesActividadesAdminDetalle';
import CrearUsuario from './Pages/Admin/CrearUsuario/CrearUsuario';
import UsuariosList from './Pages/Admin/UsuariosList/UsuariosList';


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
      <Route 
        path="/admin/clases-actividades/:id" 
        element={
          <ProtectedRoute>
            <ClasesActividadesAdminDetalle/>
          </ProtectedRoute>
        } 
      />   
      <Route path="/admin/agregar-clase" 
        element={
          <ProtectedRoute>
            <ClasesActividadesForm isEditing={false}/>
          </ProtectedRoute>
        } 
      />  
      <Route path="/admin/editar-clase/:id" 
        element={
          <ProtectedRoute>
            <ClasesActividadesForm isEditing={true} />
          </ProtectedRoute>
        } 
      />    
      <Route path="/admin/usuarios" 
        element={
          <ProtectedRoute>
            <UsuariosList />
          </ProtectedRoute>
        } 
      />  
      <Route path="/admin/crear-usuario" 
        element={
          <ProtectedRoute>
            <CrearUsuario />
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
      <Route path="/alumno/turnos" 
        element={
          <ProtectedRoute>
            <MisTurnos />
          </ProtectedRoute>
        } 
      />
      <Route path="/alumno/agendar-turno" 
        element={
          <ProtectedRoute>
            <AgendarTurno/>
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
      <Route 
        path="/alumno/clases-actividades/:id" 
        element={
          <ProtectedRoute>
            <ClasesActividadesDetalle/>
          </ProtectedRoute>
        } 
      />

      {/* Ruta de error */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
