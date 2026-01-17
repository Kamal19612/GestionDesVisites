import api from './api';

const userService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    // Handle Spring Data Page or List
    return response.data.content ? response.data.content : response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (payload) => {
    const res = await api.post('/admin/users', payload);
    return res.data;
  },

  updateUser: async (id, payload) => {
    const res = await api.put(`/admin/users/${id}`, payload);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  getProfile: async () => {
    const response = await api.get('/visiteur/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/visiteur/profile', profileData);
    return response.data;
  },
};

export default userService;
