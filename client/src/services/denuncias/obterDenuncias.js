import api from '../api';

export const getDenuncias = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await api.get('api/denuncias',  {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": undefined
            }
        });
        return response.data.denuncias;
    } catch (error) {
        console.error('Erro ao buscar denúncias:', error);
        throw error;
    }
}