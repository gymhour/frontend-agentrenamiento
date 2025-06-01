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
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';

const NuevaMedicion = () => {
  const [nombre, setNombre] = useState('');
  const [tipoMedicion, setTipoMedicion] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Validar campos vacíos
    if (!nombre || !tipoMedicion || !cantidad || !fecha) {
      toast.error('Por favor completa todos los campos.');
      setLoading(false);
      return;
    }
  
    try {
      const bodyEjercicio = {
        ID_Usuario: localStorage.getItem('usuarioId'),
        nombre: nombre,
        tipoMedicion: tipoMedicion,
      };
  
      // 1. Crear el nuevo ejercicio
      const responseEjercicio = await apiService.postEjercicio(bodyEjercicio);
      // Supongamos que apiService usa axios y hace algo como axios.post('/ejercicios', data)
  
      if (responseEjercicio.status !== 201) {
        throw new Error('Error al crear el ejercicio. Por favor, intente nuevamente.');
      }
  
      // Obtenemos el objeto creado
      const nuevoEjercicio = responseEjercicio.data;
      const { ID_EjercicioMedicion } = nuevoEjercicio;
  
      // 2. Crear el histórico inicial con la cantidad y fecha — usando Axios correctamente
      const historicoPayload = {
        ID_EjercicioMedicion: ID_EjercicioMedicion,
        Cantidad: parseFloat(cantidad),
        Fecha: fecha,
      };
  
      const responseHistorico = await apiClient.post(
        '/historicoEjercicio',
        historicoPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (responseHistorico.status !== 201 && responseHistorico.status !== 200) {
        // Ajusta según tu API (puede devolver 200 o 201)
        throw new Error('Error al registrar el histórico');
      }
  
      // Mostrar mensaje de éxito y redireccionar
      toast.success('Se agregó el ejercicio correctamente.');
      navigate('/alumno/medicion-resultados');
    } catch (err) {
      toast.error(err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-layout">
      {loading && <LoaderFullScreen/>}
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
            {/* <CustomInput
              placeholder="ej. Press Banca"
              width="350px"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            /> */}
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
