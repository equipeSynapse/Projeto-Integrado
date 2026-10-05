import api from "./api";

export async function cadastrarUsuario(usuario) {
    try {
        const response = await api.post("/api/auth/cadastrar", usuario);
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error.response.data);
        throw error;
    }
}