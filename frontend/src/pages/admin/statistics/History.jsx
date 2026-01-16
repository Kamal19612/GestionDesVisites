import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import statisticsService from '../../../services/statisticsService';

export default function History() {
  const { data, isLoading, isError } = useQuery({ 
    queryKey: ['statistics','history'], 
    queryFn: () => statisticsService.getHistory(),
    staleTime: 0,
    refetchInterval: 30000,
  });

  const getStatusStyle = (s) => {
    if (!s) return 'bg-slate-100 text-slate-500 border-slate-200';
    const v = s.toString().toUpperCase();
    if (v.includes('TERM')) return 'bg-vp-mint/10 text-vp-mint border-vp-mint/20';
    if (v.includes('EN')) return 'bg-amber-100 text-amber-600 border-amber-200';
    return 'bg-rose-100 text-rose-600 border-rose-200';
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-12 h-12 border-4 border-vp-cyan border-t-transparent rounded-full"></div>
    </div>
  );

  if (isError) return (
    <div className="max-w-2xl mx-auto mt-20 p-8 border-2 border-dashed border-red-200 rounded-3xl text-center bg-red-50/30">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-xl font-bold text-red-800 mb-2">Erreur de chargement</h2>
      <p className="text-sm text-red-600/70 font-medium mb-6">Impossible de synchroniser l'historique des visites.</p>
      <Link to="/admin/statistics" className="btn-secondary px-8">Retour au module</Link>
    </div>
  );

  const displayData = (data && Array.isArray(data)) ? data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link 
          to="/admin/statistics" 
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm font-bold"
        >
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-vp-navy">Historique des Visites</h1>
          <p className="text-slate-500 font-medium tracking-wide italic">Registre chronologique complet de l'établissement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="card p-8 border-none shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-vp-navy"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Volume Total</p>
          <p className="text-4xl font-black text-vp-navy">{displayData.length}</p>
          <p className="text-[10px] text-slate-400 font-bold mt-2 italic">Depuis le début de l'année</p>
        </div>
        <div className="card p-8 border-none shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-vp-mint"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Dernier Sync</p>
          <p className="text-2xl font-bold text-vp-navy mt-1 tracking-tight">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
          <div className="flex items-center gap-2 mt-3 text-[10px] font-black uppercase tracking-widest text-vp-mint">
             <span className="w-1.5 h-1.5 rounded-full bg-vp-mint animate-pulse"></span>
             Live Data
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Date & Heures</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Motif & Département</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Visiteur</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Gestion</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayData.length === 0 ? (
                <tr>
                   <td colSpan="5" className="py-24 text-center">
                      <p className="text-sm font-bold text-slate-300 italic">Aucune donnée historique disponible pour le moment.</p>
                   </td>
                </tr>
              ) : (
                displayData.map((row) => (
                  <tr key={row.id} className="group hover:bg-vp-cyan/[0.02] transition-colors">
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-vp-navy">{row.date}</p>
                        <p className="text-[10px] font-bold text-slate-400 italic">{row.HEntree} → {row.HSortie || '...'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="space-y-1">
                         <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-[200px] truncate" title={row.motif}>
                           {row.motif}
                         </p>
                         <p className="text-[10px] font-black uppercase tracking-tighter text-vp-cyan">
                           {row.motif?.includes('[') ? row.motif.split(']')[0].replace('[', '') : 'Division N/A'}
                         </p>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-vp-navy/5 flex items-center justify-center text-[10px] font-black text-vp-navy shrink-0">
                           {row.visiteur?.charAt(0) || 'V'}
                         </div>
                         <p className="text-sm font-bold text-vp-navy">{row.visiteur || 'Non spécifié'}</p>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="space-y-2">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] opacity-40">🛡️</span>
                             <p className="text-[10px] font-bold text-slate-500">{row.agentSecurite || 'Système'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] opacity-40">📝</span>
                             <p className="text-[10px] font-bold text-slate-500">{row.secretaire || 'Auto'}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(row.Statut)}`}>
                         {row.Statut || 'Inconnu'}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 p-8 rounded-3xl bg-slate-50/50 border border-slate-100 flex gap-6">
         <span className="text-2xl mt-1">💡</span>
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Astuce Analyste</p>
            <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
              Vous pouvez obtenir un export plus détaillé (PDF/Excel) en utilisant le centre de rapports. Les données affichées ici sont optimisées pour une consultation rapide et un suivi opérationnel en direct.
            </p>
         </div>
      </div>
    </div>
  );
}
