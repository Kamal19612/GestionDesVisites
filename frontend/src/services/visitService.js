import api from './api'

const visitService = {
  createVisit: async (visitData) => {
    // Maps to Agent creating a direct appointment/visit
    const response = await api.post('/agent/rendezvous/direct', visitData)
    return response.data
  },

  // Start a visit (arrival)
  startVisit: async (rendezVousId) => {
    const response = await api.post(`/agent/visites/${rendezVousId}/arrivee`)
    return response.data
  },

  // Get visits for today (Appointment lists for agent dashboard)
  getVisitsToday: async () => {
    const response = await api.get('/agent/visites/aujourdhui')
    return response.data
  },

  // Get active visits (currently in progress)
  // Get active visits (currently in progress)
  getActiveVisits: async () => {
    const response = await api.get('/agent/visites/actives');
    return response.data;
  },

  // Update visit - record departure time
  updateVisit: async (visitId, visitData) => {
    const response = await api.put(`/agent/visites/${visitId}`, visitData)
    return response.data
  },

  // Checkout visitor - mark as departed
  checkoutVisit: async (visitId) => {
    // Backend uses server time for checkout
    const response = await api.post(`/agent/visites/${visitId}/sortie`)
    return response.data
  },

  // Get visit by ID
  getVisitById: async (visitId) => {
    const response = await api.get(`/agent/visites/${visitId}`);
    return response.data;
  },

  // Get all visits (History)
  getAllVisits: async () => {
    const response = await api.get('/agent/visites/historique');
    return response.data;
  },

  searchVisitor: async (query) => {
    const response = await api.get(`/visiteur/search?q=${query}`);
    return response.data;
  },

  searchByCode: async (code) => {
    const response = await api.get(`/agent/rendezvous/search-by-code?code=${code}`);
    return response.data;
  }
}

export default visitService
