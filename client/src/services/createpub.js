import api from "./api";

export async function createPub(usuario) {
    try {
        const response = await api.post("/api/auth/createPub", usuario);
        return response.data;
    } catch (error) {
        console.error("Erro ao carregar página:", error.response.data);
        throw error;
    }
}