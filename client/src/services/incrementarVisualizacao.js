import api from "./api";

export async function incrementarVisualizacao(id) {
    try {
        await api.patch("/api/posts/incrementar-visualizacao", id);
        return;
    } catch (error) {
        console.error("Erro ao atualizar quantidade de visualizações", error.response.data);
        throw error;
    }
}