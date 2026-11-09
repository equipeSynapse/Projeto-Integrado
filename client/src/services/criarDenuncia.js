import api from "./api";

export async function criarDenuncia({ publicacao_id, motivo, descricao }) {
    try {
        const token = localStorage.getItem("token");
        const { data } = await api.post(
            "/api/denuncias",
            { publicacao_id, motivo, descricao: descricao?.trim() || null },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return data;
    } catch (error) {
        console.error("Erro ao criar denúncia:", error);
        throw error;
    }
}
