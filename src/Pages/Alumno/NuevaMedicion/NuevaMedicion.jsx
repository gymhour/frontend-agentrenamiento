import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import '../../../App.css';
import './NuevaMedicion.css';
import apiClient from '../../../axiosConfig';

const NuevaMedicion = () => {
  const [nombre, setNombre] = useState('');
  const [tipoMedicion, setTipoMedicion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar campos vacíos
    if (!nombre || !tipoMedicion || !cantidad || !fecha) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      // 1. Crear el nuevo ejercicio
      const responseEjercicio = await apiClient.get('/ejercicios-resultados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ID_Usuario: 32,        // <-- Ajusta el ID de usuario si es dinámico
          nombre: nombre,
          tipoMedicion: tipoMedicion
        })
      });

      if (!responseEjercicio.data) {
        throw new Error('Error al crear el ejercicio');
      }

      // Obtenemos la respuesta del ejercicio recién creado
      const nuevoEjercicio = await responseEjercicio.json();

      // 2. Crear el histórico inicial con la cantidad y fecha
      const responseHistorico = await apiClient('/historicoEjercicio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ID_EjercicioMedicion: nuevoEjercicio.ID_EjercicioMedicion,
          Cantidad: parseFloat(cantidad),
          Fecha: fecha
        })
      });

      // if (!responseHistorico.ok) {
      //   throw new Error('Error al registrar el histórico');
      // }

      // Si todo fue exitoso, redireccionamos a la lista principal de mediciones
      navigate('/alumno/medicion-resultados');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-layout">
      <SidebarMenu isAdmin={false} />
      <div className="content-layout nueva-medicion-container">
        <h2>Agregar nuevo ejercicio</h2>

        {error && <p className="error-message">{error}</p>}

        <form className="nueva-medicion-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del ejercicio</label>
            <input
              type="text"
              placeholder="Ej. Press Banca"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Medida (1RM, 3RM, Repeticiones, etc.)</label>
            <input
              type="text"
              placeholder="Ej. 1RM, 5RM, Cantidad, etc."
              value={tipoMedicion}
              onChange={(e) => setTipoMedicion(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Cantidad máxima actual</label>
            <input
              type="number"
              placeholder="Ej. 100 (kg) o 20 (reps)"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Día</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-agregar">
            Agregar
          </button>
        </form>
      </div>
    </div>
  );
};

export default NuevaMedicion;
