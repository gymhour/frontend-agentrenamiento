import React, { useState, useEffect } from 'react';
import '../../../App.css';
import './AdminInicio.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import apiService from '../../../services/apiService';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const AdminInicio = () => {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState({
    totalActiveUsers: 0,
    quotasPaidThisMonth: 0,
    quotasPendingThisMonth: 0
  });
  const [history, setHistory] = useState([]); 

  const getKPIs = async () => {
    setLoading(true);
    try {
      const response = await apiService.getKPIs();
      setKpi(response.kpi);
      setHistory(response.history || []);
    } catch (error) {
      console.error('Error al obtener los KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getKPIs();
  }, []);

  const chartData = history.map(item => ({
    mes: item.mes,
    totalPagado: item.totalPagado
  }));

  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={true} />

      <div className='content-layout'>
        <h2>Panel de Control</h2>

        <div className='cards-container'>
          <div className='card'>
            <h3>Clientes activos</h3>
            <p className='value'>{kpi.totalActiveUsers}</p>
          </div>
          <div className='card'>
            <h3>Pagos realizados</h3>
            <p className='value'>{kpi.quotasPaidThisMonth}</p>
          </div>
          <div className='card'>
            <h3>Pagos pendientes</h3>
            <p className='value'>{kpi.quotasPendingThisMonth}</p>
          </div>
        </div>

        <div className='chart-section'>
          <h3>Ingresos Mensuales</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalPagado" fill="#e63946" />
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