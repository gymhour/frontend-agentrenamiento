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
import { toast } from 'react-toastify';

const AdminInicio = () => {
  const [loading, setLoading] = useState(false);
  const [kpi, setKpi] = useState({
    totalActiveUsers: 0,
    quotasPaidThisMonth: 0,
    quotasPendingThisMonth: 0,
    totalAmountPaidThisMonth: 0,
    totalAmountPendingThisMonth: 0,
  });
  const [history, setHistory] = useState([]); 
  const [nombreUsuario, setNombreUsuario] = useState("");

  const getKPIs = async () => {
    setLoading(true);
    try {
      const response = await apiService.getKPIs();
      setKpi(response.kpi);
      setHistory(response.history || []);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los KPIs:', error);
      setLoading(false);
    }
  };

  const getUser = async () => {
    setLoading(true)
    try {
      const response = await apiService.getUserById(localStorage.getItem("usuarioId"));
      if (response.tipo = "admin") {
        setNombreUsuario("Administrador")
      }
      setLoading(false)
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      toast.error("Error al obtener el usuario")
      setLoading(false)
    } 
  }

  useEffect(() => {
    getUser();
    getKPIs();
  }, []);

  // mapeo de datos para el gráfico
  const chartData = history.map(item => ({
    mes: item.mes,
    totalPagado: item.totalPagado
  }));

  // helper para formatear números como $12.345
  const currencyFormatter = (value) =>
    `$${value.toLocaleString('es-AR')}`;

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
              <h3>Cobros recibidos</h3>
            </div>
            {/* formateo de moneda en cards */}
            <p className='value'>
              {currencyFormatter(kpi.totalAmountPaidThisMonth)}
              <span style={{fontWeight: 400, fontSize: '16px'}}> ({kpi.quotasPaidThisMonth}) </span>
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
              <h3>Cobros pendientes</h3>
            </div>
            {/* formateo de moneda en cards */}
            <p className='value'>
              {currencyFormatter(kpi.totalAmountPendingThisMonth)}
              <span style={{fontWeight: 400, fontSize: '16px'}}> ({kpi.quotasPendingThisMonth}) </span>
            </p>
          </div>
        </div>

        <div className='chart-section'>
          <h3>Ingresos Mensuales</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="barGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#e63946"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor="#e63946"
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="#444"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#aaa", fontSize: 12 }}
                />

                {/* 1) Formateo de las etiquetas del eje Y */}
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#aaa", fontSize: 12 }}
                  tickFormatter={currencyFormatter}
                />

                {/* 2) Formateo del valor que se muestra en el tooltip */}
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.7)" }}
                  contentStyle={{
                    backgroundColor: "#000",   // negro puro
                    border: "none",
                    borderRadius: "8px",       // tooltip redondeado
                    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  }}
                  labelStyle={{
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "bold"
                  }}
                  itemStyle={{ color: "#fff", fontSize: 12 }}
                  formatter={(value, name) => [
                    currencyFormatter(value),
                    name
                  ]}
                />

                <Bar
                  dataKey="totalPagado"
                  name="Ingresos"               // así sale el título en el tooltip
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