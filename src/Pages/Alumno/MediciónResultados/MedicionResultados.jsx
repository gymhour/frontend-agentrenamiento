import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../App.css';
import './MedicionResultados.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';

const MedicionResultados = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch de los ejercicios
  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await fetch('https://gymbackend-qr97.onrender.com/ejercicios-resultados');
        if (!response.ok) {
          throw new Error('Error al obtener la lista de ejercicios');
        }
        const data = await response.json();
        setEjercicios(data);
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
            <Link
              to="/alumno/medicion-resultados/nueva-medicion"
              className="btn-agregar-nuevo"
            >
              Agregar nuevo
            </Link>
          </div>

          <div className="med-resultados-ejercicios-list">
            {ejercicios.map((ejercicio) => {
              const maxCantidad = getMaxCantidad(ejercicio.HistoricoEjercicios);
              return (
                <Link
                  key={ejercicio.ID_EjercicioMedicion}
                  to={`/alumno/medicion-resultados/ejercicio/${ejercicio.ID_EjercicioMedicion}`}
                  className="med-resultados-card"
                >
                  <div className="med-resultados-card-content">
                    {/* Muestra la cantidad máxima y el tipo de medición */}
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
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicionResultados;