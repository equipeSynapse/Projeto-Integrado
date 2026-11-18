import api from "../api";

export async function obterCategoriasSeguidas(usuario) {
    try {
        const categoriasList = await api.get(`/api/categorias/obter-categorias-seguidas?usuario=${usuario}`);
        return categoriasList.data;
    } catch (error) {
        console.error("Erro ao obter categorias", error.response.data);
        throw error;
    }
}