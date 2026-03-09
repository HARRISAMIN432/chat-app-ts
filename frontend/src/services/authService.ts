import apiCLient from "../utils/apiClient";

export const authService = {
  login: async(data: { email: string; password: string }) => {
    const response = await apiCLient.post("/auth/login", data);
    return response.data;
  },

  register: async(data: {fullName: string, username: string, email: string, password: string}) => {
    const response = await apiCLient.post("/auth/register", data);
    return response.data;
  },

  me: async() => {
    const response = await apiCLient.post("/auth/me");
    return response.data;
  },

  logout: async() => {
    await apiCLient.post('/auth/logout')
  }
};
