import apiClient from '../axiosConfig';

// Clases
const getClases = async () => {
    try {
        const response = await apiClient.get(`/clase/horario`);
        return response.data;
    } catch (err) {
        throw new Error("Error al cargar las clases. Intente nuevamente.");
    }
};

// Turnos
const getTurnos = async () => {
    try {
        const response = await apiClient.get(`/turnos`);
        return response.data;
    } catch (error) {
        throw new Error("Error en el service de getTurnos")
    }
}

const getTurnosUsuario = async (usuarioId) => {
    try {
        const response = await apiClient.get(`/turnos/usuario/${usuarioId}`)
        return response.data.turnos;
    } catch (error) {
        throw new Error("Error en el service de getTurnosUsuario");
    }
}

const getTurnoById = async (id) => {
    try {
        const response = await apiClient.get(`/turnos/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Error en el service de getTurnosByUsuario")
    }
}
// services/apiService.js
const postTurno = async (body) => {
    try {
        const response = await apiClient.post("/turnos", body);
        return response.data;
    } catch (error) {
        const apiMsg = error.response?.data?.message;
        throw new Error(apiMsg || error.message);
    }
};


const deleteTurno = async (id) => {
    try {
        const response = await apiClient.delete(`/turnos/${id}`);
        return response.data
    } catch (error) {
        throw new Error("Error en el service de deleteTurno")
    }
}

// Rutinas
const getRutinas = async () => {
    try {
        const response = await apiClient.get("/rutinas");
        return response.data
    } catch (error) {
        throw new Error("Error en el service de getRutinas");
    }
}

const getRutinaById = async (rutinaId) => {
    try {
        const response = await apiClient.get(`/rutinas/${rutinaId}`);
        return response.data.rutina;
    } catch (error) {
        throw new Error("Error en el service de getRutinas");
    }
}

const getUserRutinas = async (id) => {
    try {
        const response = await apiClient.get(`/rutinas/usuario/${id}`);
        return response.data
    } catch (error) {
        throw new Error("Error en el service de getRutinas");
    }
}

const createRutina = async (data) => {
    try {
        const response = await apiClient.post("/rutinas", data);
        return response.data;
    } catch (error) {
        throw new Error("Error al crear la rutina");
    }
};

const editRutina = async (idRutina, data) => {
    try {
        const response = await apiClient.put(`/rutinas/${idRutina}`, data);
        return response.data
    } catch (error) {
        throw new Error("Error en el service de getRutinas");
    }
}

const deleteRutina = async (id) => {
    try {
        const response = await apiClient.delete(`/rutinas/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al eliminar la rutina");
    }
}

const getRutinasEntrenadores = async (idEntrenador) => {
    try {
        const response = await apiClient.get(`/rutinas/entrenador/${idEntrenador}`)
        return response.data;
    } catch (error) {
        throw new Error("Error al traer las rutinas asignadas por el entrenador");
    }
}

const getRutinasAdmins = async() => {
    try {
        const response = await apiClient.get(`/rutinas/admins`)
        return response.data;
    } catch (error) {
        throw new Error("Error al traer las rutinas del admin");
    }
}

/* Entrenadores */
const getEntrenadores = async () => {
    try {
        const response = await apiClient.get('/usuarios/entrenadores');
        return response.data;
    } catch (error) {
        throw new Error("Error al obtener entrenadores");
    }
};

const addEntrenadorToClase = async (idClase, idEntrenador) => {
    try {
        const response = await apiClient.post(`/clase/${idClase}/entrenador/${idEntrenador}`)
    } catch (error) {
        throw new Error("Error al asignar entrenador a una clase");
    }
}

const removeEntrenadorFromClase = async (idClase, idEntrenador) => {
    try {
        const response = await apiClient.delete(`/clase/${idClase}/entrenador/${idEntrenador}`)
    } catch (error) {
        throw new Error("Error al asignar entrenador a una clase");
    }
}

const getAllUsuarios = async () => {
    try {
        const response = await apiClient('/usuarios');
        return response.data;
    } catch (error) {
        throw new Error(`Error al obtener los usuarios`);
    }
}

const getUserById = async (id) => {
    try {
        const response = await apiClient.get(`/usuarios/${id}`);
        return response.data
    } catch (error) {
        throw new Error(`Error al obtener el usuario con ID ${id}`);
    }
}

const updateUserById = async (id, body) => {
    try {
        const response = await apiClient.put(`/usuarios/${id}`, body);
        return response.data
    } catch (error) {
        throw new Error(`Error al editar el usuario con ID ${id}`);
    }
}

const getUsuariosAdmins = async () => {
    try {
        const response = await apiClient.get(`/usuarios/admins`);
        return response.data;
    } catch (error) {
        throw new Error(`Error al traer los usuarios administradores`);
    }
}

// Contraseñas
const forgotPassword = async (body) => {
    try {
        const response = await apiClient.post('/auth/forgot-password', body);
        return response.data;
    } catch (error) {
        throw new Error(`Error al enviar mail para recuperar contraseña`);
    }
}

const resetPassword = async (body) => {
    try {
        const response = await apiClient.post('/auth/reset-password', body);
        return response.data;
    } catch (error) {
        throw new Error('Error al crear nueva contraseña');
    }
}

const changePassword = async (body) => {
    try {
        const response = await apiClient.put("/auth/change-password", body);
        return response.data;
    } catch (error) {
        return error
    }
}

// Medicion resultado
const getEjerciciosResultados = async () => {
    try {
        const response = await apiClient.get('/ejercicios-resultados');
        return response.data;
    } catch (err) {
        throw new Error("Error al traer ejercicios y resultados");
    }
}

const getEjerciciosResultadosUsuario = async (usuarioId) => {
    try {
        const response = await apiClient.get(`/ejercicios-resultados/usuario/${usuarioId}`);
        return response.data.ejercicios;
    } catch (err) {
        throw new Error("Error en el servicio getEjerciciosResultadosUsuario");
    }
}

const deleteEjerciciosResultados = async (id) => {
    try {
        const response = await apiClient.delete(`/historicoEjercicio/${id}`);
        return response.data;
    } catch (err) {
        throw new Error("Error al traer ejercicios y resultados");
    }
}

const putEjercicioResultado = async (id, body) => {
    try {
        const response = await apiClient.put(`/historicoEjercicio/${id}`, body);
        return response.data;
    } catch (err) {
        throw new Error("Error al traer ejercicios y resultados");
    }
}

// Ejercicio
const postEjercicio = async (body) => {
    try {
        const response = await apiClient.post(`/ejercicios-resultados`, body);
        return response;
    } catch (err) {
        throw new Error("Error en el servicio postEjercicio");
    }
}

const postEjercicioResultado = async (body) => {
    try {
        const response = await apiClient.post("/historicoEjercicio", body);
        return response.data;
    } catch (error) {
        throw new Error("Error en el servicio postEjercicioResultado");
    }
}

const deleteEjercicio = async (ejercicioId) => {
    try {
        const response = await apiClient.delete(`/ejercicios-resultados/${ejercicioId}`);
        return response.data;
    } catch (err) {
        throw new Error("Error en el servicio postEjercicio");
    }
}

// Admin dashboard
const getKPIs = async () => {
    try {
        const response = await apiClient.get("/admin/dashboard");
        return response.data;
    } catch (error) {
        throw new Error("Error en el servicio de getKPIs")
    }
}

// Admin planes
const getPlanes = async() => {
    try {
        const response = await apiClient.get("/planes");
        return response.data;
    } catch (error) {
        throw new Error("Error en el servicio de getPlanes")
    }
}

const postPlanes = async(body) => {
    try {
        const response = await apiClient.post("/planes", body);
        return response;
    } catch (error) {
        throw new Error("Error en el servicio de postPlanes")
    }
}

const deletePlanes = async(id) => {
    try {
        const response = await apiClient.delete(`/planes/${id}`);
        return response;
    } catch (error) {
        throw new Error("Error en el servicio de deletePlanes")
    }
}

const putPlanes = async(id, body) => {
    try {
        const response = await apiClient.put(`/planes/${id}`, body)
        return response.data;
    } catch (error) {
        throw new Error("Error en el servicio de putPlanes")
    }
}

// Cuotas
const postCuotasMasivas = async(body) => {
    try {
        const response = await apiClient.post("cuotas/generate-cuotas", body);
        return response;
    } catch (error) {
        throw new Error("Error en el servicio de postCuotasMasivas")
    }
}

const getCuotasUsuario = async(id) => {
    try {
        const response = await apiClient.get(`cuotas/usuario/${id}/cuotas`);
        return response;
    } catch (error) {
        throw new Error("Error en el servicio de getCuotasUsuario")
    }
}

const getCuotasReminder = async(idUsuario) => {
    try {
        const response = await apiClient.get(`/cuotas/reminder/${idUsuario}`);
        return response.data;
    } catch (error) {
        const apiMsg = error?.response?.data?.message;
        throw new Error(apiMsg || "Error en el servicio de getCuotasReminder");
    }
}


// Ejercicios
const getEjercicios = async() => {
    try {
        const response = await apiClient.get("/ejercicios");
        return response.data;
    } catch (error) {
        throw new Error("Error en el servicio de getEjercicios")
    }
}

// Ejercicios
const getEjercicioById = async(id) => {
    try {
        const response = await apiClient.get(`/ejercicios/${id}`);
        return response;
    } catch (error) {
        throw new Error("Error en el servicio de getEjercicios")
    }
}

const postEjercicios = async(body) => {
    try {
        const response = await apiClient.post("/ejercicios", body);
        return response;
    } catch (error) {
        throw new Error("Error en el servicio de postEjercicios")
    }
}

const deleteEjercicios = async(id) => {
    try {
        const response = await apiClient.delete(`/ejercicios/${id}`);
        return response;
    } catch (error) {
        throw new Error("Error en el servicio de deleteEjercicios")
    }
}

const putEjercicios = async(id, body) => {
    try {
        const response = await apiClient.put(`/ejercicios/${id}`, body)
        return response.data;
    } catch (error) {
        throw new Error("Error en el servicio de putEjercicios")
    }
}

// Helpers
export async function fetchAllClientsActive(apiService, { take = 100 } = {}) {
    let page = 1;
    let totalPages = 1;
    const all = [];
  
    do {
      const resp = await apiService.getUsers({ page, take }); 
      const data = Array.isArray(resp?.data) ? resp.data : [];
  
      // Filtrar solo clientes activos
      const clientesActivos = data.filter(u => (u?.tipo?.toLowerCase?.() === 'cliente') && u?.estado === true);
      all.push(...clientesActivos);
  
      totalPages = Number(resp?.meta?.totalPages || 1);
      page += 1;
    } while (page <= totalPages);
  
    return all;
  }
  
export default {
    // Clases
    getClases,
    // Turnos
    getTurnos,
    getTurnosUsuario,
    getTurnoById,
    postTurno,
    deleteTurno,
    // Rutinas
    getRutinas,
    getRutinaById,
    getUserRutinas,
    createRutina,
    editRutina,
    deleteRutina,
    getRutinasEntrenadores,
    getRutinasAdmins,
    // Entrenadores
    getEntrenadores,
    addEntrenadorToClase,
    removeEntrenadorFromClase,
    // Usuario
    getAllUsuarios,
    getUserById,
    updateUserById,
    getUsuariosAdmins,
    // Contraseña
    forgotPassword,
    resetPassword,
    changePassword,
    // Medicion resultado
    getEjerciciosResultados,
    getEjerciciosResultadosUsuario,
    deleteEjerciciosResultados,
    putEjercicioResultado,
    postEjercicio,
    deleteEjercicio,
    postEjercicioResultado,
    // Admin dashboard
    getKPIs,
    // Planes
    getPlanes,
    postPlanes,
    deletePlanes,
    putPlanes,
    // Cuotas
    getCuotasUsuario,
    postCuotasMasivas,
    getCuotasReminder,
    // Ejercicios
    getEjercicios,
    getEjercicioById,
    postEjercicios,
    putEjercicios,
    deleteEjercicios,
    // Helpers
    fetchAllClientsActive
};
