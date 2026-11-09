import api from "./api";

export async function excluirConta(usuario, senha) {
    try {
        const token = localStorage.getItem("token");
        await api.delete("/api/auth/conta", {
            headers: { Authorization: `Bearer ${token}` },
            data: {"usuario": usuario, "senha": senha}
        });
        localStorage.removeItem("token"); 
    } catch (error) {
        console.error("Erro ao excluir conta:", error);
        throw error;
    }
}