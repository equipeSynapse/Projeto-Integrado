import api from "./api";

export async function createPub(dadosPublicacao) {
    try {
        const token = localStorage.getItem("token");

        const response = await api.post("/api/posts/criar-publicacao", dadosPublicacao, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": undefined
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao criar publicação:", error.response?.data || error.message);
        throw error;
    }
}