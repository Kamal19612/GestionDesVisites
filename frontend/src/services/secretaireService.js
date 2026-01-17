import api from './api';

const secretaireService = {
  // Get pending appointments assigned to secretary
  getPendingAppointments: async () => {
    const res = await api.get('/secretaire/rendezvous/en-attente');
    return res.data;
  },

  getCalendarAppointments: async () => {
    const res = await api.get('/secretaire/rendezvous/calendrier');
    return res.data;
  },

  // Get appointment by id (for secretary view)
  getAppointmentById: async (id) => {
    // Assuming this endpoint exists or will exist
    const res = await api.get(`/secretaire/rendezvous/${id}`);
    return res.data;
  },

  // Update appointment (approve/reject/edit)
  updateAppointment: async (id, payload) => {
    // Logic to distinguish approve/reject based on payload or just use generic put if backend supports
    // For now mapping to validate as default action if 'status' is VALIDATED
    if (payload.status === 'VALIDATED' || payload.statut === 'VALIDE') {
        return api.put(`/secretaire/rendezvous/${id}/valider`);
    } else if (payload.status === 'REJECTED' || payload.statut === 'REFUSE') {
        return api.put(`/secretaire/rendezvous/${id}/refuser`);
    }
    // Fallback
    const res = await api.put(`/secretaire/rendezvous/${id}`, payload);
    return res.data;
  },

  // Get today's visits (sourced from appointments)
  getVisitsToday: async () => {
    const res = await api.get('/secretaire/rendezvous/aujourdhui');
    return res.data;
  },

  // Get all visitors for directory
  getVisitors: async () => {
    const res = await api.get('/secretaire/visiteurs');
    return res.data;
  },

  // Get all employees for assignment
  getEmployees: async () => {
    const res = await api.get('/secretaire/employes');
    return res.data;
  },

  // Reports - using real endpoints for tables
  getReports: async (params) => {
    if (params.type === 'visits') {
      const res = await api.get('/agent/visites', { params });
      return res.data;
    } else {
      const res = await api.get('/visiteur/rendezvous', { params });
      return res.data;
    }
  }
};

export default secretaireService;
