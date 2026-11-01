import api from "../api";

export async function marcarComoLida(id) {
    try {
        const token = localStorage.getItem("token");

        await api.patch("/api/notificacoes/marcar-como-lida", {"notificacao_id": id}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": undefined
            }} );
        return;
    } catch (error) {
        console.error("Erro ao alterar status de leitura da notificação:", error.response.data);
        throw error;
    }
}