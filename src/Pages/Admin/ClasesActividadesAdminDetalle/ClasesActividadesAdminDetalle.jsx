import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../../App.css';
import SidebarMenu from '../../../Components/SidebarMenu/SidebarMenu';
import SecondaryButton from '../../../Components/utils/SecondaryButton/SecondaryButton';
import PrimaryButton from '../../../Components/utils/PrimaryButton/PrimaryButton';
import ConfirmationPopup from '../../../Components/utils/ConfirmationPopUp/ConfirmationPopUp';
import { toast } from "react-toastify";
import { ArrowLeft } from 'lucide-react';
import apiClient from '../../../axiosConfig';
import LoaderFullScreen from '../../../Components/utils/LoaderFullScreen/LoaderFullScreen';

const ClasesActividadesAdminDetalle = ({ fromAdmin, fromEntrenador }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claseDetalle, setClaseDetalle] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const defaultAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s";
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchClaseDetalle = async () => {
      try {
        const response = await apiClient.get(`/clase/horario/${id}`);
        setClaseDetalle(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles de la clase:", error);
      }
    };
    fetchClaseDetalle();
  }, [id]);

  const deleteClase = async () => {
    setLoading(true);
    try {
      await apiClient.delete(`/clase/horario/${id}`);
      toast.success("Clase eliminada correctamente.");
      navigate("/admin/clases-actividades");
      setLoading(false);
    } catch (error) {
      setLoading(false)
      toast.error("Hubo un error al eliminar la clase.");
      console.error('Error al eliminar la clase - ClasesActividadesAdminDetalle.jsx', error);
    }
  };

  const handleDeleteClick = () => setIsPopupOpen(true);
  const handlePopupConfirm = () => {
    setIsPopupOpen(false);
    deleteClase();
  };
  const handlePopupClose = () => setIsPopupOpen(false);

  if (!claseDetalle) {
    return (
      <div className='page-layout'>
        <SidebarMenu isAdmin={fromAdmin} isEntrenador={fromEntrenador} />
        <div className='content-layout'>
          <p>Cargando detalles de la clase...</p>
        </div>
      </div>
    );
  }

  // Permito editar al admin o a los entrenadores que dan la clase
  const usuarioId = Number(localStorage.getItem("usuarioId"));
  const isEntrenadorClase = claseDetalle.Entrenadores
    .some(ent => ent.ID_Usuario === usuarioId);
  const canEdit = fromAdmin || isEntrenadorClase;

  const isActive = (val) => val === true || val === 1 || val === '1' || val === 'true';
  const horariosActivos = (claseDetalle?.HorariosClase ?? []).filter(h => isActive(h?.activo));

  const diasOrdenados = ['Lunes', 'Martes', 'Miércoles', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Sabado', 'Domingo'];

  const horariosPorDia = horariosActivos.reduce((acc, curr) => {
    const dia = curr.diaSemana;
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(curr);
    return acc;
  }, {});

  const diasDisponibles = Object.keys(horariosPorDia).sort(
    (a, b) => diasOrdenados.indexOf(a) - diasOrdenados.indexOf(b)
  );

  diasDisponibles.forEach(dia => {
    horariosPorDia[dia].sort((a, b) => {
      const timeA = new Date(a.horaIni).getTime();
      const timeB = new Date(b.horaIni).getTime();
      return timeA - timeB;
    });
  });

  return (
    <div className='page-layout'>
      {loading && <LoaderFullScreen />}
      <SidebarMenu isAdmin={fromAdmin} isEntrenador={fromEntrenador} />
      <div className='content-layout'>
        <div className="clases-actividades-detalle-ctn">
          <div className="clases-actividades-detalle-title">
            <div className='clases-actividades-detalle-actions'>
              <SecondaryButton
                text="Clases y actividades"
                linkTo={fromAdmin ? "/admin/clases-actividades" : "/entrenador/clases-actividades"}
                icon={ArrowLeft}
                reversed={true}
              />
              <div className='clases-actividades-detalle-actions-edit-delete'>
                {canEdit && (
                  <PrimaryButton
                    text="Editar clase"
                    linkTo={
                      fromAdmin
                        ? `/admin/editar-clase/${id}`
                        : `/entrenador/editar-clase/${id}`
                    }
                  />
                )
                }
                {
                  fromAdmin && <SecondaryButton text="Eliminar clase" onClick={handleDeleteClick} />
                }
              </div>
            </div>
            <div
              className="clases-actividades-detalle-title-img"
              style={{
                backgroundImage: `url(${claseDetalle.imagenClase != null
                  ? claseDetalle.imagenClase
                  : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGhlJTIwZ3ltfGVufDB8fDB8fHww'
                  })`
              }}
            >
              <h2>{claseDetalle.nombre}</h2>
            </div>
          </div>

          <div className="clases-actividades-detalle-info">
            {/* Descripción */}
            <div className="clases-actividades-item clases-actividades-detalle-info-descripcion">
              <h2>Descripción</h2>
              <p>{claseDetalle.descripcion}</p>
            </div>

            <div className="clases-actividades-item clases-actividades-detalle-info-horario">
              <h2>Horarios</h2>
              {diasDisponibles.length > 0 ? (
                <div className="horarios-agrupados-ctn">
                  {diasDisponibles.map((dia) => (
                    <div key={dia} className="horario-dia-bloque">
                      <h4 className="horario-dia-titulo">{dia}</h4>
                      <div className="horario-badges-ctn">
                        {horariosPorDia[dia].map((horario) => (
                          <span key={horario.ID_HorarioClase} className="horario-badge">
                            {horario.horaIni.slice(11, 16)} - {horario.horaFin.slice(11, 16)} hs
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay horarios disponibles.</p>
              )}
            </div>

            {/* Instructores */}
            <div className="clases-actividades-item clases-actividades-detalle-info-instructores">
              <h2>Instructores</h2>
              {claseDetalle.Entrenadores && claseDetalle.Entrenadores.length > 0 ? (
                <ul className='listado-entrenadores'>
                  {claseDetalle.Entrenadores.map(ent => (
                    <li key={ent.ID_Usuario}>
                      <div className="usuarios-table-userimage" style={{
                        backgroundImage: `url(${ent.imagenUsuario ? ent.imagenUsuario : defaultAvatar})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}></div>
                      {ent.nombre} {ent.apellido} {ent.profesion && `– ${ent.profesion}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay instructores asignados.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationPopup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        onConfirm={handlePopupConfirm}
        message="¿Estás seguro de que deseas eliminar esta clase?"
      />
    </div>
  );
};

export default ClasesActividadesAdminDetalle;
