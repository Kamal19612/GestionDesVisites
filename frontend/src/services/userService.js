import api from './api';

const userService = {
  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  getUserById: async (id) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
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
};

export default userService;
