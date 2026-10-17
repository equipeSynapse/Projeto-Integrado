import api from "./api";

export async function createPub(dadosPublicacao) {
    try {
        // Pega o token salvo no navegador durante o login
        const token = localStorage.getItem("token");

        const response = await api.post("/publicacoes", dadosPublicacao, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar publicação:", error.response?.data || error.message);
        throw error;
    }
}