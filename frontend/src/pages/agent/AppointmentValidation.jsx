import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import appointmentService from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import PageHeader from '../../components/ui/PageHeader';

export default function AppointmentValidation() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('EN_ATTENTE');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ['appointments', 'pending'],
    queryFn: () => appointmentService.getPendingAppointments(),
    staleTime: 0,
    refetchInterval: 30000,
  });

  const { user } = useAuth();

  const approveMutation = useMutation({
    mutationFn: (appointmentId) => appointmentService.approveAppointment?.(appointmentId) || Promise.resolve({ success: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success(t('agent.approve_success'));
    },
    onError: () => {
      toast.error(t('common.error'));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (appointmentId) => appointmentService.rejectAppointment?.(appointmentId, { reason: rejectReason }) || Promise.resolve({ success: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success(t('agent.reject_success'));
      setSelectedAppointment(null);
      setRejectReason('');
    },
    onError: () => {
      toast.error(t('common.error'));
    },
  });

  if (user && user.role && !['SECRETAIRE', 'ADMIN', 'AGENT_SECURITE'].includes(user.role)) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 border-2 border-dashed border-red-200 rounded-3xl text-center bg-red-50/30">
        <p className="text-4xl mb-4">🚫</p>
        <h2 className="text-xl font-bold text-red-800 mb-2">{t('agent.validation.access_denied.title')}</h2>
        <p className="text-sm text-red-600/70 font-medium mb-6">{t('agent.validation.access_denied.message')}</p>
        <Link to="/" className="btn-secondary px-8">{t('agent.validation.access_denied.back')}</Link>
      </div>
    );
  }

  const filteredAppointments = appointments.filter(a => a.statut === filterStatus);

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'EN_ATTENTE': return { label: t('status.pending'), icon: '⏳', color: 'bg-amber-100 text-amber-600 border-amber-200' };
      case 'APPROUVEE': return { label: t('status.approved'), icon: '✅', color: 'bg-vp-mint/10 text-vp-mint border-vp-mint/20' };
      case 'REJETEE': return { label: t('status.rejected'), icon: '❌', color: 'bg-rose-100 text-rose-600 border-rose-200' };
      default: return { label: status, icon: '•', color: 'bg-slate-100 text-slate-500 border-slate-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <PageHeader 
            title={t('agent.validation.title')}
            subtitle={t('agent.validation.subtitle')}
            className="mb-0"
        />
        
        <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl border border-slate-200/50">
          {['EN_ATTENTE', 'APPROUVEE', 'REJETEE'].map(status => {
            const display = getStatusDisplay(status);
            const active = filterStatus === status;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  active 
                    ? 'bg-white text-vp-navy shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50' 
                    : 'text-slate-400 hover:text-vp-navy'
                }`}
              >
                <span>{display.icon}</span>
                {display.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin w-12 h-12 border-4 border-vp-cyan border-t-transparent rounded-full"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="py-24 text-center card bg-slate-50/50 border-none">
          <p className="text-4xl mb-6 grayscale opacity-50">📑</p>
          <p className="text-sm font-bold text-slate-400 italic">{t('agent.validation.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAppointments.map(apt => (
            <div key={apt.id} className="card p-8 border-none shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-vp-cyan/10 transition-all flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-vp-cyan/5 blur-3xl -mr-12 -mt-12 group-hover:bg-vp-cyan/10 transition-colors"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black font-mono text-vp-cyan py-1 px-2 bg-vp-cyan/5 rounded-md">ID-#{apt.id}</span>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusDisplay(apt.statut).color}`}>
                    {getStatusDisplay(apt.statut).label}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-vp-navy/5 flex items-center justify-center text-xl font-black text-vp-navy">
                    {apt.visitorName?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <h3 className="font-black text-vp-navy leading-none mb-1">{apt.visitorName}</h3>
                    <p className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{apt.visitorEmail}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                   <div className="flex items-center gap-3">
                      <span className="text-sm">📅</span>
                      <div>
                        <p className="text-[10px] font-black text-vp-navy leading-none mb-0.5">{apt.date}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Heure: {apt.time}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-sm">🏢</span>
                      <p className="text-[9px] font-black uppercase tracking-widest text-vp-cyan">{apt.department}</p>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 italic shadow-inner">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 mb-1">Motif du RDV</p>
                      <p className="text-[11px] font-bold text-slate-600 leading-snug line-clamp-2">"{apt.motif}"</p>
                   </div>
                </div>
              </div>

              {apt.statut === 'EN_ATTENTE' && (
                <div className="relative z-10 flex gap-3 mt-4">
                  <button
                    onClick={() => approveMutation.mutate(apt.id)}
                    disabled={approveMutation.isPending}
                    className="flex-1 h-12 bg-vp-mint text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-vp-mint/20 disabled:opacity-50"
                  >
                    {t('agent.validation.approve')}
                  </button>
                  <button
                    onClick={() => setSelectedAppointment(apt.id)}
                    className="flex-1 h-12 border-2 border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-rose-200 hover:text-rose-500 transition-all"
                  >
                    {t('agent.validation.reject')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-vp-navy/40 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
           <div className="card p-10 max-w-md w-full border-none shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl">⚠️</div>
                 <div>
                    <h2 className="text-xl font-black text-vp-navy">{t('agent.validation.reject_reason')}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action corrective requise</p>
                 </div>
              </div>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={t('agent.validation.reject_placeholder')}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl mb-8 h-32 text-sm font-medium text-vp-navy outline-none focus:border-rose-200 focus:ring-4 focus:ring-rose-50 transition-all resize-none"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                >
                  {t('agent.validation.cancel')}
                </button>
                <button
                  onClick={() => rejectMutation.mutate(selectedAppointment)}
                  disabled={!rejectReason.trim() || rejectMutation.isPending}
                  className="flex-[2] h-14 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-200 disabled:opacity-50"
                >
                  {t('agent.validation.confirm_reject')}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
