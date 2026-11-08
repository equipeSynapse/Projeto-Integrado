import api from "./api";

export async function editarPublicacao(id, dadosPublicacao) {
    try {
        const token = localStorage.getItem("token");

        const response = await api.put(`/api/posts/publicacoes/${id}`, dadosPublicacao, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": undefined
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao editar publicação:", error.response?.data || error.message);
        throw error;
    }
}