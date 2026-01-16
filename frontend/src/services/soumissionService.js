import api from './api';

/**
 * Service pour gérer les soumissions de rendez-vous
 * Endpoint: /api/v1/soumissions
 */
const soumissionService = {
  /**
   * Créer une nouvelle soumission de rendez-vous
   * @param {Object} soumissionData - Données de la soumission
   * @returns {Promise} Réponse du serveur
   */
  createSoumission: async (soumissionData) => {
    const response = await api.post('/v1/soumissions', soumissionData);
    return response.data;
  },

  /**
   * Récupérer toutes les soumissions
   * @returns {Promise} Liste des soumissions
   */
  getAllSoumissions: async () => {
    const response = await api.get('/v1/soumissions');
    return response.data;
  },

  /**
   * Récupérer une soumission par ID
   * @param {number} id - ID de la soumission
   * @returns {Promise} Données de la soumission
   */
  getSoumissionById: async (id) => {
    const response = await api.get(`/v1/soumissions/${id}`);
    return response.data;
  },

  /**
   * Mettre à jour une soumission
   * @param {number} id - ID de la soumission
   * @param {Object} updatedData - Données à mettre à jour
   * @returns {Promise} Données mises à jour
   */
  updateSoumission: async (id, updatedData) => {
    const response = await api.put(`/v1/soumissions/${id}`, updatedData);
    return response.data;
  },

  /**
   * Supprimer une soumission
   * @param {number} id - ID de la soumission
   * @returns {Promise} Réponse du serveur
   */
  deleteSoumission: async (id) => {
    const response = await api.delete(`/v1/soumissions/${id}`);
    return response.data;
  },

  /**
   * Approuver une soumission
   * @param {number} id - ID de la soumission
   * @param {Object} approvalData - Données d'approbation
   * @returns {Promise} Réponse du serveur
   */
  approveSoumission: async (id, approvalData) => {
    const response = await api.post(`/v1/soumissions/${id}/approve`, approvalData);
    return response.data;
  },

  /**
   * Rejeter une soumission
   * @param {number} id - ID de la soumission
   * @param {Object} rejectionData - Raison du rejet
   * @returns {Promise} Réponse du serveur
   */
  rejectSoumission: async (id, rejectionData) => {
    const response = await api.post(`/v1/soumissions/${id}/reject`, rejectionData);
    return response.data;
  }
};

export default soumissionService;
