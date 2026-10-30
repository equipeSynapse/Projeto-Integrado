import api from "./api";

export async function esqueciSenha(email) {
    try {
        const response = await api.post("/api/auth/esqueci-senha", { email });
        return response.data;
    } catch (error) {
        console.error("Erro ao solicitar redefinição de senha:", error.response?.data);
        throw error;
    }
}