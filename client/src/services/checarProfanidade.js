import api from "./api";

export async function checarProfanidade(texto) {
    try {
        const response = await api.post("/api/checar-profanidade", {"texto": texto});
        return response.data.result;
    } catch (error) {
        console.error("Erro ao checar profanidade da palavra:", error.response.data);
        throw error;
    }
}