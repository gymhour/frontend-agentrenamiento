import React, { useState, useEffect } from 'react';
import '../../../App.css';
import './AdminInicio.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import apiService from '../../../services/apiService';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import { ReactComponent as UsuariosIcon } from '../../../assets/icons/users_icon_luc.svg';
import { ReactComponent as IngresosIcon } from '../../../assets/icons/money-icon.svg';
import { ReactComponent as IngresosPendientesIcon } from '../../../assets/icons/pending-icon.svg';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const AdminInicio = () => {
  const [loading, setLoading] = useState(false);

  const [kpi, setKpi] = useState({
    totalActiveUsers: 0,
    quotasPaidThisMonth: 0,
    quotasPendingThisMonth: 0,
    totalAmountPaidThisMonth: 0,
    totalAmountPendingThisMonth: 0,
    quotasOverdue: 0,
    totalAmountOverdue: 0,
  });

  // historial completo desde API
  const [history, setHistory] = useState([]);

  // nombre para saludo
  const [nombreUsuario, setNombreUsuario] = useState("");

  const [showFilters, setShowFilters] = useState(false)

  // --- Estados para los inputs de filtro de rango de fechas (mes/año) ---
  const [inputStartDate, setInputStartDate] = useState(null); // Date
  const [inputEndDate, setInputEndDate] = useState(null); // Date

  // --- Estados para rango de fechas aplicados (después de hacer clic en "Aplicar filtros") ---
  const [filterStartDate, setFilterStartDate] = useState(null); // Date
  const [filterEndDate, setFilterEndDate] = useState(null); // Date

  // Función para solicitar KPIs y historial desde API
  const getKPIs = async () => {
    setLoading(true);
    try {
      const response = await apiService.getKPIs();
      // merge para tolerar APIs viejas que no envían los nuevos campos
      setKpi(prev => ({
        ...prev,
        ...(response?.kpi || {})
      }));
      setHistory(response.history || []);
    } catch (error) {
      console.error('Error al obtener los KPIs:', error);
      toast.error('Error al cargar KPIs');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener datos de usuario (para mostrar nombre)
  const getUser = async () => {
    setLoading(true);
    try {
      const response = await apiService.getUserById(localStorage.getItem("usuarioId"));
      if (response.tipo === "admin") {
        setNombreUsuario("Administrador");
      } else {
        setNombreUsuario(response.nombre || "");
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      toast.error("Error al obtener el usuario");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    getUser();
    getKPIs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper para formatear números como "$12.345"
  const currencyFormatter = (value) =>
    `$${Number(value || 0).toLocaleString('es-AR')}`;

  // Helper: convierte "YYYY-MM" en un Date => primer día del mes
  const parseMesToDate = (mesString) => {
    const [year, month] = mesString.split('-').map(Number);
    return new Date(year, month - 1, 1);
  };

  // Filtrar history en base a filterStartDate y filterEndDate
  const filteredHistory = history.filter(item => {
    if (!item.mes) return false;
    const itemDate = parseMesToDate(item.mes);
    if (filterStartDate && itemDate < filterStartDate) return false;
    if (filterEndDate && itemDate > filterEndDate) return false;
    return true;
  });

  // Mapear datos para el gráfico a partir de `filteredHistory`
  const chartData = filteredHistory.map(item => ({
    mes: item.mes,
    totalPagado: item.totalPagado
  }));

  // Función que se dispara al hacer clic en "Aplicar filtros"
  const applyFilters = () => {
    if (inputStartDate) {
      setFilterStartDate(new Date(inputStartDate.getFullYear(), inputStartDate.getMonth(), 1));
    } else {
      setFilterStartDate(null);
    }
    if (inputEndDate) {
      const y = inputEndDate.getFullYear();
      const m = inputEndDate.getMonth();
      const lastDay = new Date(y, m + 1, 0).getTime();
      setFilterEndDate(new Date(lastDay));
    } else {
      setFilterEndDate(null);
    }
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setInputStartDate(null);
    setInputEndDate(null);
    setFilterStartDate(null);
    setFilterEndDate(null);
  };

  const datePickerClass = 'custom-datepicker-mes';

  const currentMonthName = new Date().toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric'
  }).replace(' de', '');

  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={true} />

      <div className='content-layout'>
        <h2> ¡Hola, {nombreUsuario}! </h2>

        <div className='cards-container'>
          <div className='card'>
            <div className='card-text-ctn'>
              <UsuariosIcon
                width={20}
                height={20}
                fill='none'
                style={{ color: "#bfbfbf" }}
              />
              <h3>Clientes activos</h3>
            </div>
            <p className='value'>{kpi.totalActiveUsers}</p>
          </div>

          <div className='card'>
            <div className="card-text-ctn">
              <IngresosIcon
                width={20}
                height={20}
                fill='none'
                style={{ color: "#bfbfbf" }}
              />
              <h3>
                Cobros recibidos
                <span className="month-label">({currentMonthName})</span>
              </h3>
            </div>
            <p className='value'>
              {currencyFormatter(kpi.totalAmountPaidThisMonth)}
              <span style={{ fontWeight: 400, fontSize: '16px' }}>
                ({kpi.quotasPaidThisMonth})
              </span>
            </p>
          </div>

          <div className='card'>
            <div className="card-text-ctn">
              <IngresosPendientesIcon
                width={20}
                height={20}
                fill='none'
                style={{ color: "#bfbfbf" }}
              />
              <h3>
                Cobros pendientes
                <span className="month-label">({currentMonthName})</span>
              </h3>
            </div>
            <p className='value'>
              {currencyFormatter(kpi.totalAmountPendingThisMonth)}
              <span style={{ fontWeight: 400, fontSize: '16px' }}>
                ({kpi.quotasPendingThisMonth})
              </span>
            </p>
          </div>

          <div className='card'>
            <div className="card-text-ctn">
              <IngresosPendientesIcon
                width={20}
                height={20}
                fill='none'
                style={{ color: "#bfbfbf" }}
              />
              <h3>Monto en cuotas vencidas</h3>
            </div>
            <p className='value'>
              {currencyFormatter(kpi.totalAmountOverdue)}
            </p>
          </div>
            
          <div className='card'>
            <div className="card-text-ctn">
              <IngresosPendientesIcon
                width={20}
                height={20}
                fill='none'
                style={{ color: "#bfbfbf" }}
              />
              <h3>Cant. cuotas vencidas </h3>
            </div>
            <p className='value'>
              {kpi.quotasOverdue}
            </p>
          </div>
        </div>

        {/* === Sección del gráfico de barras === */}
        <div className='chart-section'>
          <h3>Ingresos Mensuales</h3>

          <div style={{ margin: '30px 0px' }}>
            <button
              className='toggle-filters-button'
              onClick={() => setShowFilters(prev => !prev)}
            >
              Filtros {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>

          {showFilters && (
            <div className='filters-container' style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div className='admin-inicio-filtros-inputs-ctn' style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>Desde (Mes/Año):</label>
                <ReactDatePicker
                  selected={inputStartDate}
                  onChange={date => setInputStartDate(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  placeholderText="MM/AAAA"
                  className='custom-datepicker-mes'
                />
              </div>
              <div className='admin-inicio-filtros-inputs-ctn' style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>Hasta (Mes/Año):</label>
                <ReactDatePicker
                  selected={inputEndDate}
                  onChange={date => setInputEndDate(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  placeholderText="MM/AAAA"
                  className='custom-datepicker-mes'
                />
              </div>
              <div className='admin-inicio-filtros-btns-ctn' style={{ display: 'flex', gap: '10px' }}>
                <PrimaryButton
                  onClick={applyFilters}
                  text="Aplicar filtros"
                />
                <SecondaryButton
                  onClick={clearFilters}
                  text="Limpiar filtros"
                />
              </div>
            </div>
          )}

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e63946" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#e63946" stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} stroke="#444" strokeDasharray="3 3" />

                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#aaa", fontSize: 12 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#aaa", fontSize: 12 }}
                  tickFormatter={currencyFormatter}
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
                  formatter={(value, name) => [currencyFormatter(value), name]}
                />

                <Bar
                  dataKey="totalPagado"
                  name="Ingresos"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  barSize={75}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay datos de historial.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInicio;