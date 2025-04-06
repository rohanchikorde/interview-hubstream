import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api/auth';

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password
    });
    return response.data;
  },

  register: async (userData: {
    email: string;
    password: string;
    full_name: string;
    phone_number: string;
    role: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  }
};
