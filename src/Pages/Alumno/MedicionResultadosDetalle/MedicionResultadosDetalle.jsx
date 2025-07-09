import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import '../../../App.css';
import './MedicionResultadosDetalle.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import apiClient from '../../../axiosConfig';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-left.svg';
import apiService from '../../../services/apiService';
import { toast } from 'react-toastify';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';

const MedicionResultadosDetalle = () => {
  const { id } = useParams(); // ID del ejercicio en la ruta
  const [ejercicio, setEjercicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el mini-formulario
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState('');

  // util
  const parseDateString = (dateStr) => {
    // si viene con hora: “2025-05-10T14:00:00Z”
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }
    const parts = dateStr.split('-').map(Number);
    let year, month, day;

    if (parts[0] > 31) {
      // asumo YYYY-MM-DD
      [year, month, day] = parts;
    } else {
      // asumo DD-MM-YYYY
      [day, month, year] = parts;
    }

    return new Date(year, month - 1, day);
  };

  const formatAsLocalDate = (dateStr) =>
    parseDateString(dateStr).toLocaleDateString();


  // 1. Cargar todos los ejercicios y filtrar por ID
  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await apiClient.get('/ejercicios-resultados');
        if (!response.data) {
          throw new Error('Error al obtener los ejercicios');
        }
        const data = await response.data;
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
      toast.error('Por favor completa todos los campos para agregar un nuevo resultado.');
      return;
    }

    try {
      let body = {
        ID_EjercicioMedicion: parseInt(id),
        Cantidad: parseFloat(nuevaCantidad),
        Fecha: nuevaFecha
      }
      const response = await apiService.postEjercicioResultado(body);

      if (!response) {
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
      toast.success("Medición cargada correctamente.")
    } catch (err) {
      toast.error(err.message);
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
  const sortedHistorico = [...ejercicio.HistoricoEjercicios].sort(
    (a, b) => new Date(a.Fecha) - new Date(b.Fecha)
  );

  const dataChart = sortedHistorico.map((item) => ({
    fecha: formatAsLocalDate(item.Fecha),
    cantidad: item.Cantidad
  }));

  return (
    <div className="page-layout">
      <SidebarMenu isAdmin={false} />
      <div className="content-layout detalle-container">
        {/* Encabezado */}
        <div className="detalle-header">
          <SecondaryButton linkTo="/alumno/medicion-resultados" text="Volver atrás" icon={ArrowLeftIcon} reversed={true} />
          <h2> {ejercicio.nombre} - {ejercicio.tipoMedicion} </h2>
        </div>

        {/* Mini formulario para agregar un nuevo resultado */}
        <div className="detalle-form">
          <h3>Agregar nuevo resultado</h3>
          <form>
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

            <div className='nuevo-resultado-form-btns'>
              <PrimaryButton text="Agregar" onClick={handleAgregarResultado}/>
            </div>
          </form>
        </div>

        {/* Gráfico */}
        <div className="detalle-grafico">
          <h3>Historial</h3>
          {sortedHistorico.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataChart} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                {/* Gradiente igual al anterior */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e63946" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#e63946" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} stroke="#444" strokeDasharray="3 3" />

                <XAxis
                  dataKey="fecha"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#aaa", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#aaa", fontSize: 12 }}
                />

                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.7)" }}
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  }}
                  labelStyle={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}
                  itemStyle={{ color: "#fff", fontSize: 12 }}
                />

                <Bar
                  name="Cantidad"
                  dataKey="cantidad"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={75}
                  animationDuration={800}
                />
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
                  <td>{formatAsLocalDate(item.Fecha)}</td>
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