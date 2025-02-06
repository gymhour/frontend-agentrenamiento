import React, { useState, useEffect } from 'react';
import '../../../App.css';
import './agendarTurno.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import apiService from '../../../services/apiService';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';

const AgendarTurno = () => {
  const [clases, setClases] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedClase, setSelectedClase] = useState('');
  const [selectedDia, setSelectedDia] = useState('');
  const [selectedHorario, setSelectedHorario] = useState('');
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  useEffect(() => {
    const fetchClases = async () => {
      setLoading(true);
      try {
        const clasesApi = await apiService.getClases();
        setClases(clasesApi);
        console.log("Clases API:", clasesApi);
      } catch (err) {
        setError("Error al cargar las clases. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchClases();
  }, []);

  const clasesOptions = clases.map((clase) => clase.nombre);

  const formatearHora = (horaString) => {
    const fecha = new Date(horaString);
    const opciones = {
      hour: '2-digit',
      minute: '2-digit',
    };
    return fecha.toLocaleTimeString([], opciones);
  };

  const manejarSeleccionClase = (e) => {
    const nombreClaseSeleccionada = e.target.value;
    setSelectedClase(nombreClaseSeleccionada);
    setSelectedDia('');
    setSelectedHorario('');
    setHorariosDisponibles([]);

    const claseSeleccionada = clases.find((clase) => clase.nombre === nombreClaseSeleccionada);

    if (claseSeleccionada) {
      console.log("Clase seleccionada:", claseSeleccionada);
      const dias = claseSeleccionada.HorariosClase.map(h => h.diaSemana);
      const diasUnicos = [...new Set(dias)];
      setDiasDisponibles(diasUnicos);
    }
  };

  const manejarSeleccionDia = (e) => {
    const diaSeleccionado = e.target.value;
    setSelectedDia(diaSeleccionado);
    setSelectedHorario('');

    const claseSeleccionada = clases.find((clase) => clase.nombre === selectedClase);
    if (claseSeleccionada) {
      const horariosFiltrados = claseSeleccionada.HorariosClase
        .filter(h => h.diaSemana === diaSeleccionado)
        .map(h => ({
          id: h.ID_HorarioClase,
          inicio: formatearHora(h.horaIni),
          fin: formatearHora(h.horaFin),
        }));
      setHorariosDisponibles(horariosFiltrados);
    }
  };

  const manejarSeleccionHorario = (e) => {
    setSelectedHorario(e.target.value);
  };

  const manejarAgendarTurno = async () => {
    // Validamos que se haya seleccionado clase, día y horario
    if (!selectedClase || !selectedDia || !selectedHorario) {
      setError("Por favor, selecciona una clase, un día y un horario.");
      return;
    }

    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) {
      setError("Usuario no autenticado.");
      return;
    }

    const claseSeleccionada = clases.find((clase) => clase.nombre === selectedClase);
    if (!claseSeleccionada) {
      setError("Clase seleccionada no válida.");
      return;
    }

    // Encontrar el horario seleccionado basándonos en la cadena mostrada y el día seleccionado
    const horarioSeleccionado = claseSeleccionada.HorariosClase.find(h => {
      const horaInicio = formatearHora(h.horaIni);
      const horaFin = formatearHora(h.horaFin);
      return `${horaInicio} - ${horaFin}` === selectedHorario && h.diaSemana === selectedDia;
    });

    if (!horarioSeleccionado) {
      setError("Horario seleccionado no válido.");
      return;
    }

    // Se arma el body para el POST
    const body = {
      ID_Usuario: parseInt(usuarioId, 10),
      ID_HorarioClase: horarioSeleccionado.ID_HorarioClase,
      // Se envía la fecha actual en formato ISO. Podrías modificarla según el día que el usuario haya seleccionado.
      fecha: new Date().toISOString(),
    };

    try {
      // Se realiza la llamada al endpoint para crear el turno
      const respuesta = await apiService.postTurno(body);
      setSuccessMessage("Turno agendado exitosamente.");
      setError("");  // Limpiar mensaje de error
      console.log("Respuesta de la API:", respuesta);
    } catch (err) {
      console.error(err);
      setError("Hubo un error al agendar el turno. Intente nuevamente.");
      setSuccessMessage("");  // Limpiar mensaje de éxito
    }
  };

  return (
    <div className='page-layout'>
      <SidebarMenu isAdmin={false}/>
      <div className='content-layout'>
        <h2> Agendar turno </h2>
        <div className="agendar-turno-ctn">
          {loading && <div>Cargando clases...</div>}
          
          {!loading && (
            <CustomDropdown 
              options={clasesOptions} 
              value={selectedClase} 
              onChange={manejarSeleccionClase}
              placeholderOption='Clase'
            />
          )}

          {diasDisponibles.length > 0 && (
            <CustomDropdown
              options={diasDisponibles}
              value={selectedDia}
              onChange={manejarSeleccionDia}
              placeholderOption="Selecciona el día"
            />
          )}

          {horariosDisponibles.length > 0 && (
            <CustomDropdown
              options={horariosDisponibles.map((horario) => `${horario.inicio} - ${horario.fin}`)}
              value={selectedHorario}
              onChange={manejarSeleccionHorario}
              placeholderOption="Selecciona la hora"
            />
          )}

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <PrimaryButton onClick={manejarAgendarTurno} text="Agendar turno"/>
        </div>
      </div>
    </div>
  );
}

export default AgendarTurno;