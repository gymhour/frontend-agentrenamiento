// src/pages/Cuotas/Cuotas.jsx
import React, { useEffect, useState } from 'react';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import './Cuotas.css';
import axios from 'axios';
import { ReactComponent as GaliciaIcon } from '../../../assets/icons/galicia_logo.svg';

const Cuotas = () => {
  const [cuotas, setCuotas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatMonth = (m) =>
    m
      ? new Date(m + '-01').toLocaleString('es-AR', {
          month: 'long',
          year: 'numeric',
        })
      : '–';

  // Helper: formatea ISO a DD/MM/AAAA en es-AR
  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('es-AR') : '–';

  // Helper: formatea número a ARS
  const formatCurrency = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(val);

  useEffect(() => {
    const fetchCuotas = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          'https://gym-backend-rust.vercel.app/cuotas/usuario/16/cuotas'
        );
        setCuotas(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Error al cargar las cuotas.');
      } finally {
        setLoading(false);
      }
    };

    fetchCuotas();
  }, []);

  return (
    <div className="page-layout">
      <SidebarMenu isAdmin={false} />

      <div className="content-layout">
        <h2>Cuotas</h2>

        <div className="cuotas-datos-pagos">
          <h3>Datos de cuenta</h3>
          <span style={{ fontWeight: '600' }}>
            BRISA PRISCILA RAMOS <GaliciaIcon width="120" />
          </span>
          <span>
            <b>ALIAS:</b> bpramos.gal
          </span>
          <span>
            <b>CBU:</b> 00700238-30004046522411
          </span>
          <span>
            <b>CUIL:</b> 27-44851911-8
          </span>
          <span>
            <b>CTA:</b> 4046522-4 023-1
          </span>
        </div>

        {loading ? (
          <p>Cargando cuotas...</p>
        ) : error ? (
          <p className="text-error">{error}</p>
        ) : cuotas.length === 0 ? (
          <p>No hay cuotas para mostrar.</p>
        ) : (
          <table className="cuotas-table cuotas-table-usuario" >
            <thead>
              <tr>
                <th>Mes</th>
                <th>Importe</th>
                <th>Vence</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Forma de Pago</th>
                <th>Fecha Pago</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((c) => (
                <tr key={c.ID_Cuota}>
                  <td style={{textTransform: 'uppercase'}}>{formatMonth(c.mes)}</td>
                  <td>{formatCurrency(c.importe)}</td>
                  <td>{formatDate(c.vence)}</td>
                  <td>{c.plan}</td>
                  <td>
                    <span
                      className={`badge ${c.pagada ? 'paid' : 'pending'}`}
                    >
                      {c.pagada ? 'Pagada' : 'Pendiente'}
                    </span>
                  </td>
                  <td>{c.formaPago || '–'}</td>
                  <td>{formatDate(c.fechaPago)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Cuotas;
