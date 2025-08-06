import './App.css';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Importa el ToastContainer
import ProtectedRoute from './ProtectedRoute';
import Login from './Pages/Auth/Login/Login';
import SignUp from './Pages/Auth/SignUp/SignUp';
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
import ForgotPassword from './Pages/Auth/ForgotPassword/ForgotPassword';
import MiRutina from './Pages/Alumno/MiRutina/MiRutina';
import CrearRutina from './Pages/Alumno/CrearRutina/CrearRutina';
import MedicionResultados from './Pages/Alumno/MediciónResultados/MedicionResultados';
import Entrenadores from './Pages/Alumno/Entrenadores/Entrenadores';
import RutinasRecomendadas from './Pages/Alumno/RutinasRecomendadas/RutinasRecomendadas';
import NuevaMedicion from './Pages/Alumno/NuevaMedicion/NuevaMedicion';
import MedicionResultadosDetalle from './Pages/Alumno/MedicionResultadosDetalle/MedicionResultadosDetalle';
import EditarUsuario from './Pages/Admin/EditarUsuario/EditarUsuario';
import RutinasAdmin from './Pages/Admin/RutinasAdmin/RutinasAdmin';
import CuotasUsuarios from './Pages/Admin/CuotasUsuarios/CuotasUsuarios';
import ResetPassword from './Pages/Auth/ResetPassword/ResetPassword';
import ChangePassword from './Pages/Auth/ChangePassword/ChangePassword';
import Cuotas from './Pages/Alumno/Cuotas/Cuotas';
import InicioEntrenador from './Pages/Entrenador/InicioEntrenador/InicioEntrenador';
import RutinasAsignadas from './Pages/Entrenador/RutinasAsignadas/RutinasAsignadas';
import { useLocation } from 'react-router-dom';
import AsistenteChat from './Components/AsistenteChat/AsistenteChat';
import PlanesAdmin from './Pages/Admin/PlanesAdmin/PlanesAdmin';
import TurnosAdmin from './Pages/Admin/TurnosAdmin/TurnosAdmin';
import Ejercicios from './Pages/Shared/Ejercicios/Ejercicios';
import EjercicioForm from './Pages/Shared/EjercicioForm/EjercicioForm';
import EjercicioDetail from './Pages/Shared/EjercicioDetail/EjercicioDetail';

function App() {

  const location = useLocation();

  // Comprueba si el usuario está “logueado”.
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  // Define las rutas donde NO queremos el chat:
  const hiddenPaths = ['/', '/sign-up', '/forgot-password', '/reset-password'];
  // Sólo mostramos el chat si el usuario está logueado y la ruta actual NO está en hiddenPaths
  const showChat = isLoggedIn && !hiddenPaths.includes(location.pathname);

  return (
    <>
      {/* ToastContainer Global */}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

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
              <ClasesActividadesAdmin fromAdmin={true} />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/turnos"
          element={
            <ProtectedRoute>
              <TurnosAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/clases-actividades/:id"
          element={
            <ProtectedRoute>
              <ClasesActividadesAdminDetalle fromAdmin={true} />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/agregar-clase"
          element={
            <ProtectedRoute>
              <ClasesActividadesForm isEditing={false} fromAdmin={true} />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/editar-clase/:id"
          element={
            <ProtectedRoute>
              <ClasesActividadesForm isEditing={true} fromAdmin={true} />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/usuarios"
          element={
            <ProtectedRoute>
              <UsuariosList fromAdmin={true} />
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
        <Route path="/admin/editar-usuario/:id"
          element={
            <ProtectedRoute>
              <EditarUsuario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ejercicios"
          element={
            <ProtectedRoute>
              <Ejercicios fromAdmin={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ejercicios/:id"
          element={
            <ProtectedRoute>
              <EjercicioDetail fromAdmin={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ejercicios/form/:id?"
          element={
            <ProtectedRoute>
              <EjercicioForm fromAdmin={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rutinas"
          element={
            <ProtectedRoute>
              <RutinasAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/crear-rutina"
          element={
            <ProtectedRoute>
              <CrearRutina fromAdmin={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editar-rutina/:rutinaId"
          element={
            <ProtectedRoute>
              <CrearRutina fromAdmin={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/planes"
          element={
            <ProtectedRoute>
              <PlanesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cuotas"
          element={
            <ProtectedRoute>
              <CuotasUsuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/cambiar-contrasena"
          element={
            <ProtectedRoute>
              <ChangePassword fromAdmin={true} />
            </ProtectedRoute>
          }
        />
        {/* Entrenador */}
        <Route path="/entrenador/inicio"
          element={
            <ProtectedRoute>
              <InicioEntrenador />
            </ProtectedRoute>
          }
        />
        <Route path="/entrenador/asignar-rutinas"
          element={
            <ProtectedRoute>
              <CrearRutina fromEntrenador={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entrenador/editar-rutina/:rutinaId"
          element={
            <ProtectedRoute>
              <CrearRutina fromEntrenador={true} />
            </ProtectedRoute>
          }
        />
        <Route path="/entrenador/rutinas-asignadas"
          element={
            <ProtectedRoute>
              <RutinasAsignadas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entrenador/ejercicios"
          element={
            <ProtectedRoute>
              <Ejercicios fromEntrenador={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entrenador/ejercicios/:id"
          element={
            <ProtectedRoute>
              <EjercicioDetail fromEntrenador={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entrenador/ejercicios/form/:id?"
          element={
            <ProtectedRoute>
              <EjercicioForm fromEntrenador={true} />
            </ProtectedRoute>
          }
        />
        <Route path="/entrenador/usuarios"
          element={
            <ProtectedRoute>
              <UsuariosList fromEntrenador={true} />
            </ProtectedRoute>
          }
        />
        <Route path="/entrenador/clases-actividades"
          element={
            <ProtectedRoute>
              <ClasesActividadesAdmin fromEntrenador={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entrenador/clases-actividades/:id"
          element={
            <ProtectedRoute>
              <ClasesActividadesAdminDetalle fromEntrenador={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entrenador/editar-clase/:id"
          element={
            <ProtectedRoute>
              <ClasesActividadesForm isEditing={true} fromEntrenador={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entrenador/cambiar-contrasena"
          element={
            <ProtectedRoute>
              <ChangePassword fromAdmin={false} fromEntrenador={true} />
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
              <AgendarTurno />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/clases-actividades"
          element={
            <ProtectedRoute>
              <ClasesActividades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/clases-actividades/:id"
          element={
            <ProtectedRoute>
              <ClasesActividadesDetalle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/mi-rutina"
          element={
            <ProtectedRoute>
              <MiRutina />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/crear-rutina"
          element={
            <ProtectedRoute>
              <CrearRutina fromAdmin={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/editar-rutina/:rutinaId"
          element={
            <ProtectedRoute>
              <CrearRutina fromAdmin={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/ejercicios"
          element={
            <ProtectedRoute>
              <Ejercicios fromAlumno={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/ejercicios/:id"
          element={
            <ProtectedRoute>
              <EjercicioDetail fromAlumno={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/medicion-resultados"
          element={
            <ProtectedRoute>
              <MedicionResultados />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/medicion-resultados/nueva-medicion"
          element={
            <ProtectedRoute>
              <NuevaMedicion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/medicion-resultados/ejercicio/:id"
          element={
            <ProtectedRoute>
              <MedicionResultadosDetalle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/entrenadores"
          element={
            <ProtectedRoute>
              <Entrenadores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/rutinas-recomendadas"
          element={
            <ProtectedRoute>
              <RutinasRecomendadas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/cuotas"
          element={
            <ProtectedRoute>
              <Cuotas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumno/cambiar-contrasena"
          element={
            <ProtectedRoute>
              <ChangePassword fromAdmin={false} />
            </ProtectedRoute>
          }
        />

        {/* Ruta de error */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {showChat && <AsistenteChat />}
    </>
  );
}

export default App;
