import React, { useState, useEffect, useMemo } from 'react'
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './TurnosAdmin.css'
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen'
import { toast } from 'react-toastify'
import CustomDropdown from '../../../Components/utils/CustomDropdown/CustomDropdown'

moment.locale('es') 

const localizer = momentLocalizer(moment)
const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = moment().month()

const TurnosAdmin = () => {
  const [rawTurnos, setRawTurnos] = useState([])
  const [loading, setLoading] = useState(true)

  // filtros
  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH)
  const [selectedClass, setSelectedClass] = useState('')

  // modal
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const closeModal = () => { setIsModalOpen(false); setSelectedEvent(null) }

  useEffect(() => {
    fetch('https://gym-backend-rust.vercel.app/turnos')
      .then(res => {
        if (!res.ok) {
            toast.error("Hubo un error al traer los turnos. Intente nuevamente.")
        }
        return res.json()
      })
      .then(data => setRawTurnos(data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  // opciones de filtro
  const monthOptions = useMemo(() => {
    return Array.from(new Set(rawTurnos.map(t => moment(t.fecha).month())))
      .sort()
      .map(m => ({ value: m, label: moment().month(m).format('MMMM YYYY') }))
  }, [rawTurnos])

  const classOptions = useMemo(() => {
    return Array.from(
      new Set(rawTurnos.map(t => t.HorarioClase.Clase.nombre))
    ).sort()
  }, [rawTurnos])

  const parseLocalISO = isoString => {
    const d = new Date(isoString)
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000)
  }
  
  const events = useMemo(() => {
    // 1) filtramos
    const filtrados = rawTurnos.filter(t =>
      selectedClass === '' || t.HorarioClase.Clase.nombre === selectedClass
    )
  
    // 2) reducimos a un objeto de grupos
    const grupos = filtrados.reduce((acc, t) => {
      // fecha base (día correcto)
      const fecha = new Date(t.fecha)
  
      // parseo de horaIni/horaFin en local
      const horaIni = parseLocalISO(t.HorarioClase.horaIni)
      const horaFin = parseLocalISO(t.HorarioClase.horaFin)
  
      // inyecto la horaIni en la fecha
      fecha.setHours(horaIni.getHours(), horaIni.getMinutes(), horaIni.getSeconds())
      const start = fecha
  
      // clono y le pongo horaFin
      const end = new Date(fecha)
      end.setHours(horaFin.getHours(), horaFin.getMinutes(), horaFin.getSeconds())
  
      const key = `${start.toISOString()}__${t.HorarioClase.Clase.nombre}`
  
      if (!acc[key]) {
        acc[key] = {
          id:    key,
          title: t.HorarioClase.Clase.nombre,
          start,
          end,
          users: []
        }
      }
      acc[key].users.push(`${t.User.nombre} ${t.User.apellido}`)
      return acc
    }, {})
  
    return Object.values(grupos)
  }, [rawTurnos, selectedClass])  

  const handleSelectEvent = ev => {
    setSelectedEvent(ev)
    setIsModalOpen(true)
  }

  // defaultDate: hoy si es el mes actual, o día 1 del mes seleccionado
  const initialDate =
    selectedMonth === CURRENT_MONTH
      ? new Date()
      : new Date(CURRENT_YEAR, selectedMonth, 1)

  return (
    <div className='page-layout turnos-admin'>
      <SidebarMenu isAdmin={true} />
      {loading && <LoaderFullScreen/>}
      <div className='content-layout'>
        <h2>Turnos – {moment().month(selectedMonth).format('MMMM YYYY')}</h2>

        <div className='filters'>
  <div className='filters-input-ctn'>
    <label>Mes: </label>
    <CustomDropdown
      options={monthOptions}                 // [{ value, label }]
      value={String(selectedMonth ?? '')}    // controlado
      onChange={e => setSelectedMonth(+e.target.value)}
      name="month"
      id="month"
      placeholderOption={null}               // sin placeholder
    />
  </div>

  <div className="filters-input-ctn">
    <label>Clase: </label>
    <CustomDropdown
      options={classOptions}                 // ["Musculación", "Boxeo", ...]
      value={selectedClass ?? ''}
      onChange={e => setSelectedClass(e.target.value)}
      name="class"
      id="class"
      placeholderOption="— Todas —"          // que se pueda elegir
      placeholderDisabled={false}
    />
  </div>
</div>


        <Calendar
          key={selectedMonth}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={['week']}
          step={60}
          timeslots={1}
          style={{ height: '75vh', margin: '24px 0' }}
          onSelectEvent={handleSelectEvent}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={initialDate}
          messages={{
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            allDay: 'Todo el día',
            week: 'Semana',
            day: 'Día',
            month: 'Mes',
            previous: 'Semana anterior',
            next: 'Semana siguiente',
            yesterday: 'Ayer',
            tomorrow: 'Mañana',
            today: 'Hoy',
            agenda: 'Agenda',
            noEventsInRange: 'No hay eventos en este rango.',
            showMore: total => `+ Ver más (${total})`,
          }}
        />
      </div>

      {/* Modal de reservas */}
      {isModalOpen && selectedEvent && (
        <div className="ta-modal" onClick={closeModal}>
          <div className="ta-modal-content" onClick={e => e.stopPropagation()}>
            <button className="ta-modal-close" onClick={closeModal}>×</button>
            <h4>Reservas para {selectedEvent.title}</h4>
            <ul>
              {selectedEvent.users.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default TurnosAdmin