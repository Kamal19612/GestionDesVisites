import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import visitService from '../../services/visitService';
import appointmentService from '../../services/appointmentService';

export default function VisitHistory() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [activeTab, setActiveTab] = useState('archives'); // 'archives' or 'upcoming'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: visits = [], isLoading: visitsLoading, isError: visitsError } = useQuery({
    queryKey: ['visits', 'history'],
    queryFn: () => visitService.getAllVisits(),
    staleTime: 0,
    refetchInterval: 5000,
  });

  const { data: appointments = [], isLoading: aptsLoading } = useQuery({
    queryKey: ['appointments', 'approved'],
    queryFn: () => appointmentService.getAllAppointments(),
    staleTime: 0,
    refetchInterval: 5000,
  });

  // Robust date parser (handles [yyyy, mm, dd] array or string)
  const parseDate = (dateVal) => {
    if (!dateVal) return new Date(0); // Epoch
    if (Array.isArray(dateVal)) {
        // Month is 1-based in LocalTime array (usually), but Date() expects 0-based? 
        // Iterate: [2024, 3, 20] -> new Date(2024, 2, 20)
        return new Date(dateVal[0], dateVal[1] - 1, dateVal[2]);
    }
    return new Date(dateVal);
  };

  // Robust time formatter
  const formatTimeVal = (timeVal) => {
      if (!timeVal) return '--:--';
      if (Array.isArray(timeVal)) {
          // [14, 30] or [14, 30, 0]
          const h = timeVal[0].toString().padStart(2, '0');
          const m = timeVal[1].toString().padStart(2, '0');
          return `${h}:${m}`;
      }
      return String(timeVal).substring(0, 5);
  };

  const filteredData = React.useMemo(() => {
    let data = activeTab === 'archives' ? visits : appointments;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter
    const result = data.filter(item => {
      const itemDate = parseDate(item.date);
      
      // Status Check
      // Status Check
      // For 'upcoming', check strictly if DateTime > Now
      const resultDate = parseDate(item.date);
      let isTimeRelevant = true;
      
      if (activeTab === 'upcoming') {
          if (resultDate < today) {
             isTimeRelevant = false; 
          } else if (resultDate.getTime() === today.getTime()) {
             // Same day: Check time
             const now = new Date();
             const nowH = now.getHours();
             const nowM = now.getMinutes();
             let itemH = 0, itemM = 0;
             
             // Handle array [H, M] or string "HH:MM"
             const timeVal = item.heure || item.appointmentTime || item.time;
             if (Array.isArray(timeVal)) {
                 itemH = timeVal[0];
                 itemM = timeVal[1];
             } else if (typeof timeVal === 'string' && timeVal.includes(':')) {
                 const parts = timeVal.split(':');
                 itemH = parseInt(parts[0], 10);
                 itemM = parseInt(parts[1], 10);
             }
             
             // Filter: Future if H > nowH OR (H==nowH AND M > nowM)
             isTimeRelevant = itemH > nowH || (itemH === nowH && itemM > nowM);
          }
      }
      
      const isApproved = true; // Still showing all statuses, just filtered by time
        
      const matchesSearch = item.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.motif?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date Filter Input (exact match)
      const matchesDate = !filterDate || (item.date && item.date.toString() === filterDate);
      
      return isTimeRelevant && matchesSearch && matchesDate;
    });

    // Sort
    return result.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        
        if (activeTab === 'upcoming') {
            // Ascending (Closest first)
            return dateA - dateB;
        } else {
            // Descending (Newest first)
            return dateB - dateA;
        }
    });
  }, [visits, appointments, searchTerm, filterDate, activeTab]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, filterDate]);

  const isLoading = activeTab === 'archives' ? visitsLoading : aptsLoading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <Link to="/agent/dashboard" className="text-[10px] font-black text-vp-cyan uppercase tracking-[0.2em] hover:text-vp-navy transition-colors mb-2 block">← {t('common.back')}</Link>
          <h1 className="text-3xl font-black text-vp-navy tracking-tight">{t('agent.history.title')}</h1>
          <p className="text-slate-500 font-medium text-sm">{t('agent.history.subtitle')}</p>
        </div>

        <div className="flex p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50 ring-4 ring-slate-100/30">
           <button 
             onClick={() => setActiveTab('archives')}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'archives' ? 'bg-white text-vp-navy shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-vp-navy'}`}
           >
             📜 {t('agent.history.tabs.archives')}
           </button>
           <button 
             onClick={() => setActiveTab('upcoming')}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'upcoming' ? 'bg-white text-vp-navy shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-vp-navy'}`}
           >
             📅 {t('agent.history.tabs.upcoming')}
           </button>
        </div>
      </div>

      <div className="card p-6 bg-white border-none shadow-xl shadow-slate-200/50 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale">🔍</span>
            <input 
              type="text" 
              placeholder={t('agent.entry.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-5 h-12 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-vp-cyan/20 focus:border-vp-cyan transition-all font-bold text-vp-navy text-sm outline-none"
            />
          </div>
          <div>
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-5 h-12 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-vp-cyan/20 focus:border-vp-cyan transition-all font-bold text-vp-navy text-sm outline-none"
            />
          </div>
          <div className="flex items-center justify-end">
             <div className="px-5 py-2.5 bg-vp-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-vp-navy/20">
               {filteredData.length} Enregistrement(s)
             </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/50 relative bg-white/80 backdrop-blur-xl min-h-[500px] flex flex-col">
        <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'archives' ? 'bg-vp-cyan' : 'bg-vp-mint'}`}></div>
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-20">
            <div className="animate-spin w-8 h-8 border-4 border-vp-cyan border-t-transparent rounded-full mb-4"></div>
            <span className="text-slate-300 font-black uppercase text-xs tracking-widest italic ml-3">{t('common.loading')}</span>
          </div>
        ) : visitsError && activeTab === 'archives' ? (
          <div className="flex-1 p-20 text-center text-red-500 font-bold">{t('common.error')}</div>
        ) : filteredData.length === 0 ? (
          <div className="flex-1 p-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest italic">{t('agent.history.table.empty') || "Aucun enregistrement."}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">{t('agent.history.table.time')}</th>
                    <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">{t('agent.history.table.visitor')}</th>
                    <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400">{t('agent.history.table.goal')}</th>
                    <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">{t('agent.history.table.state')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-3 whitespace-nowrap">
                         <div className="flex flex-col">
                         <span className="text-xs font-black text-vp-navy">
                             {Array.isArray(item.date) ? `${item.date[0]}-${String(item.date[1]).padStart(2,'0')}-${String(item.date[2]).padStart(2,'0')}` : item.date}
                         </span>
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                           {activeTab === 'archives' 
                             ? `${formatTimeVal(item.heureArrivee)} - ${item.heureSortie ? formatTimeVal(item.heureSortie) : '--:--'}`
                             : `${formatTimeVal(item.heure)}`
                           }
                         </span>
                       </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shadow-inner transition-colors ${activeTab === 'archives' ? 'bg-vp-cyan/10 text-vp-cyan group-hover:bg-vp-cyan group-hover:text-white' : 'bg-vp-mint/10 text-vp-mint group-hover:bg-vp-mint group-hover:text-white'}`}>
                            {item.visitorName?.charAt(0) || 'V'}
                          </div>
                          <div>
                             <span className="text-xs font-black text-vp-navy block leading-none mb-1">{item.visitorName || 'Visiteur'}</span>
                             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t('agent.history.status.confirmed_identity')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-slate-600 line-clamp-1 max-w-[350px]">
                            {activeTab === 'archives' 
                              ? (item.motif?.includes('-') ? item.motif.split('-').slice(1).join('-').trim() : item.motif)
                              : item.motif
                            }
                          </span>
                          <div className="flex items-center gap-2">
                             <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${activeTab === 'archives' ? 'bg-vp-cyan/10 text-vp-cyan' : 'bg-vp-mint/10 text-vp-mint'}`}>
                               {item.departement || item.department || 'Poste Fixe'}
                             </span>
                             {activeTab === 'upcoming' && (
                               <span className="text-[8px] font-black text-slate-400 uppercase italic">Hôte: {item.personneARencontrer}</span>
                             )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center">
                         {activeTab === 'archives' ? (
                            <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                              item.heureSortie ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-vp-mint/10 text-vp-mint border-vp-mint/20'
                            }`}>
                              {item.heureSortie ? t('agent.history.status.closed') : t('agent.history.status.active')}
                            </span>
                       ) : (
                          /* Dynamic Status for Appointments */
                          <div className="scale-90 inline-block">
                             <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                               (item.statut === 'VALIDE' || item.status === 'VALIDE') ? 'bg-vp-mint/10 text-vp-mint border-vp-mint/20' : 
                               (item.statut === 'EN_ATTENTE') ? 'bg-amber-100 text-amber-600 border-amber-200' : 
                               'bg-slate-100 text-slate-500 border-slate-200'
                             }`}>
                               {(item.statut === 'VALIDE' || item.status === 'VALIDE') ? t('status.VALIDE') : 
                                (item.statut === 'EN_ATTENTE') ? t('status.EN_ATTENTE') : item.statut}
                             </span>
                          </div>
                       )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                 <button
                   onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                   disabled={currentPage === 1}
                   className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:text-vp-navy hover:shadow-md transition-all disabled:opacity-30 disabled:hover:shadow-none"
                 >
                   ← Précédent
                 </button>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   Page {currentPage} / {totalPages}
                 </span>
                 <button
                   onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                   disabled={currentPage === totalPages}
                   className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:text-vp-navy hover:shadow-md transition-all disabled:opacity-30 disabled:hover:shadow-none"
                 >
                   Suivant →
                 </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
