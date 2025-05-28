import React, { useState, useEffect } from 'react';
import '../../../App.css';
import './agendarTurno.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown';
import apiService from '../../../services/apiService';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mapeo de días en español a índices de Date.getDay()
const mapping = {
  "Domingo": 0,
  "Lunes": 1,
  "Martes": 2,
  "Miércoles": 3,
  "Jueves": 4,
  "Viernes": 5,
  "Sábado": 6,
};

const AgendarTurno = () => {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClase, setSelectedClase] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isAgendando, setIsAgendando] = useState(false);

  useEffect(() => {
    const fetchClases = async () => {
      setLoading(true);
      try {
        const clasesApi = await apiService.getClases();
        setClases(clasesApi);
        console.log("Clases API:", clasesApi);
      } catch (err) {
        toast.error("Error al cargar las clases. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchClases();
  }, []);

  const clasesOptions = clases.map((clase) => clase.nombre);

  // Filtra las fechas permitidas: solo entre hoy y +7 días y días permitidos según la clase
  const filterDate = (date) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);
    if (date < today || date > maxDate) return false;
    if (selectedClase) {
      const claseSeleccionada = clases.find((clase) => clase.nombre === selectedClase);
      if (claseSeleccionada) {
        const allowedDays = claseSeleccionada.HorariosClase.map(h => mapping[h.diaSemana]);
        return allowedDays.includes(date.getDay());
      }
    }
    return true;
  };

  // Filtra las horas disponibles según el horario de la clase para el día seleccionado
  const filterTime = (time) => {
    if (!selectedClase || !selectedDateTime) return true;
    const selectedDay = selectedDateTime.getDay();
    const claseSeleccionada = clases.find(clase => clase.nombre === selectedClase);
    if (!claseSeleccionada) return true;
    const scheduleForDay = claseSeleccionada.HorariosClase.find(h => mapping[h.diaSemana] === selectedDay);
    if (!scheduleForDay) return false;
    const startTime = new Date(time);
    const endTime = new Date(time);
    const horaInicio = new Date(scheduleForDay.horaIni);
    const horaFin = new Date(scheduleForDay.horaFin);
    startTime.setHours(horaInicio.getHours(), horaInicio.getMinutes(), 0, 0);
    endTime.setHours(horaFin.getHours(), horaFin.getMinutes(), 0, 0);
    return time >= startTime && time <= endTime;
  };

  // Genera un array de horarios permitidos en intervalos de 15 minutos para el día seleccionado
  const getAllowedTimes = (date) => {
    if (!date || !selectedClase) return [];
    const selectedDay = date.getDay();
    const claseSeleccionada = clases.find(clase => clase.nombre === selectedClase);
    if (!claseSeleccionada) return [];
    
    const scheduleForDay = claseSeleccionada.HorariosClase.find(
      h => mapping[h.diaSemana] === selectedDay
    );
    if (!scheduleForDay) return [];
    
    const startTime = new Date(date);
    const endTime = new Date(date);
    const horaInicio = new Date(scheduleForDay.horaIni);
    const horaFin = new Date(scheduleForDay.horaFin);
    startTime.setHours(horaInicio.getHours(), horaInicio.getMinutes(), 0, 0);
    endTime.setHours(horaFin.getHours(), horaFin.getMinutes(), 0, 0);
    
    const times = [];
    const interval = 15; // minutos
    const currentTime = new Date(startTime);
    while (currentTime <= endTime) {
      times.push(new Date(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
    return times;
  };

  const manejarSeleccionClase = (e) => {
    const nombreClaseSeleccionada = e.target.value;
    setSelectedClase(nombreClaseSeleccionada);
    setSelectedDateTime(null); // Reiniciamos la fecha/hora al cambiar de clase
  };

  const manejarAgendarTurno = async () => {
    setLoading(true);

    if (!selectedClase || !selectedDateTime) {
      toast.error("Por favor, selecciona una clase y un turno (fecha y hora) disponibles.");
      return;
    }

    const usuarioId = localStorage.getItem("usuarioId");
    if (!usuarioId) {
      toast.error("Usuario no autenticado.");
      return;
    }

    const claseSeleccionada = clases.find((clase) => clase.nombre === selectedClase);
    if (!claseSeleccionada) {
      toast.error("Clase seleccionada no válida.");
      return;
    }

    const day = selectedDateTime.getDay();
    const scheduleForDay = claseSeleccionada.HorariosClase.find(h => mapping[h.diaSemana] === day);
    if (!scheduleForDay) {
      toast.error("No hay horario disponible para ese día.");
      return;
    }

    const body = {
      ID_Usuario: parseInt(usuarioId, 10),
      ID_HorarioClase: scheduleForDay.ID_HorarioClase,
      fecha: selectedDateTime.toISOString(),
    };

    setIsAgendando(true);
    try {
      const respuesta = await apiService.postTurno(body);
      setLoading(false);
      toast.success("Turno agendado exitosamente.");
    } catch (err) {
      setLoading(false)
      toast.error("Hubo un error al agendar el turno. Intente nuevamente.");
    } finally {
      setIsAgendando(false);
    }
  };

  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={false} />
      <div className='content-layout'>
        {/* Toast en modo oscuro */}
        <ToastContainer theme="dark" />
        <h2>Agendar turno</h2>
        <div className="agendar-turno-ctn">
          {!loading && (
            <CustomDropdown
              options={clasesOptions}
              value={selectedClase}
              onChange={manejarSeleccionClase}
              placeholderOption='Clase'
            />
          )}

          <div className="datepicker-container">
            <DatePicker
              selected={selectedDateTime}
              onChange={(date) => setSelectedDateTime(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              filterDate={filterDate}
              includeTimes={selectedDateTime ? getAllowedTimes(selectedDateTime) : []}
              minDate={new Date()}
              maxDate={(() => {
                const d = new Date();
                d.setDate(d.getDate() + 7);
                return d;
              })()}
              placeholderText="Selecciona fecha y hora"
              className="custom-date-picker-input"
              disabled={!selectedClase}
            />
          </div>

          <PrimaryButton 
            onClick={manejarAgendarTurno} 
            text={isAgendando ? 'Agendando...' : 'Agendar turno'} 
          />
        </div>
      </div>
    </div>
  );
};

export default AgendarTurno;