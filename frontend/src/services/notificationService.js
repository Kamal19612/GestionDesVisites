import api from './api'

const notificationService = {
  getNotifications: async () => {
    const res = await api.get('/v1/notifications')
    return res.data
  },
  markAsRead: async (id) => {
    const res = await api.post(`/v1/notifications/${id}/read`)
    return res.data
  },
}

export default notificationService
