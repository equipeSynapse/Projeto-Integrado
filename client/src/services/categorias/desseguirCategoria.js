import api from "../api";

export async function desseguirCategoria(categoria) {
    try {
        const token = localStorage.getItem("token")

        await api.delete("/api/categorias/desseguir-categoria", {
                    headers: { Authorization: `Bearer ${token}` },
                    data: {categoria}
                }
            );
        return;
    } catch (error) {
        console.error("Erro ao desseguir categoria", error.response.data);
        throw error;
    }
}