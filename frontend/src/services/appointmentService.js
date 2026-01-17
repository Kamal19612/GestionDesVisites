import api from './api';

const appointmentService = {
  createAppointment: async (appointmentData) => {
    console.log('🔵 appointmentService.createAppointment() - Envoi:', appointmentData);
    const response = await api.post('/visiteur/rendezvous', appointmentData);
    return response.data;
  },

  // Create on-site appointment (for agents creating appointments for external visitors)
  createOnsiteAppointment: async (appointmentData) => {
    console.log('🔵 appointmentService.createOnsiteAppointment() - Envoi:', appointmentData);
    const response = await api.post('/agent/rendezvous/direct', appointmentData);
    return response.data;
  },

  // Get appointments for authenticated visitor
  getAppointments: async () => {
    const response = await api.get('/visiteur/rendezvous');
    return response.data;
  },

  // Get all appointments (admin use) - STUBBED
  // Get all appointments (admin use)
  getAllAppointments: async () => {
    // Admin endpoint
    const response = await api.get('/secretaire/rendezvous/calendrier'); // Or Admin equivalent if exists, Secretaire has all.
    return response.data;
  },

  getAppointmentById: async (id) => {
     const response = await api.get(`/visiteur/rendezvous/${id}`);
     return response.data;
  },

  updateAppointment: async (id, updatedData) => {
    const response = await api.put(`/visiteur/rendezvous/${id}`, updatedData);
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/visiteur/rendezvous/${id}`);
    return response.data;
  },

  // Get pending appointments (for secretary validation)
  getPendingAppointments: async () => {
    const response = await api.get('/secretaire/rendezvous/en-attente');
    return response.data;
  },

  // Get today's appointments (for agent/secretary dashboard)
  getTodayAppointments: async () => {
    const response = await api.get('/employe/rendezvous/aujourdhui');
    return response.data;
  },

  // Get upcoming appointments (for employee)
  getUpcomingAppointments: async () => {
    const response = await api.get('/employe/rendezvous/a-venir');
    return response.data;
  },

  // Approve appointment (for secretary)
  approveAppointment: async (appointmentId, approveData = {}) => {
    const response = await api.put(`/secretaire/rendezvous/${appointmentId}/valider`);
    return response.data;
  },

  // Reject appointment (for secretary)
  rejectAppointment: async (appointmentId, rejectData = {}) => {
    const response = await api.put(`/secretaire/rendezvous/${appointmentId}/refuser`);
    return response.data;
  },

  // Complete appointment (for agent - shortcut to create finished visit)
  completeAppointment: async (appointmentId) => {
    // Mapping to checkout?
    const response = await api.post(`/agent/visites/${appointmentId}/sortie`);
    return response.data;
  },
};
export default appointmentService;
