import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import '../../../App.css';
import './NuevaMedicion.css';
import apiClient from '../../../axiosConfig';
import apiService from '../../../services/apiService';
import { toast } from 'react-toastify';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import { ReactComponent as ArrowLeftIcon } from '../../../assets/icons/arrow-right.svg';

const NuevaMedicion = () => {
  const [nombre, setNombre] = useState('');
  const [tipoMedicion, setTipoMedicion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validar campos vacíos
    if (!nombre || !tipoMedicion || !cantidad || !fecha) {
      setError('Por favor completa todos los campos.');
      toast.error(error)
      return;
    }

    try {
      let body = {
        ID_Usuario: localStorage.getItem("usuarioId"),
        nombre: nombre,
        tipoMedicion: tipoMedicion
      }
      // 1. Crear el nuevo ejercicio
      const responseEjercicio = await apiService.postEjercicio(body);

      if (!responseEjercicio) {
        toast.error("Error al crear el ejercicio. Por favor, intente nuevamente.")
      } else {
        toast.success("Se agregó el ejercicio correctamente.")
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
        <SecondaryButton linkTo="/alumno/medicion-resultados" text="Volver atrás" icon={ArrowLeftIcon} reversed={true}/>
        <h2>Agregar nuevo ejercicio</h2>
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
