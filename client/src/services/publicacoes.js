import api from './api';

export const getPublicacoes = async () => {
    try {
        const response = await api.get('api/posts/publicacoes');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        throw error;
    }
}