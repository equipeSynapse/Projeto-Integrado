import api from "../api";

export async function excluirNotificacao(id) {
    try {
        const token = localStorage.getItem("token")

        await api.delete("/api/notificacoes/excluir-notificacao", {
                    headers: { Authorization: `Bearer ${token}` },
                    data: {notificacao_id: id}
                }
            );
        return;
    } catch (error) {
        console.error("Erro ao excluir notificação", error.response.data);
        throw error;
    }
}