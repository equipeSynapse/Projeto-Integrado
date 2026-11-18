import api from "./api";

export async function loginUsuario(usuario) {
    try {
        const response = await api.post("/api/auth/login", usuario);
        return response.data;
    } catch (error) {
        console.error("Erro ao logar usuário:", error.response.data);
        throw error;
    }
}