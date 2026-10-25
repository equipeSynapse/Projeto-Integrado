import api from "../api";

export async function seguirCategoria(categoria) {
    try {
        const token = localStorage.getItem("token")

        await api.post("/api/categorias/seguir-categoria", {categoria}, {
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