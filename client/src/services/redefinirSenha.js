import api from "./api";

export async function redefinirSenha(token, senha) {
    try {
        const response = await api.post(`/api/auth/redefinir-senha?token=${encodeURIComponent(token)}`, { senha });
        return response.data;
    } catch (error) {
        console.error("Erro ao redefinir senha:", error.response?.data);
        throw error;
    }
}
