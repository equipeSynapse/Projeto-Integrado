import api from "../api";

export async function desseguirCategoria(usuario, categoria) {
    try {
        const token = localStorage.getItem("token")

        await api.patch("/api/categorias/desseguir-categoria", {usuario, categoria}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return;
    } catch (error) {
        console.error("Erro ao desseguir categoria", error.response.data);
        throw error;
    }
}