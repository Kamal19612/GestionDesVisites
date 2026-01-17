import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import visitService from '../../services/visitService';
import appointmentService from '../../services/appointmentService';

export default function VisitHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [activeTab, setActiveTab] = useState('archives'); // 'archives' or 'upcoming'

  const { data: visits = [], isLoading: visitsLoading, isError: visitsError } = useQuery({
    queryKey: ['visits', 'history'],
    queryFn: () => visitService.getAllVisits(),
    staleTime: 60000,
  });

  const { data: appointments = [], isLoading: aptsLoading } = useQuery({
    queryKey: ['appointments', 'approved'],
    queryFn: () => appointmentService.getAllAppointments(),
    staleTime: 60000,
  });

  const filteredVisits = visits.filter(v => {
    const matchesSearch = v.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.motif?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || v.date === filterDate;
    return matchesSearch && matchesDate;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const upcomingVisits = appointments.filter(a => {
    const isApproved = a.statut === 'APPROUVEE' || a.status === 'APPROUVEE';
    const matchesSearch = a.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.motif?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || a.date === filterDate;
    return isApproved && matchesSearch && matchesDate;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  const isLoading = activeTab === 'archives' ? visitsLoading : aptsLoading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <Link to="/agent/dashboard" className="text-[10px] font-black text-vp-cyan uppercase tracking-[0.2em] hover:text-vp-navy transition-colors mb-2 block">← Retour Dashboard</Link>
          <h1 className="text-3xl font-black text-vp-navy tracking-tight">Registre & Attentes</h1>
          <p className="text-slate-500 font-medium text-sm">Synchronisation des flux passés et des visites à venir.</p>
        </div>

        <div className="flex p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50 ring-4 ring-slate-100/30">
           <button 
             onClick={() => setActiveTab('archives')}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'archives' ? 'bg-white text-vp-navy shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-vp-navy'}`}
           >
             📜 Archives
           </button>
           <button 
             onClick={() => setActiveTab('upcoming')}
             className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'upcoming' ? 'bg-white text-vp-navy shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-vp-navy'}`}
           >
             📅 À Venir
           </button>
        </div>
      </div>

      <div className="card p-6 bg-white border-none shadow-xl shadow-slate-200/50 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 grayscale">🔍</span>
            <input 
              type="text" 
              placeholder="Rechercher un visiteur..." 
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
               {activeTab === 'archives' ? filteredVisits.length : upcomingVisits.length} Enregistrement(s)
             </div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/50 relative bg-white/80 backdrop-blur-xl">
        <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'archives' ? 'bg-vp-cyan' : 'bg-vp-mint'}`}></div>
        {isLoading ? (
          <div className="p-20 text-center animate-pulse text-slate-300 font-black uppercase text-xs tracking-widest italic">Synchronisation...</div>
        ) : visitsError && activeTab === 'archives' ? (
          <div className="p-20 text-center text-red-500 font-bold">Erreur de connexion.</div>
        ) : (activeTab === 'archives' ? filteredVisits : upcomingVisits).length === 0 ? (
          <div className="p-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest italic">Aucun enregistrement trouvé.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Temporel</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Visiteur</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Objectif & Lieu</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(activeTab === 'archives' ? filteredVisits : upcomingVisits).map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-8 py-5 whitespace-nowrap">
                       <div className="flex flex-col">
                         <span className="text-sm font-black text-vp-navy">{item.date}</span>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                           {activeTab === 'archives' 
                             ? `${item.HEntree} - ${item.HSortie || '--:--'}`
                             : `${item.time || item.appointmentTime || '--:--'}`
                           }
                         </span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shadow-inner transition-colors ${activeTab === 'archives' ? 'bg-vp-cyan/10 text-vp-cyan group-hover:bg-vp-cyan group-hover:text-white' : 'bg-vp-mint/10 text-vp-mint group-hover:bg-vp-mint group-hover:text-white'}`}>
                          {item.visitorName?.charAt(0) || 'V'}
                        </div>
                        <div>
                           <span className="text-sm font-black text-vp-navy block leading-none mb-1">{item.visitorName || 'Visiteur'}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Identité confirmée</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-600 line-clamp-1 max-w-[350px]">
                          {activeTab === 'archives' 
                            ? (item.motif?.includes('-') ? item.motif.split('-').slice(1).join('-').trim() : item.motif)
                            : item.motif
                          }
                        </span>
                        <div className="flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${activeTab === 'archives' ? 'bg-vp-cyan/10 text-vp-cyan' : 'bg-vp-mint/10 text-vp-mint'}`}>
                             {item.departement || item.department || 'Poste Fixe'}
                           </span>
                           {activeTab === 'upcoming' && (
                             <span className="text-[8px] font-black text-slate-400 uppercase italic">Hôte: {item.personneARencontrer}</span>
                           )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       {activeTab === 'archives' ? (
                          <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                            item.HSortie ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-vp-mint/10 text-vp-mint border-vp-mint/20'
                          }`}>
                            {item.HSortie ? 'Clôturée' : 'Active'}
                          </span>
                       ) : (
                          <span className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border bg-vp-navy text-white border-vp-navy relative overflow-hidden group/badge">
                             <span className="relative z-10">Validée</span>
                             <div className="absolute inset-0 bg-vp-cyan -translate-x-full group-hover/badge:translate-x-0 transition-transform"></div>
                          </span>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
