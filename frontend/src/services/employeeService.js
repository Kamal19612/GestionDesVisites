import api from './api';

const employeeService = {
  /**
   * Get all appointments for the current employee
   */
  getAppointments: async (filters = {}) => {
    try {
      // Use 'mine' so the backend returns appointments where the user is either visitor OR host (personneARencontrer)
      const response = await api.get('/v1/rendezvous/mine', { params: filters });
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
      const response = await api.get('/v1/rendezvous/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      };
    }
  },

  /**
   * Get upcoming appointments
   */
  getUpcomingAppointments: async (days = 7) => {
    try {
      const response = await api.get('/v1/rendezvous', {
        params: { upcoming: true, days },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  },
};

export default employeeService;
