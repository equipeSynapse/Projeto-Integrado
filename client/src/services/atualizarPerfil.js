import api from "./api";

export async function atualizarPerfil(dados) {
    try {
        const token = localStorage.getItem("token");
        const response = await api.put("/api/auth/perfil", dados, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Atualiza o token no navegador para refletir o novo nome
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error.response?.data || error.message);
        throw error;
    }
}