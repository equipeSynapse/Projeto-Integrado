import api from "../api";

export async function seguirCategoria(usuario, categoria) {
    try {
        const token = localStorage.getItem("token")

        await api.patch("/api/categorias/seguir-categoria", {usuario, categoria}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        return;
    } catch (error) {
        console.error("Erro ao seguir categoria", error.response.data);
        throw error;
    }
}