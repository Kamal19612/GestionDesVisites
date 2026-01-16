/**
 * Mock data for development and testing
 * These mocks provide realistic sample data for pages before API integration is complete
 */
// Toggle to enable mocks. Use Vite env var VITE_USE_MOCKS=true to force mocks in any mode.
export const USE_MOCKS = (typeof import.meta !== 'undefined' && (
  import.meta.env && (import.meta.env.VITE_USE_MOCKS === 'true' || import.meta.env.MODE === 'development')
)) || false;

export const MOCK_APPOINTMENTS = USE_MOCKS ? [
  {
    id: 1,
    visitorName: 'John Smith',
    visitorEmail: 'john@example.com',
    visitorPhone: '06-12-34-56-78',
    appointmentDate: '2026-01-15T10:00:00',
    motif: 'Réunion commerciale',
    personnArencontrer: 'Marc Dupont',
    departement: 'IT',
    nombrePersonnes: 2,
    status: 'Approved',
    approvedDate: '2026-01-05T14:30:00',
  },
  {
    id: 2,
    visitorName: 'Sarah Johnson',
    visitorEmail: 'sarah@example.com',
    visitorPhone: '06-87-65-43-21',
    appointmentDate: '2026-01-16T14:30:00',
    motif: 'Audit financier',
    personnArencontrer: 'Sylvie Laurent',
    departement: 'Finance',
    nombrePersonnes: 1,
    status: 'Approved',
    approvedDate: '2026-01-05T15:00:00',
  },
  {
    id: 3,
    visitorName: 'Mike Chen',
    visitorEmail: 'mike@example.com',
    visitorPhone: '06-55-44-33-22',
    appointmentDate: '2026-01-17T11:00:00',
    motif: 'Visite client',
    personnArencontrer: 'Pierre Bernard',
    departement: 'RH',
    nombrePersonnes: 3,
    status: 'Pending',
    approvedDate: null,
  },
  {
    id: 4,
    visitorName: 'Emma Wilson',
    visitorEmail: 'emma@example.com',
    visitorPhone: '06-44-55-66-77',
    appointmentDate: '2026-01-18T09:30:00',
    motif: 'Présentation produit',
    personnArencontrer: 'Thomas Martin',
    departement: 'Marketing',
    nombrePersonnes: 4,
    status: 'Rejected',
    approvedDate: null,
  },
] : [];

export const MOCK_PENDING_APPOINTMENTS = USE_MOCKS ? [
  {
    id: 1,
    visitorName: 'John Smith',
    visitorEmail: 'john@example.com',
    date: '2026-01-02',
    time: '10:00',
    motif: 'Réunion',
    department: 'IT',
    status: 'EN_ATTENTE',
    submittedBy: 'Visiteur',
  },
  {
    id: 2,
    visitorName: 'Sarah Johnson',
    visitorEmail: 'sarah@example.com',
    date: '2026-01-03',
    time: '14:30',
    motif: 'Audit',
    department: 'RH',
    status: 'EN_ATTENTE',
    submittedBy: 'Visiteur',
  },
  {
    id: 3,
    visitorName: 'Mike Chen',
    visitorEmail: 'mike@example.com',
    date: '2026-01-02',
    time: '11:00',
    motif: 'Visite client',
    department: 'Finance',
    status: 'EN_ATTENTE',
    submittedBy: 'Visiteur',
  },
] : [];

export const MOCK_TODAY_APPOINTMENTS = USE_MOCKS ? [
  { id: 1, visitorName: 'John Smith', time: '09:00', motif: 'Réunion', status: 'APPROUVEE', department: 'IT' },
  { id: 2, visitorName: 'Sarah Johnson', time: '14:30', motif: 'Audit', status: 'APPROUVEE', department: 'RH' },
  { id: 3, visitorName: 'Mike Chen', time: '11:00', motif: 'Visite client', status: 'EN_ATTENTE', department: 'Finance' },
] : [];

export const MOCK_ACTIVE_VISITS = USE_MOCKS ? [
  { id: 101, visitorName: 'Emma Wilson', checkInTime: '10:30', motif: 'Présentation', duration: '45 min' },
  { id: 102, visitorName: 'David Lee', checkInTime: '09:15', motif: 'Réunion', duration: '1h 30min' },
] : [];

export const MOCK_CURRENT_VISITORS = USE_MOCKS ? [
  { id: 101, visitorName: 'Emma Wilson', department: 'IT', purpose: 'Présentation produit', checkInTime: '10:30', floor: '3', contact: 'Marc Dupont', phone: '06-12-34-56-78' },
  { id: 102, visitorName: 'David Lee', department: 'RH', purpose: 'Réunion RH', checkInTime: '14:15', floor: '2', contact: 'Sylvie Laurent', phone: '06-87-65-43-21' },
  { id: 103, visitorName: 'Anna Garcia', department: 'Finance', purpose: 'Audit financier', checkInTime: '09:45', floor: '4', contact: 'Pierre Bernard', phone: '06-55-44-33-22' },
] : [];

export const MOCK_VISITS = USE_MOCKS ? [
  { id: 1, visitorName: 'John Smith', department: 'IT', checkInTime: '09:00', checkOutTime: '10:30', duration: '1h 30min', motif: 'Réunion' },
  { id: 2, visitorName: 'Sarah Johnson', department: 'RH', checkInTime: '11:00', checkOutTime: '13:00', duration: '2h', motif: 'Audit' },
  { id: 3, visitorName: 'Mike Chen', department: 'Finance', checkInTime: '14:00', checkOutTime: '16:30', duration: '2h 30min', motif: 'Visite client' },
] : [];

export const MOCK_HISTORY = USE_MOCKS ? [
  { id: 1, date: '2025-11-28', HEntree: '09:00', HSortie: '10:30', motif: 'Réunion', Statut: 'TERMINEE', visiteur: 'John Smith', agentSecurite: 'Marc Dupont', secretaire: 'Sophie Bernard', utilisateurValidation: 'Marc Dupont' },
  { id: 2, date: '2025-11-29', HEntree: '14:00', HSortie: '16:30', motif: 'Audit', Statut: 'TERMINEE', visiteur: 'Sarah Johnson', agentSecurite: 'Pierre Bernard', secretaire: 'Marie Dubois', utilisateurValidation: 'Pierre Bernard' },
  { id: 3, date: '2025-11-30', HEntree: '10:00', HSortie: '10:15', motif: 'Signature document', Statut: 'TERMINEE', visiteur: 'Tom White', agentSecurite: 'Pierre Bernard', secretaire: 'Marie Dubois', utilisateurValidation: 'Pierre Bernard' },
  { id: 4, date: '2025-12-01', HEntree: '16:00', HSortie: '16:30', motif: 'Support client', Statut: 'ANNULEE', visiteur: 'Nicole Brown', agentSecurite: null, secretaire: 'Sylvie Laurent', utilisateurValidation: 'Sylvie Laurent' },
] : [];

export const MOCK_REPORTS_VISITS = USE_MOCKS ? [
  { id: 1, visitorName: 'John Smith', visitDate: '2026-01-05', duration: '1h 30min', agentName: 'Marc Dupont' },
  { id: 2, visitorName: 'Sarah Johnson', visitDate: '2026-01-04', duration: '2h', agentName: 'Pierre Bernard' },
  { id: 3, visitorName: 'Mike Chen', visitDate: '2026-01-03', duration: '45min', agentName: 'Michel Leclerc' },
  { id: 4, visitorName: 'Emma Wilson', visitDate: '2026-01-02', duration: '2h 15min', agentName: 'Marc Dupont' },
] : [];

export const MOCK_REPORTS_APPOINTMENTS = USE_MOCKS ? [
  { id: 1, visitorName: 'John Smith', appointmentDate: '2026-01-15', status: 'Approved', motif: 'Réunion commerciale' },
  { id: 2, visitorName: 'Sarah Johnson', appointmentDate: '2026-01-16', status: 'Approved', motif: 'Audit financier' },
  { id: 3, visitorName: 'Mike Chen', appointmentDate: '2026-01-17', status: 'Pending', motif: 'Visite client' },
  { id: 4, visitorName: 'Emma Wilson', appointmentDate: '2026-01-18', status: 'Rejected', motif: 'Présentation produit' },
] : [];

export const MOCK_OVERVIEW = USE_MOCKS ? [
  { periode: '2025-11', dureeMoyenneMinutes: 38 },
  { periode: '2025-12', dureeMoyenneMinutes: 47 },
  { periode: '2026-01', dureeMoyenneMinutes: 45 },
] : [];

export const MOCK_DETAILED_REPORTS = USE_MOCKS ? [
  { id: 1, date: '2025-12-15', HEntree: '09:00', HSortie: '10:30', motif: 'Réunion équipe', Statut: 'TERMINEE' },
  { id: 2, date: '2025-12-16', HEntree: '14:00', HSortie: '15:45', motif: 'Audit interne', Statut: 'TERMINEE' },
  { id: 3, date: '2025-12-17', HEntree: '10:30', HSortie: '12:00', motif: 'Visite client - ACME', Statut: 'TERMINEE' },
  { id: 4, date: '2025-12-18', HEntree: '11:00', HSortie: '13:15', motif: 'Présentation produit', Statut: 'TERMINEE' },
  { id: 5, date: '2025-12-20', HEntree: '09:15', HSortie: null, motif: 'Entretien candidat', Statut: 'EN_COURS' },
  { id: 6, date: '2025-12-21', HEntree: '08:45', HSortie: '09:30', motif: 'Livraison', Statut: 'TERMINEE' },
  { id: 7, date: '2026-01-02', HEntree: '13:00', HSortie: '14:00', motif: 'Réunion RH', Statut: 'TERMINEE' },
  { id: 8, date: '2026-01-02', HEntree: '15:30', HSortie: null, motif: 'Visite technique - équipement', Statut: 'EN_COURS' },
  { id: 9, date: '2025-11-30', HEntree: '10:00', HSortie: '10:15', motif: 'Signature document', Statut: 'TERMINEE' },
  { id: 10, date: '2025-12-01', HEntree: '16:00', HSortie: '16:30', motif: 'Support client', Statut: 'ANNULEE' },
  { id: 11, date: '2025-12-05', HEntree: '09:30', HSortie: '10:00', motif: 'Visite fournisseur', Statut: 'TERMINEE' },
  { id: 12, date: '2025-12-07', HEntree: '11:15', HSortie: '12:45', motif: 'Démo produit', Statut: 'TERMINEE' },
] : [];

export const MOCK_DEPTS = USE_MOCKS ? [
  { department: 'IT', count: 12 },
  { department: 'RH', count: 5 },
  { department: 'Finance', count: 7 },
  { department: 'Sales', count: 10 },
  { department: 'Support', count: 8 },
  { department: 'Marketing', count: 6 },
  { department: 'R&D', count: 3 },
  { department: 'Legal', count: 2 },
] : [];

// Mocks for Secretary Dashboard
export const MOCK_SECRETARY_APPOINTMENTS = USE_MOCKS ? [
  { id: 1, visitorName: 'John Smith', status: 'APPROUVEE', date: '2026-01-15', department: 'IT' },
  { id: 2, visitorName: 'Sarah Johnson', status: 'APPROUVEE', date: '2026-01-16', department: 'Finance' },
  { id: 3, visitorName: 'Mike Chen', status: 'EN_ATTENTE', date: '2026-01-17', department: 'RH' },
  { id: 4, visitorName: 'Emma Wilson', status: 'EN_ATTENTE', date: '2026-01-18', department: 'Marketing' },
  { id: 5, visitorName: 'David Lee', status: 'REJETEE', date: '2026-01-19', department: 'IT' },
] : [];

export const MOCK_SECRETARY_STATS = USE_MOCKS ? {
  pendingAppointments: 2,
  approvedAppointments: 5,
  rejectedAppointments: 1,
  todayVisits: 3,
} : { pendingAppointments:0, approvedAppointments:0, rejectedAppointments:0, todayVisits:0 };

// Mocks for Visitor Dashboard
export const MOCK_VISITOR_APPOINTMENTS = USE_MOCKS ? [
  { id: 1, visitorName: 'John Smith', appointmentDate: '2026-01-15T10:00:00', status: 'Approved', motif: 'Réunion', personnArencontrer: 'Marc Dupont' },
  { id: 2, visitorName: 'John Smith', appointmentDate: '2026-01-20T14:00:00', status: 'Pending', motif: 'Audit', personnArencontrer: 'Sylvie Laurent' },
  { id: 3, visitorName: 'John Smith', appointmentDate: '2026-01-25T11:30:00', status: 'Approved', motif: 'Visite client', personnArencontrer: 'Pierre Bernard' },
] : [];

// Mocks for Employee Dashboard
export const MOCK_EMPLOYEE_APPOINTMENTS = USE_MOCKS ? [
  { id: 1, visitorName: 'John Smith', appointmentDate: '2026-01-15T10:00:00', status: 'Approved', motif: 'Réunion commerciale', nombrePersonnes: 2 },
  { id: 2, visitorName: 'Sarah Johnson', appointmentDate: '2026-01-16T14:30:00', status: 'Approved', motif: 'Audit financier', nombrePersonnes: 1 },
  { id: 3, visitorName: 'Mike Chen', appointmentDate: '2026-01-17T11:00:00', status: 'Pending', motif: 'Visite client', nombrePersonnes: 3 },
  { id: 4, visitorName: 'Emma Wilson', appointmentDate: '2026-01-18T09:30:00', status: 'Approved', motif: 'Présentation produit', nombrePersonnes: 4 },
] : [];

export const MOCK_EMPLOYEE_STATS = USE_MOCKS ? {
  total: 4,
  pending: 1,
  approved: 3,
  rejected: 0,
} : { total:0, pending:0, approved:0, rejected:0 };

export default {
  MOCK_APPOINTMENTS,
  MOCK_PENDING_APPOINTMENTS,
  MOCK_TODAY_APPOINTMENTS,
  MOCK_ACTIVE_VISITS,
  MOCK_CURRENT_VISITORS,
  MOCK_VISITS,
  MOCK_HISTORY,
  MOCK_REPORTS_VISITS,
  MOCK_REPORTS_APPOINTMENTS,
  MOCK_OVERVIEW,
  MOCK_DETAILED_REPORTS,
  MOCK_DEPTS,
  MOCK_SECRETARY_APPOINTMENTS,
  MOCK_SECRETARY_STATS,
  MOCK_VISITOR_APPOINTMENTS,
  MOCK_EMPLOYEE_APPOINTMENTS,
  MOCK_EMPLOYEE_STATS,
};
