import api from "./api";

export async function excluirPublicacao(id) {
    try {
        const token = localStorage.getItem("token");
        await api.delete(`/api/posts/publicacoes/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error("Erro ao excluir publicação:", error);
        throw error;
    }
}