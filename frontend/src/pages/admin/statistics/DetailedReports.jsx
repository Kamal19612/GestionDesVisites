import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import statisticsService from '../../../services/statisticsService';
import toast from 'react-hot-toast';

export default function DetailedReports() {
  const { data, isLoading, isError } = useQuery({ 
    queryKey: ['statistics','reports'], 
    queryFn: () => statisticsService.getHistory(),
    staleTime: 0,
    refetchInterval: 30000,
  });

  const exportToCSV = () => {
    try {
      if (!displayData || displayData.length === 0) {
        toast.error('Aucune donnée à exporter');
        return;
      }
      const headers = ['ID', 'Date', 'Heure Entrée', 'Heure Sortie', 'Visiteur', 'Contact', 'Hôte', 'Département', 'Motif', 'Statut'];
      const rows = displayData.map(r => [
          r.id, 
          r.date, 
          r.HEntree || r.heureArrivee, 
          r.HSortie || r.heureSortie || '', 
          r.visitorName,
          r.visitorPhone || r.visitorEmail,
          r.hostName || r.personneARencontrer,
          r.departement || r.department,
          r.motif, 
          r.Statut || r.statut
      ]);
      const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `visitepulse-rapport-${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
      toast.success('Rapport exporté avec succès');
    } catch (err) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const getStatusStyle = (s) => {
    if (!s) return 'bg-slate-100 text-slate-500 border-slate-200';
    const v = s.toString().toUpperCase();
    if (v.includes('TERM') || v.includes('ARCH')) return 'bg-vp-mint/10 text-vp-mint border-vp-mint/20';
    if (v.includes('EN') || v.includes('COUR')) return 'bg-amber-100 text-amber-600 border-amber-200';
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
      <h2 className="text-xl font-bold text-red-800 mb-2">Centre de Rapports Indisponible</h2>
      <p className="text-sm text-red-600/70 font-medium mb-6">La synchronisation des logs détaillés a échoué.</p>
      <Link to="/admin/statistics" className="btn-secondary px-8">Retour au module</Link>
    </div>
  );

  const displayData = (data && Array.isArray(data)) ? data : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/statistics" 
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm font-bold"
          >
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-vp-navy">Centre de Rapports</h1>
            <p className="text-slate-500 font-medium tracking-wide italic">Extraction et analyse des données brutes.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="card px-6 py-2 border-slate-200 bg-white/50 backdrop-blur-sm flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Lignes</span>
              <span className="text-xl font-black text-vp-navy">{displayData.length}</span>
           </div>
           <button 
             onClick={exportToCSV} 
             className="btn-primary h-12 px-8 flex items-center gap-2 shadow-xl shadow-vp-cyan/20"
           >
             <span className="text-lg">📥</span>
             Exporter
           </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">ID Ref</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Horodatage</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Visiteur</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Destination</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Motif</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayData.length === 0 ? (
                <tr>
                   <td colSpan="6" className="py-24 text-center">
                      <p className="text-sm font-bold text-slate-300 italic">Aucun log à afficher pour cette période.</p>
                   </td>
                </tr>
              ) : (
                displayData.map((row) => (
                  <tr key={row.id} className="group hover:bg-vp-cyan/[0.02] transition-colors">
                    <td className="px-6 py-6">
                      <span className="text-[10px] font-black font-mono text-vp-cyan py-1 px-2 bg-vp-cyan/5 rounded-md">#{row.id}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-vp-navy">{row.date}</p>
                        <p className="text-[10px] font-bold text-slate-400 italic">
                             {row.HEntree || row.heureArrivee || '--:--'} - {row.HSortie || row.heureSortie || '...'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                        <div className="space-y-1">
                            <p className="text-sm font-black text-slate-700">{row.visitorName || 'Anonyme'}</p>
                            <p className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]">{row.visitorPhone || row.visitorEmail || 'Non spécifié'}</p>
                        </div>
                    </td>
                    <td className="px-6 py-6">
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-vp-navy">{row.hostName || row.personneARencontrer || 'N/A'}</p>
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded">{row.departement || row.department || 'GEN'}</span>
                        </div>
                    </td>
                    <td className="px-6 py-6 font-medium text-slate-600 text-sm max-w-[200px] truncate" title={row.motif}>
                      {row.motif}
                    </td>
                    <td className="px-6 py-6 text-center">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(row.Statut || row.statut)}`}>
                         {row.Statut || row.statut || 'N/A'}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 p-10 bg-vp-navy rounded-[40px] text-white relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-vp-mint/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-4">Information de Rapports</p>
        <p className="text-sm font-medium leading-relaxed max-w-2xl opacity-80">
          Les rapports générés ici incluent l'ID technique, la date, les horodateurs d'entrée/sortie, le motif complet (incluant le département) et le statut opérationnel final. Utilisez ces colonnes pour vos pivots et tableaux de bord analytiques.
        </p>
      </div>
    </div>
  );
}

