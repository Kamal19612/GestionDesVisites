import api from './api'

const statisticsService = {
  getOverview: async () => {
    // Admin stats endpoint
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getHistory: async () => {
    // Fetch visits and all appointments
    const [visitsRes, aptsRes] = await Promise.all([
       api.get('/agent/visites/historique'),
       api.get('/secretaire/rendezvous/calendrier')
    ]);

    const visits = visitsRes.data || [];
    const appointments = aptsRes.data || [];

    // Create a map of visits by rendezVousId for fast lookup
    const visitMap = new Map();
    visits.forEach(v => {
        if (v.rendezVousId) visitMap.set(v.rendezVousId, v);
    });

    // Strategy: We want ONE entry per interaction.
    // Base is appointments. If a visit exists, upgrades the entry to "Visit" (with real times).
    // If no visit exists (Pending, Rejected, Validated-but-waiting), show as "Appointment".
    
    // Note: Visits created 'DIRECTLY' might not have a corresponding appointment in the default list 
    // if not synced properly, but usually they do have a hidden generated RDV. 
    // For safety, we process all appointments, then check if any 'DIRECT' visits were missed.

    const historyIds = new Set();
    const cleanHistory = [];

    // 1. Process all Appointments
    appointments.forEach(apt => {
        const relatedVisit = visitMap.get(apt.id);
        
        let entry = {};
        
        if (relatedVisit) {
            // Priority: Use Visit Data (Real timestamps)
            entry = { ...relatedVisit };
            // Ensure status is from Visit
        } else {
            // Use Appointment Data (Projected)
            entry = {
                id: `apt-${apt.id}`,
                date: apt.date,
                heureArrivee: apt.heure || apt.time,
                heureSortie: null, // Not started
                motif: apt.motif,
                departement: apt.departement || apt.department,
                visitorName: apt.visitorName,
                agentNom: 'N/A',
                statut: apt.statut // EN_ATTENTE, REFUSE, VALIDE...
            };
        }
        
        // Avoid duplicates if visit list had same ID (unlikely with this logic but safe)
        if (!historyIds.has(entry.id)) {
            cleanHistory.push(entry);
            historyIds.add(entry.id);
        }
    });

    // 2. Add any 'Orphan' Visits (Direct visits not linked to fetched appointments for some reason)
    visits.forEach(v => {
        if (!historyIds.has(v.id)) { // Visit ID distinct from Apt ID check? 
            // Wait, logic above used visit object which has visit ID. 
            // Check if visit was used using the map lookup.
            // Simplified: If visit.rendezVousId was in map, it was used? 
            // Actually, we looked up by Apt ID.
            
            // If a visit has no rendezVousId, or its RDV wasn't in the apts list:
            // We should add it.
            const linkedApt = appointments.find(a => a.id === v.rendezVousId);
            if (!linkedApt) {
                 cleanHistory.push(v);
            }
        }
    });

    return cleanHistory.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
  },
  getByDepartment: async () => {
    const res = await api.get('/statistiques/par-departement')
    return res.data
  },
  getAverageDuration: async () => {
    const res = await api.get('/statistiques/duree-moyenne')
    return res.data
  },
}

export default statisticsService
