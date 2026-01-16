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

  // Get visits for today
  getVisitsToday: async () => {
    const response = await api.get('/employe/rendezvous/aujourdhui')
    return response.data
  },

  // Get active visits (currently in progress)
  getActiveVisits: async () => {
    // Fallback: use today's appointments as a proxy for active visits since /agent/visites/active doesn't exist
    const response = await api.get('/employe/rendezvous/aujourdhui')
    // Filter locally if needed, for now return all valid appointments for today
    return response.data
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
    // Fallback: endpoint missing, return null or throw. 
    // Ideally we should use what we have in the list.
    console.warn('getVisitById not implemented on backend')
    return null;
  },

  // Get all visits (History)
  getAllVisits: async () => {
    // Fallback: use today's appointments or return empty list
    console.warn('getAllVisits history not implemented on backend')
    return [] 
  },

  searchVisitor: async (phone, email) => {
    const params = new URLSearchParams()
    if (phone) params.append('phone', phone)
    if (email) params.append('email', email)
    const response = await api.get(`/visiteur/search?${params.toString()}`)
    return response.data
  }
}

export default visitService
