import api from "./api";

export async function verificarNomeUsuario(nome) {
    try {
        const response = await api.post("/api/auth/verificar-nome-usuario", nome);
        return response.data.usuarioExiste;
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error.response.data);
        throw error;
    }
}