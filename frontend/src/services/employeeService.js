import api from './api';

const employeeService = {
  /**
   * Get all appointments for the current employee
   */
  /**
   * Get all appointments for the current employee (History/Log)
   */
  getAppointments: async (filters = {}) => {
    try {
      // Mapping to history endpoint which returns list of past appointments
      const response = await api.get('/employe/rendezvous/historique', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  /**
   * Get appointment by ID
   */
  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/v1/rendezvous/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw error;
    }
  },

  /**
   * Get appointments for a specific date range
   */
  getAppointmentsByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get('/v1/rendezvous', {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments by date range:', error);
      throw error;
    }
  },

  /**
   * Get appointment statistics
   */
  getStatistics: async () => {
    try {
      const response = await api.get('/employe/statistiques');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { total: 0, pending: 0, validated: 0 };
    }
  },

  /**
   * Get upcoming appointments
   */
  getUpcomingAppointments: async (days = 7) => {
    try {
      const response = await api.get('/employe/rendezvous/a-venir');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  },
};

export default employeeService;
