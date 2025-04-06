import apiClient from '../axiosConfig'; 

const apiUrl = "https://gym-backend-rust.vercel.app";

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

const postTurno = async (body) => {
    try {
        const response = await apiClient.post("/turnos", body);
        return response.data;
    } catch (error) {
        throw new Error("Error en el service de postTurno")
    }
}

const deleteTurno = async (id) => {
    try {
        const response = await apiClient.delete(`/turnos/${id}`);
        return response.data
    } catch (error) {
        throw new Error("Error en el service de deleteTurno")
    }
}

// Rutinas
const getRutinas = async (data) => {
    try {
        const response = await apiClient.get("/rutinas");
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

const deleteRutina = async (id) => {
    try {
        const response = await apiClient.delete(`/rutinas/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Error al eliminar la rutina");
    }
}

const getEntrenadores = async () => {
    try {
      const response = await apiClient.get('/usuarios/entrenadores');
      return response.data;
    } catch (error) {
      throw new Error("Error al obtener entrenadores");
    }
};

export default {
    getClases,
    getTurnos,
    postTurno,
    deleteTurno,
    getRutinas,
    createRutina,
    deleteRutina,
    getEntrenadores
};
