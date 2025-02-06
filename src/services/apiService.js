import apiClient from '../axiosConfig'; 

// Clases
const getClases = async () => {
    try {
        const response = await apiClient.get("https://gymbackend-qr97.onrender.com/clase/horario");
        return response.data;
    } catch (err) {
        throw new Error("Error al cargar las clases. Intente nuevamente.");
    }
};

// Turnos
const getTurnos = async () => {
    try {
        const response = await apiClient.get("https://gymbackend-qr97.onrender.com/turnos");
        return response.data;
    } catch (error) {
        throw new Error("Error en el service de getTurnos")
    }
}

const postTurno = async (body) => {
    try {
        console.log("Llega");
        const response = await apiClient.post("https://gymbackend-qr97.onrender.com/turnos", body);
        return response.data;
    } catch (error) {
        throw new Error("Error en el service de postTurno")
    }
}

export default {
    getClases,
    getTurnos,
    postTurno
};
