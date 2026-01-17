import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import appointmentService from '../../services/appointmentService';

export default function EmployeeDashboard() {
  const { data: approvedAppointments = [], isLoading } = useQuery({
    queryKey: ['employee', 'appointments', 'today'],
    queryFn: appointmentService.getTodayAppointments,
    staleTime: 0,
    refetchInterval: 30000,
  });

  // Backend already filters by today and validated status
  // so no client-side filtering needed unless we want to be extra safe
  // Sorting by time is still good for UI
  const sortedAppointments = [...approvedAppointments].sort((a, b) => {
     return new Date('1970/01/01 ' + a.appointmentTime) - new Date('1970/01/01 ' + b.appointmentTime);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-vp-navy mb-2">Mon Planning</h1>
          <p className="text-slate-500 font-medium tracking-wide">Consultez et gérez vos rendez-vous validés par le secrétariat.</p>
        </div>
        <div className="flex gap-4">
           <div className="card py-2 px-6 flex items-center gap-3 text-sm font-bold text-vp-navy bg-vp-cyan/10 border-vp-cyan/20">
              <span className="w-2 h-2 rounded-full bg-vp-cyan animate-pulse"></span>
              {sortedAppointments.length} Confirmés
           </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
        <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between bg-white">
           <h2 className="text-xl font-bold text-vp-navy">Calendrier des visites</h2>
           <Link to="/employee/schedule" className="text-xs font-bold text-vp-cyan uppercase tracking-widest hover:underline">Vue Calendrier</Link>
        </div>

        {isLoading ? (
          <div className="p-20 text-center text-slate-400">
             <div className="animate-spin w-10 h-10 border-4 border-vp-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="font-medium tracking-wide uppercase text-[10px]">Actualisation du planning...</p>
          </div>
        ) : sortedAppointments.length === 0 ? (
          <div className="p-20 text-center text-slate-400">
             <p className="text-4xl mb-6">📅</p>
             <p className="font-medium uppercase text-xs tracking-[0.2em] mb-2">Aucun rendez-vous pour le moment</p>
             <p className="text-xs text-slate-400 italic font-medium">Les demandes validées apparaîtront ici automatiquement.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Visiteur</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Date & Heure</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Motif & Service</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedAppointments.map((apt) => (
                  <tr key={apt.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-vp-cyan/10 text-vp-cyan flex items-center justify-center font-bold text-xs shadow-inner">
                          {apt.visitorName?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-vp-navy">{apt.visitorName}</p>
                          <p className="text-xs text-slate-400 italic">{apt.visitorEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-vp-navy flex items-center gap-2">
                          <span className="text-vp-cyan text-base">🕒</span> {apt.appointmentTime}
                        </p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                          {new Date(apt.appointmentDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="space-y-1">
                          <p className="text-sm text-slate-600 font-medium truncate max-w-[200px]">"{apt.motif}"</p>
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-black uppercase text-slate-500 tracking-tighter italic">{apt.department}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link
                        to={`/employee/appointments/${apt.id}`}
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-vp-cyan hover:text-vp-navy transition-colors group-hover:translate-x-1 duration-300"
                      >
                        Consulter <span className="text-lg">→</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-12 p-8 bg-vp-navy rounded-3xl text-white relative overflow-hidden flex items-center shadow-xl shadow-vp-navy/20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-vp-cyan/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
         <div className="flex gap-6 relative z-10">
           <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shadow-inner">💡</div>
           <div>
             <h4 className="font-bold mb-2">Bon à savoir</h4>
             <p className="text-xs text-white/50 leading-relaxed font-medium max-w-xl">
               Les rendez-vous sont synchronisés toutes les 30 secondes. Si vous ne voyez pas un rendez-vous attendu, assurez-vous qu'il a bien été validé par le secrétariat. Pour toute modification, veuillez contacter l'accueil.
             </p>
           </div>
         </div>
      </div>
    </div>
  );
}
