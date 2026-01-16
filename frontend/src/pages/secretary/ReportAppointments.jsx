import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import secretaireService from '../../services/secretaireService';
import { exportToExcel, exportToPDF } from '../../services/exportService';

export default function ReportAppointments() {
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: reports = [], isLoading, isError } = useQuery({
    queryKey: ['secretary', 'reports', 'appointments', { status, dateFrom, dateTo }],
    queryFn: () => secretaireService.getReports({ type: 'appointments', status, dateFrom, dateTo }),
    staleTime: 0,
    refetchInterval: 30000,
  });

  const exportColumns = [
    { key: 'visitorName', label: 'Visiteur' },
    { key: 'appointmentDate', label: 'Date RDV' },
    { key: 'statut', label: 'Statut' },
    { key: 'motif', label: 'Motif' },
  ];

  const handleExportExcel = () => {
    exportToExcel(reports, exportColumns, `visitepulse-rdv-${new Date().toISOString().split('T')[0]}`);
  };

  const handleExportPDF = () => {
    exportToPDF(
      reports,
      exportColumns,
      `visitepulse-rdv-${new Date().toISOString().split('T')[0]}`,
      'Rapport des rendez-vous'
    );
  };

  const getStatusStyle = (s) => {
    if (!s) return 'bg-slate-100 text-slate-500 border-slate-200';
    const v = s.toString().toUpperCase();
    if (v.includes('APPROU')) return 'bg-vp-mint/10 text-vp-mint border-vp-mint/20';
    if (v.includes('ATTENTE')) return 'bg-amber-100 text-amber-600 border-amber-200';
    return 'bg-rose-100 text-rose-600 border-rose-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <Link 
            to="/secretary/reports" 
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm font-bold"
          >
            ←
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-vp-navy">Registre des Rendez-vous</h1>
            <p className="text-slate-500 font-medium tracking-wide italic">Analyse et extraction des demandes prévisionnelles.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={handleExportExcel} 
             disabled={reports.length === 0}
             className="h-12 px-6 bg-vp-mint text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-vp-mint/90 transition-all shadow-lg shadow-vp-mint/10 disabled:opacity-50 flex items-center gap-2"
           >
             <span>📊</span> Excel
           </button>
           <button 
             onClick={handleExportPDF} 
             disabled={reports.length === 0}
             className="h-12 px-6 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/10 disabled:opacity-50 flex items-center gap-2"
           >
             <span>📕</span> PDF
           </button>
        </div>
      </div>

      <div className="card p-8 border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl mb-10 overflow-visible">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Statut opérationnel</label>
               <select
                 value={status}
                 onChange={(e) => setStatus(e.target.value)}
                 className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-vp-cyan/20 focus:border-vp-cyan transition-all font-bold text-vp-navy outline-none appearance-none"
               >
                 <option value="">Tous les dossiers</option>
                 <option value="EN_ATTENTE">⏳ En attente</option>
                 <option value="APPROUVEE">✅ Approuvés</option>
                 <option value="REJETEE">❌ Rejetés</option>
               </select>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date de début</label>
               <input
                 type="date"
                 value={dateFrom}
                 onChange={(e) => setDateFrom(e.target.value)}
                 className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-vp-cyan/20 focus:border-vp-cyan transition-all font-bold text-vp-navy outline-none"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date de fin</label>
               <input
                 type="date"
                 value={dateTo}
                 onChange={(e) => setDateTo(e.target.value)}
                 className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-vp-cyan/20 focus:border-vp-cyan transition-all font-bold text-vp-navy outline-none"
               />
            </div>
         </div>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Visiteur</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Planification</th>
                <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Statut</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Motif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {isLoading ? (
                <tr><td colSpan="4" className="py-24 text-center"><div className="animate-spin w-8 h-8 border-3 border-vp-cyan border-t-transparent rounded-full mx-auto"></div></td></tr>
              ) : isError ? (
                <tr><td colSpan="4" className="py-24 text-center text-rose-500 font-bold">Erreur de chargement.</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan="4" className="py-24 text-center text-slate-400 italic font-bold">Aucun enregistrement trouvé.</td></tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="group hover:bg-vp-cyan/[0.02] transition-colors">
                    <td className="px-8 py-4">
                       <p className="text-lg font-black text-vp-navy group-hover:text-vp-cyan transition-colors">{report.visitorName}</p>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-600 font-bold">{report.appointmentDate}</td>
                    <td className="px-8 py-4 text-center">
                       <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border whitespace-nowrap ${getStatusStyle(report.statut)}`}>
                         {report.statut?.replace('_', ' ')}
                       </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-500 italic max-w-[300px] truncate" title={report.motif}>
                      {report.motif || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
