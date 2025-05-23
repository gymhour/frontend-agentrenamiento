import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../App.css';
import './MedicionResultados.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import apiClient from '../../../axiosConfig';
import apiService from '../../../services/apiService';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import { ReactComponent as DeleteIcon } from '../../../assets/icons/trash.svg';

const MedicionResultados = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch de los ejercicios
  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const usuarioId = localStorage.getItem("usuarioId");
        const response = await apiService.getEjerciciosResultadosUsuario(usuarioId);
        setEjercicios(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEjercicios();
  }, []);

  // Función para obtener el máximo de cada ejercicio desde su historial
  const getMaxCantidad = (historico) => {
    if (!historico || historico.length === 0) return 0;
    return historico.reduce((max, item) => (item.Cantidad > max ? item.Cantidad : max), 0);
  };

  const handleDeleteEjercicio = (idEjercicio) => {
    try {
      const response = apiService.deleteEjercicio(idEjercicio)
      console.log(response);
    } catch (error) {
      console.log("Error al eliminar ejercicio", error)
    }
  }

  if (error) {
    return (
      <div className="page-layout">
        <SidebarMenu isAdmin={false} />
        <div className="content-layout">
          <p>Ocurrió un error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      {loading && <LoaderFullScreen/> }
      <SidebarMenu isAdmin={false} />
      <div className="content-layout">
        <div className="medicion-resultados-title">
          <h2>Medición de resultados</h2>
          <p>Lleva registro de tu progreso en el gimnasio. 💪🏻</p>
        </div>

        <div className="med-resultados-ejercicios-section">
          <div className="med-resultados-ejercicios-header">
            <h2>Ejercicios</h2>
            {/* Botón o link para agregar nuevo */}
            <PrimaryButton text="Agregar ejercicio" linkTo={"/alumno/medicion-resultados/nueva-medicion"} />
          </div>

          <div className="med-resultados-ejercicios-list">
            {!loading && ejercicios.length === 0 ? (
              <p className="no-ejercicios-message">
                No tienes ejercicios registrados. ¡Agrega uno para comenzar!
              </p>
            ) : (
              ejercicios.map((ejercicio) => {
                const maxCantidad = getMaxCantidad(ejercicio.HistoricoEjercicios);
                return (
                  <Link
                    key={ejercicio.ID_EjercicioMedicion}
                    to={`/alumno/medicion-resultados/ejercicio/${ejercicio.ID_EjercicioMedicion}`}
                    className="med-resultados-card"
                  >
                    <div className="med-resultados-card-content">
                      <div className="med-resultados-card-header">
                        <h3>
                          {maxCantidad}{' '}
                          {ejercicio.tipoMedicion === 'Cantidad' ? 'Reps' : 'kg'}
                        </h3>
                        <span>{ejercicio.tipoMedicion}</span>
                      </div>
                      <div className="med-resultados-card-body">
                        <p>{ejercicio.nombre}</p>
                      </div>
                      <button className='borrar-ejercicio-btn' onClick={() => handleDeleteEjercicio(ejercicio.ID_EjercicioMedicion)} >  <DeleteIcon width={20}/> </button>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicionResultados;