import api from "./api";

export async function excluirConta() {
    try {
        const token = localStorage.getItem("token");
        await api.delete("/api/auth/conta", {
            headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem("token"); // Remove a sessão após exclusão
    } catch (error) {
        console.error("Erro ao excluir conta:", error);
        throw error;
    }
}