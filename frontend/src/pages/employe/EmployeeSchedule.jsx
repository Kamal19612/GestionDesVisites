import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import appointmentService from '../../services/appointmentService';

export default function EmployeeSchedule() {
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['employee', 'schedule'],
    queryFn: appointmentService.getAllAppointments,
    staleTime: 0,
    refetchInterval: 30000,
  });

  const approvedAppointments = appointments
    .filter(a => a.statut === 'APPROUVEE')
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link 
          to="/employee/dashboard" 
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm font-bold"
        >
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-vp-navy">Agenda Complet</h1>
          <p className="text-slate-500 font-medium tracking-wide italic">Liste chronologique de vos visites confirmées.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400">
           <div className="animate-spin w-10 h-10 border-4 border-vp-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
           <p className="font-bold uppercase text-[10px] tracking-widest">Initialisation de l'agenda...</p>
        </div>
      ) : approvedAppointments.length === 0 ? (
        <div className="card p-20 text-center text-slate-400 border-dashed border-2">
           <p className="text-5xl mb-6 opacity-20">📭</p>
           <p className="font-black uppercase text-xs tracking-[0.3em]">Agenda vide</p>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100 before:hidden md:before:block">
          {approvedAppointments.map(appointment => (
            <div
              key={appointment.id}
              className="relative pl-0 md:pl-12 group"
            >
              {/* Timeline Indicator */}
              <div className="absolute left-[14px] top-8 w-3 h-3 rounded-full bg-vp-cyan border-2 border-white shadow-sm shadow-vp-cyan/50 hidden md:block z-10 group-hover:scale-125 transition-transform"></div>
              
              <div className="card p-8 md:p-10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all border-l-4 border-l-vp-cyan">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-vp-navy text-white flex items-center justify-center text-xl font-black shadow-lg shadow-vp-navy/10">
                      {appointment.visitorName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-vp-navy group-hover:text-vp-cyan transition-colors">{appointment.visitorName}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(appointment.appointmentDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-sm font-black text-vp-cyan">{appointment.appointmentTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-vp-mint/10 text-vp-mint text-[9px] font-black uppercase tracking-widest rounded-lg border border-vp-mint/10">
                      Confirmé
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg">
                      {appointment.department}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-300">Objet de la rencontre</p>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{appointment.motif}"</p>
                  </div>
                  <div className="flex items-end justify-end">
                    <Link
                      to={`/employee/appointments/${appointment.id}`}
                      className="btn-secondary py-2 px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group/btn"
                    >
                      Détails de la fiche <span className="text-lg group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
