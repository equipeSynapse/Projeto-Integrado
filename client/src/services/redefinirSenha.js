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

export async function validarToken(token) {
    try {
        const response = await api.get(`/api/auth/validar-token?token=${encodeURIComponent(token)}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao validar token:", error.response?.data);
        throw error;
    }
}