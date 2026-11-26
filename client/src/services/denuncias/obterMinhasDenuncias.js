import api from '../api';

export const getMinhasDenuncias = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await api.get(`api/denuncias/usuario`,  {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": undefined
            }
        });
        return response.data.denuncias;
    } catch (error) {
        console.error('Erro ao buscar denúncias do usuário:', error);
        throw error;
    }
}