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
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('es', es);

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
    const now = new Date();

    const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const maxDateRaw = new Date();
    maxDateRaw.setDate(now.getDate() + 7);
    const maxDateOnly = new Date(
      maxDateRaw.getFullYear(),
      maxDateRaw.getMonth(),
      maxDateRaw.getDate()
    );

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (dateOnly < todayOnly || dateOnly > maxDateOnly) {
      return false;
    }

    if (selectedClase) {
      const clase = clases.find(c => c.nombre === selectedClase);
      if (!clase) return false;

      const allowedDays = clase.HorariosClase.map(h => mapping[h.diaSemana]);
      if (!allowedDays.includes(date.getDay())) {
        return false;
      }

      if (dateOnly.getTime() === todayOnly.getTime()) {
        const hasFutureSlot = clase.HorariosClase.some(h => {
          const utcInicio = new Date(h.horaIni);
          const localStart = new Date(dateOnly);
          localStart.setHours(
            utcInicio.getUTCHours(),
            utcInicio.getUTCMinutes(),
            0, 0
          );
          return localStart > now;
        });
        return hasFutureSlot;
      }

      return true;
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
    const utcHoraIni = new Date(scheduleForDay.horaIni);
    const utcHoraFin = new Date(scheduleForDay.horaFin);
    startTime.setHours(utcHoraIni.getUTCHours(), utcHoraIni.getUTCMinutes(), 0, 0);
    endTime.setHours(utcHoraFin.getUTCHours(), utcHoraFin.getUTCMinutes(), 0, 0);
    return time >= startTime && time <= endTime;
  };

  // Genera un array de horarios permitidos en intervalos de 15 minutos para el día seleccionado
  const getAllowedTimes = (date) => {
    if (!date || !selectedClase) return [];
    const dia = date.getDay();
    const clase = clases.find(c => c.nombre === selectedClase);
    if (!clase) return [];

    const horario = clase.HorariosClase
      .find(h => mapping[h.diaSemana] === dia);
    if (!horario) return [];

    // parse UTC y crear un Date local con la misma fecha + hora de inicio
    const utcInicio = new Date(horario.horaIni);
    const localStart = new Date(date);
    localStart.setHours(
      utcInicio.getUTCHours(),
      utcInicio.getUTCMinutes(),
      0, 0
    );

    return [localStart];
  };

  // al principio del archivo
  const formatLocalISO = (date) => {
    const pad = n => String(n).padStart(2, '0');
    return [
      date.getFullYear(),
      '-', pad(date.getMonth() + 1),
      '-', pad(date.getDate()),
      'T', pad(date.getHours()),
      ':', pad(date.getMinutes()),
      ':', pad(date.getSeconds())
    ].join('');
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
      fecha: formatLocalISO(selectedDateTime),
    };

    setIsAgendando(true);
    try {
      console.log("body que envio", body)
      const respuesta = await apiService.postTurno(body);
      setSelectedClase('');
      setSelectedDateTime(null);
      setLoading(false);
      toast.success("Turno agendado exitosamente.");
    } catch (err) {
      setLoading(false)
      console.log(err)
      toast.error(err.message);
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
        <h2 className='agendar-turno-title'>Agendar turno</h2>
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
              locale="es"                 // 👈 clave
              timeCaption="Hora"          // etiqueta del selector de hora
              placeholderText="Selecciona fecha y hora"
              filterDate={filterDate}
              includeTimes={selectedDateTime ? getAllowedTimes(selectedDateTime) : []}
              minDate={new Date()}
              maxDate={(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d; })()}
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