import api from './api';

const authService = {
  // Login - retorna token
  login: async (email, senha) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        senha,
      });
      
      // Armazenar token no localStorage
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cadastro Voluntário
  registerVoluntario: async (nome, cpf, email, senha) => {
    try {
      const response = await api.post('/auth/cadastrar-voluntario', {
        nome,
        cpf,
        email,
        senha,
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cadastro Entidade
  registerEntidade: async (formData) => {
    try {
      const payload = {
        nomeFantasia: formData.name,
        cnpj: formData.cnpj,
        email: formData.email,
        senha: formData.password,
        areaDeAtuacao: 'Geral', // Valor padrão, ajuste conforme necessário
        endereco: {
          rua: formData.rua,
          numero: formData.numero,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep,
          bairro: 'Não especificado', // Campo adicional do DTO
        },
      };

      const response = await api.post('/auth/cadastrar-entidade', payload);
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout - remove token
  logout: () => {
    localStorage.removeItem('authToken');
  },

  // Verificar se usuário está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Obter token
  getToken: () => {
    return localStorage.getItem('authToken');
  },
};

export default authService;
