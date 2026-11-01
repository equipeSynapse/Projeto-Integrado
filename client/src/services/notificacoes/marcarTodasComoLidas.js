import api from "../api";

export async function marcarTodasComoLidas() {
    try {
        const token = localStorage.getItem("token");

        await api.patch("/api/notificacoes/marcar-todas-como-lidas", {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }} );
        return;
    } catch (error) {
        console.error("Erro ao alterar status de leitura das notificações:", error.response.data);
        throw error;
    }
}