import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const authService = {
    login: async (email, password) => {
        try {
            const resposta = await axios.post(`${API_URL}/login`, {
                email: email,
                password: password
            });

            if (resposta.data.token) {
                localStorage.setItem('token', resposta.data.token);
                localStorage.setItem('user', JSON.stringify(resposta.data.user));
            }
            console.log('deu certo')
            return resposta.data;
        } catch (error) {
            console.log('erro');
            throw error.response?.data || { error : 'Erro ao realizar login' };
        }
    },

    // <-- SUBSTITUIR/USAR ESTA VERSÃO
    register: async (payload) => {
        try {
            // payload deve ser: { name, email, password, endereco: { cep, logradouro, numero, complemento, bairro, cidade, estado } }
            const resposta = await axios.post(`${API_URL}/register`, payload);

            if (resposta.data.token) {
                localStorage.setItem('token', resposta.data.token);
                localStorage.setItem('user', JSON.stringify(resposta.data.user));
            }
            return resposta.data;
        } catch (error) {
            throw error.response?.data || { error : 'Erro ao realizar cadastro' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }
};

export default authService;
