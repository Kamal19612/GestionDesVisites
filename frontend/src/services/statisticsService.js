import api from './api'

const statisticsService = {
  getOverview: async () => {
    // Admin stats endpoint
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getHistory: async (params) => {
    const res = await api.get('/statistiques/detailed-reports', { params })
    return res.data
  },
  getByDepartment: async () => {
    const res = await api.get('/statistiques/par-departement')
    return res.data
  },
  getAverageDuration: async () => {
    const res = await api.get('/statistiques/duree-moyenne')
    return res.data
  },
}

export default statisticsService
