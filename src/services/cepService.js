import axios from 'axios';

const CEP_API_URL = 'https://api.cep.rest';

const cepService = {
  buscarCep: async (cep) => {
    try {
      const response = await axios.post(CEP_API_URL, { cep });
      return response.data; // dados do endereço (logradouro, bairro, cidade, estado etc.)
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      throw error.response?.data || { error: 'Erro ao buscar CEP' };
    }
  },
};

export default cepService;
