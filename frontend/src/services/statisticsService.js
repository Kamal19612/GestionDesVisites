import api from './api'

const statisticsService = {
  getOverview: async () => {
    // use existing endpoint that returns saved statistics
    const res = await api.get('/v1/statistiques')
    return res.data
  },
  getHistory: async (params) => {
    const res = await api.get('/v1/statistiques/detailed-reports', { params })
    return res.data
  },
  getByDepartment: async () => {
    const res = await api.get('/v1/statistiques/par-departement')
    return res.data
  },
}

export default statisticsService
