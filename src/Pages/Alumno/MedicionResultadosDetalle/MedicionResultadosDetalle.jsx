import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import '../../../App.css';
import './MedicionResultadosDetalle.css';

/* Importamos componentes de Recharts (opcional) */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const MedicionResultadosDetalle = () => {
  const { id } = useParams(); // ID del ejercicio en la ruta
  const [ejercicio, setEjercicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el mini-formulario
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');

  // 1. Cargar todos los ejercicios y filtrar por ID
  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await fetch('https://gymbackend-qr97.onrender.com/ejercicios-resultados');
        if (!response.ok) {
          throw new Error('Error al obtener los ejercicios');
        }
        const data = await response.json();
        // Filtramos el ejercicio que coincide con el ID de la URL
        const foundEjercicio = data.find(
          (item) => item.ID_EjercicioMedicion === parseInt(id)
        );
        if (!foundEjercicio) {
          throw new Error('No se encontró el ejercicio');
        }
        setEjercicio(foundEjercicio);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEjercicios();
  }, [id]);

  // 2. Función para agregar un nuevo resultado (POST /historicoEjercicio)
  const handleAgregarResultado = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nuevaCantidad || !nuevaFecha) {
      setError('Por favor completa todos los campos para agregar un nuevo resultado.');
      return;
    }

    try {
      const response = await fetch('https://gymbackend-qr97.onrender.com/historicoEjercicio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ID_EjercicioMedicion: parseInt(id),
          Cantidad: parseFloat(nuevaCantidad),
          Fecha: nuevaFecha
        })
      });

      if (!response.ok) {
        throw new Error('Error al agregar el nuevo resultado');
      }

      // Si se agregó correctamente, actualizamos el estado local para ver el nuevo resultado
      const newHistorico = {
        // Podríamos tomar el ID del histórico que devuelva la API si es que responde con el objeto creado
        ID_HistoricoEjercicio: Date.now(), // Valor temporal
        Fecha: nuevaFecha,
        Cantidad: parseFloat(nuevaCantidad),
        ID_EjercicioMedicion: parseInt(id)
      };

      setEjercicio((prev) => ({
        ...prev,
        HistoricoEjercicios: [...prev.HistoricoEjercicios, newHistorico]
      }));

      // Limpiamos campos del formulario
      setNuevaCantidad('');
      setNuevaFecha('');
    } catch (err) {
      setError(err.message);
    }
  };

  // 3. Renderizado condicional de carga y error
  if (loading) {
    return (
      <div className="page-layout">
        <SidebarMenu isAdmin={false} />
        <div className="content-layout">
          <p>Cargando detalle del ejercicio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-layout">
        <SidebarMenu isAdmin={false} />
        <div className="content-layout">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  // 4. Preparar datos para el gráfico
  // Ordenamos por fecha y transformamos a un formato para Recharts
  const sortedHistorico = [...ejercicio.HistoricoEjercicios].sort(
    (a, b) => new Date(a.Fecha) - new Date(b.Fecha)
  );

  const dataChart = sortedHistorico.map((item) => {
    return {
      fecha: new Date(item.Fecha).toLocaleDateString(),
      cantidad: item.Cantidad
    };
  });

  return (
    <div className="page-layout">
      <SidebarMenu isAdmin={false} />
      <div className="content-layout detalle-container">
        {/* Encabezado */}
        <div className="detalle-header">
          <h1>
            {ejercicio.nombre} - {ejercicio.tipoMedicion}
          </h1>
        </div>

        {/* Mini formulario para agregar un nuevo resultado */}
        <div className="detalle-form">
          <h3>Agregar nuevo resultado</h3>
          <form onSubmit={handleAgregarResultado}>
            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
              <label>Cantidad máxima actual</label>
              <input
                type="number"
                placeholder="Ej. 108 (kg) o 40 (reps)"
                value={nuevaCantidad}
                onChange={(e) => setNuevaCantidad(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Día</label>
              <input
                type="date"
                value={nuevaFecha}
                onChange={(e) => setNuevaFecha(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-agregar">
              Agregar
            </button>
          </form>
        </div>

        {/* Gráfico */}
        <div className="detalle-grafico">
          <h3>Historial</h3>
          {sortedHistorico.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#e63946" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay datos en el historial</p>
          )}
        </div>

        {/* Tabla con el historial */}
        <div className="detalle-tabla">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>{ejercicio.tipoMedicion === 'Cantidad' ? 'Reps' : 'Kg'}</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistorico.map((item) => (
                <tr key={item.ID_HistoricoEjercicio}>
                  <td>{new Date(item.Fecha).toLocaleDateString()}</td>
                  <td>{item.Cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MedicionResultadosDetalle;