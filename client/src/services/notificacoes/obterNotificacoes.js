import api from '../api';

export const getNotificacoes = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await api.get('api/notificacoes',  {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": undefined
            }
        });
        return response.data.notificacoes;
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        throw error;
    }
}
