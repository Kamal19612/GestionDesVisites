import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import QRCode from 'react-qr-code';
import { useTranslation } from 'react-i18next';
import appointmentService from '../../services/appointmentService';
import PageHeader from '../../components/ui/PageHeader';
import { formatDate, formatTime } from '../../utils/formatters';

export default function AccessPass() {
  const { id } = useParams();
  const { t } = useTranslation();
  
  // Use getAppointmentById. If not present, we might need to rely on the list cache 
  // but for a dedicated page, fetching by ID is better.
  // Our stubbed service handles this.
  const { data: appointment, isLoading, isError } = useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentService.getAppointmentById(id),
    staleTime: 5 * 60 * 1000 // Cache for 5 mins
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin w-12 h-12 border-4 border-vp-cyan border-t-transparent rounded-full"></div>
    </div>
  );

  if (isError || !appointment) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <span className="text-6xl mb-4">🚫</span>
      <h1 className="text-2xl font-bold text-vp-navy mb-2">Impossible de charger le Pass</h1>
      <p className="text-slate-500 mb-8">Ce rendez-vous n'existe pas ou a expiré.</p>
      <Link to="/visitor/dashboard" className="px-6 py-3 bg-vp-navy text-white rounded-xl font-bold uppercase tracking-widest text-sm">Retour</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <Link to="/visitor/dashboard" className="inline-flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs mb-6 hover:text-vp-navy transition-colors">
          ← Retour
        </Link>
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-vp-navy/20 relative">
          {/* Header Strip */}
          <div className="h-4 bg-gradient-to-r from-vp-navy via-vp-cyan to-vp-mint"></div>
          
          <div className="p-8 text-center flex flex-col items-center">
             {/* Logo / Brand */}
             <div className="mb-6">
                <h2 className="text-2xl font-black text-vp-navy tracking-tighter uppercase">Visite<span className="text-vp-cyan">Pulse</span></h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Access Pass</p>
             </div>

             {/* QR Code Container */}
             <div className="p-4 bg-white rounded-2xl border-4 border-vp-navy/5 shadow-inner mb-8">
               <QRCode 
                 value={JSON.stringify({ id: appointment.id, type: 'VISIT_PASS', t: Date.now() })} 
                 size={200}
                 level="H"
               />
             </div>

             {/* Status Badge */}
             <div className="mb-8">
               <span className="px-6 py-2 rounded-full bg-vp-mint/10 text-vp-mint border border-vp-mint/20 text-sm font-black uppercase tracking-widest">
                 Accès Autorisé
               </span>
             </div>

             {/* Details Grid */}
             <div className="w-full grid grid-cols-2 gap-4 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Visiteur</p>
                 <p className="text-sm font-bold text-vp-navy truncate">{appointment.visitorName}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Date</p>
                  <p className="text-sm font-bold text-vp-navy">{formatDate(appointment.date || appointment.startDate)}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Heure</p>
                  <p className="text-xl font-black text-vp-cyan">{formatTime(appointment.heure || appointment.time)}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Hôte</p>
                  <p className="text-sm font-bold text-vp-navy truncate">{appointment.personneARencontrer || appointment.employeeName || 'Staff'}</p>
               </div>
             </div>
             
             <p className="mt-8 text-[10px] text-slate-300 font-medium text-center italic max-w-xs">
               Présentez ce QR Code au poste de sécurité à votre arrivée. Une pièce d'identité vous sera demandée.
             </p>
          </div>
          
          {/* Bottom Pattern */}
          <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-100/50"></div>
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-vp-mint/10 rounded-full blur-2xl"></div>
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-vp-cyan/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}
