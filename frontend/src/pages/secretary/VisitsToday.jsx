import React from 'react';
import { useQuery } from '@tanstack/react-query';
import secretaireService from '../../services/secretaireService';

export default function VisitsToday() {
  const { data: visits = [], isLoading, isError, error } = useQuery({
    queryKey: ['visitsToday'],
    queryFn: () => secretaireService.getVisitsToday(),
    staleTime: 0,
    refetchInterval: 30000,
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROUVEE': return 'bg-vp-mint/10 text-vp-mint border-vp-mint/20';
      case 'EN_ATTENTE': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'REJETEE': return 'bg-red-50 text-red-500 border-red-100';
      case 'TERMINEE': return 'bg-vp-navy text-white border-vp-navy';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-vp-navy mb-1">Visiteurs du Jour</h1>
          <p className="text-slate-500 text-sm font-medium tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vp-mint animate-pulse"></span>
            Suivi en temps réel des accès au bâtiment.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="card py-2 px-4 flex items-center gap-2 text-xs font-bold text-vp-navy bg-slate-50/50">
              <span className="text-vp-mint">●</span> {visits.length} Visites prévues
           </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50">
        {isLoading ? (
          <div className="p-20 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-vp-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400 font-medium">Récupération des données en direct...</p>
          </div>
        ) : isError ? (
          <div className="p-20 text-center text-red-500 bg-red-50/50">
            <span className="text-4xl mb-4 block">⚠️</span>
            <p className="font-bold">Erreur de chargement</p>
            <p className="text-sm opacity-70 italic">{error.message}</p>
          </div>
        ) : visits.length === 0 ? (
          <div className="p-20 text-center">
            <span className="text-4xl mb-4 block">🏢</span>
            <p className="text-slate-400 font-medium text-lg tracking-wide">Aucun visiteur attendu pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Visiteur</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Heure & Motif</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Destination</th>
                  <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {visits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-vp-cyan/[0.02] transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-vp-navy font-black text-sm group-hover:bg-vp-cyan group-hover:text-white transition-all shadow-sm">
                          {(visit.visitorName || 'V').charAt(0)}
                        </div>
                        <p className="text-lg font-black text-vp-navy group-hover:text-vp-cyan transition-colors">{visit.visitorName || 'Visiteur'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="space-y-1">
                        <p className="text-base font-black text-slate-700">{visit.time || visit.hEntree?.split('T')[1]?.substring(0,5) || '—'}</p>
                        <p className="text-xs text-slate-400 font-bold italic truncate max-w-[200px]">"{visit.motif || 'Aucun motif'}"</p>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="inline-flex flex-col">
                        <p className="text-sm font-black text-vp-navy uppercase tracking-tight">🏛️ {visit.department || visit.departement || visit.personneARencontrer || 'Inconnu'}</p>
                        <p className="text-[10px] text-slate-400 font-bold">Localisation / Secteur</p>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border whitespace-nowrap ${getStatusBadge(visit.statut || visit.status)}`}>
                        {(visit.statut || visit.status || 'EN_ATTENTE')?.replace('_', ' ')}
                      </span>
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
