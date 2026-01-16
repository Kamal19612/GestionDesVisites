import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import appointmentService from '../../services/appointmentService';

export default function EmployeeAppointmentDetail() {
  const { id } = useParams();

  const { data: appointment, isLoading, isError, error } = useQuery({
    queryKey: ['employee', 'appointments', id],
    queryFn: () => appointmentService.getAppointmentById(id),
    enabled: !!id,
    staleTime: 0,
    refetchInterval: 30000,
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-12 h-12 border-4 border-vp-cyan border-t-transparent rounded-full"></div>
    </div>
  );

  if (isError) return (
    <div className="max-w-2xl mx-auto mt-20 p-8 border-2 border-dashed border-red-200 rounded-3xl text-center bg-red-50/30">
      <p className="text-4xl mb-4">⚠️</p>
      <h2 className="text-xl font-bold text-red-800 mb-2">Erreur de chargement</h2>
      <p className="text-sm text-red-600/70 font-medium mb-6">{error?.message || 'Le rendez-vous est introuvable ou vous n\'y avez pas accès.'}</p>
      <Link to="/employee/schedule" className="btn-secondary px-8">Retour au planning</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link 
          to="/employee/schedule" 
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm font-bold"
        >
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-vp-navy">Fiche Rendez-vous</h1>
          <p className="text-slate-500 font-medium tracking-wide">Détails complets de la visite programmée.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visitor Profile */}
        <div className="lg:col-span-1">
          <div className="card text-center p-10 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-vp-cyan to-vp-mint"></div>
             <div className="w-24 h-24 rounded-3xl bg-vp-navy mx-auto mb-6 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-vp-navy/20">
               {appointment.visitorName?.charAt(0)}
             </div>
             <h2 className="text-2xl font-black text-vp-navy mb-1">{appointment.visitorName}</h2>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6 italic">{appointment.visitorEmail}</p>
             
             <div className="space-y-3 pt-6 border-t border-slate-50">
               <a 
                 href={`mailto:${appointment.visitorEmail}`}
                 className="w-full btn-secondary py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
               >
                 📧 Envoyer un Mail
               </a>
               <a 
                 href={`tel:${appointment.visitorPhone}`}
                 className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-vp-cyan hover:bg-vp-cyan/10 rounded-xl transition-all"
               >
                 📞 Contacter ({appointment.visitorPhone || 'N/A'})
               </a>
             </div>
          </div>

          <div className="card mt-6 p-8 bg-vp-navy text-white relative overflow-hidden">
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-vp-mint/10 rounded-full blur-3xl"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-vp-mint mb-4">Statut Actuel</p>
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shadow-inner">✓</div>
               <div>
                  <p className="font-bold text-lg">Approuvé</p>
                  <p className="text-[10px] text-white/50 font-medium">Validé par le secrétariat</p>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Appointment Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-10 shadow-2xl shadow-slate-200/40">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8 pb-4 border-b border-slate-50">Agenda & Programme</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-tighter text-vp-cyan italic">Date Prévue</p>
                <p className="text-lg font-bold text-vp-navy">
                  {new Date(appointment.appointmentDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-tighter text-vp-cyan italic">Heure de Visite</p>
                <p className="text-lg font-bold text-vp-navy">{appointment.appointmentTime}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-tighter text-vp-cyan italic">Département</p>
                <p className="text-lg font-bold text-vp-navy">{appointment.department || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-tighter text-vp-cyan italic">Nombre de Visiteurs</p>
                <p className="text-lg font-bold text-vp-navy">{appointment.nombrePersonnes || 1} Personne(s)</p>
              </div>
            </div>
          </div>

          <div className="card p-10 bg-slate-50/50 border-none shadow-none">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Détails de l'Entretien</h3>
            <div className="space-y-8">
               <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Objet / Motif</p>
                 <p className="text-base text-slate-600 font-medium leading-relaxed italic">"{appointment.motif}"</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Hôte (Vous)</p>
                    <p className="text-sm font-bold text-vp-navy">{appointment.personnArencontrer || 'Non spécifié'}</p>
                  </div>
                  {appointment.approvedDate && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Date d'approbation</p>
                      <p className="text-sm font-bold text-vp-navy">{new Date(appointment.approvedDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {appointment.comments && (
            <div className="p-8 rounded-3xl bg-vp-cyan/5 border border-vp-cyan/10 flex gap-6">
              <span className="text-2xl mt-1">💬</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-vp-cyan mb-2">Instructions supplémentaires</p>
                <p className="text-sm text-vp-navy/80 font-medium leading-relaxed italic">{appointment.comments}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
