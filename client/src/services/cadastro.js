import api from "./api";

export async function cadastrarUsuario(usuario) {
    try {
        const response = await api.post("http://localhost:3000/api/auth/usuarios", usuario);
        return response.data;
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        throw error;
    }
}