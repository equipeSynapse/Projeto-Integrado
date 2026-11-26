import api from "../api";

export async function excluirDenuncia(id) {
    try {
        const token = localStorage.getItem("token")

        await api.delete(`/api/denuncias/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        return;
    } catch (error) {
        console.error("Erro ao excluir notificação", error.response.data);
        throw error;
    }
}