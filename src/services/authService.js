import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

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
            
            return resposta.data;
        } catch (error) {
            throw error.response?.data || { error : 'Erro ao realizar login' };
        }
    },
    register: async (name, email, password) => {
        try {
            const resposta = await axios.post(`${API_URL}/register`, {
                name: name,
                email: email,
                password: password
            });
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
