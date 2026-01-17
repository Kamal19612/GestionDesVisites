import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import appointmentService from '../../services/appointmentService'
import visitService from '../../services/visitService'
import toast from 'react-hot-toast'
import StatusBadge from '../../components/ui/StatusBadge'
import { formatTime } from '../../utils/formatters'

export default function AgentDashboard() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [entryModal, setEntryModal] = React.useState({ isOpen: false, apt: null, mode: 'SELECT' }); // mode: SELECT, CODE, QR
  const [inputCode, setInputCode] = React.useState('');

  // ... (Queries remain same)
  // Today's appointments
  const { data: todayAppointments = [], isLoading: aptsLoading, refetch: refetchAppointments } = useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: () => appointmentService.getAgentTodayAppointments(),
    staleTime: 0,
    refetchInterval: 5000,
  })

  // Today's visits (All movements today)
  const { data: visitsToday = [], isLoading: visitsLoading, refetch: refetchVisits } = useQuery({
    queryKey: ['visits', 'today'],
    queryFn: () => visitService.getVisitsToday(),
    staleTime: 0,
    refetchInterval: 5000,
  })

  // derived stats
  const validAppointmentsCount = todayAppointments.filter(a => a.statut === 'VALIDE').length;
  const startedVisitsCount = visitsToday.filter(v => v.heureArrivee).length;
  const pendingAppointments = Math.max(0, validAppointmentsCount - startedVisitsCount);
  const ongoingVisits = visitsToday.filter(v => v.heureArrivee && !v.heureSortie).length;
  const completedVisits = visitsToday.filter(v => v.heureSortie).length;

  const handleCheckout = async (visitId) => {
    try {
      await visitService.checkoutVisit(visitId)
      toast.success(t('common.save'))
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    } catch (err) {
      toast.error(t('common.error'))
      console.error(err)
    }
  }

  const terminateAppointment = useMutation({
    mutationFn: (id) => appointmentService.completeAppointment(id),
    onSuccess: () => {
      toast.success(t('common.save'));
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
    onError: () => {
      toast.error(t('common.error'));
    }
  });
  
  const validateCode = async () => {
      if (!entryModal.apt) return;
      if (inputCode.trim().toLowerCase() === entryModal.apt.code.toLowerCase()) {
          try {
                await visitService.startVisit(entryModal.apt.id);
                toast.success("Code valide. Entrée enregistrée !");
                refetchAppointments();
                queryClient.invalidateQueries(['visits']);
                closeModal();
          } catch (e) {
                toast.error("Erreur technique.");
          }
      } else {
          toast.error("Code incorrect !");
      }
  };

  const closeModal = () => {
      setEntryModal({ isOpen: false, apt: null, mode: 'SELECT' });
      setInputCode('');
  };

  const simulateQRScan = async () => {
      // Simulate successful scan matching the code
      toast.loading("Analyse du QR Code...");
      setTimeout(async () => {
          try {
                toast.dismiss();
                // Assume QR contains the correct code, proceed
                await visitService.startVisit(entryModal.apt.id);
                toast.success("QR Code Validé. Entrée enregistrée !");
                refetchAppointments();
                queryClient.invalidateQueries(['visits']);
                closeModal();
          } catch (e) {
                toast.error("Erreur post-scan.");
          }
      }, 1500);
  };

  const stats = [
    { label: t('agent.dashboard.stats.appointments.label'), value: validAppointmentsCount, sub: t('agent.dashboard.stats.appointments.sub'), color: "text-vp-cyan", bg: "bg-vp-cyan/10", icon: "📅" },
    { label: t('agent.dashboard.stats.pending.label'), value: pendingAppointments, sub: t('agent.dashboard.stats.pending.sub'), color: "text-amber-500", bg: "bg-amber-100", icon: "⏳" },
    { label: t('agent.dashboard.stats.onsite.label'), value: ongoingVisits, sub: t('agent.dashboard.stats.onsite.sub'), color: "text-vp-mint", bg: "bg-vp-mint/10", icon: "🚪" },
    { label: t('agent.dashboard.stats.completed.label'), value: completedVisits, sub: t('agent.dashboard.stats.completed.sub'), color: "text-slate-500", bg: "bg-slate-100", icon: "✅" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
      {/* ... Header and Stats Grid (No Change) ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-vp-navy mb-1">{t('agent.dashboard.title')}</h1>
          <p className="text-slate-500 font-medium tracking-wide text-sm">{t('agent.dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/agent/visit/record" className="btn-primary py-2.5 px-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-lg shadow-vp-cyan/20">
            <span className="text-lg">+</span> {t('agent.dashboard.actions.entry')}
          </Link>
          <Link to="/agent/visit/history" className="bg-white border border-slate-200 text-slate-500 hover:text-vp-navy py-2.5 px-6 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all">
            ⌛ {t('agent.dashboard.actions.history')}
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="card p-5 flex items-center justify-between group hover:-translate-y-1 transition-all border-none bg-white shadow-sm hover:shadow-md">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[9px] text-slate-400 mt-1.5 font-bold uppercase tracking-tighter">{stat.sub}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Appointments Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-vp-navy flex items-center gap-2">
              <span className="text-vp-cyan">📅</span> {t('agent.appointments.title')}
            </h2>
            <Link to="/agent/appointments/validate" className="text-[10px] font-black text-vp-cyan uppercase tracking-[0.2em] hover:underline">{t('agent.appointments.view_all')}</Link>
          </div>
          <div className="card fill-slate-50/50 p-4 border-none shadow-xl shadow-slate-200/50">
            {aptsLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">{t('agent.appointments.sync')}</div>
            ) : todayAppointments.length === 0 ? (
              <div className="py-12 text-center text-slate-300">
                 <p className="text-2xl mb-2">📭</p>
                 <p className="font-bold uppercase text-[9px] tracking-widest">{t('agent.appointments.empty')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.filter(apt => {
                    const relatedVisit = visitsToday.find(v => v.rendezVousId === apt.id);
                    if (relatedVisit && relatedVisit.heureArrivee) return false;
                    return true;
                }).slice(0, 5).map(apt => (
                  <div key={apt.id} className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between hover:border-vp-cyan/30 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-vp-cyan/10 text-vp-cyan flex items-center justify-center font-black text-[10px] uppercase shadow-inner">
                        {apt.visitorName?.charAt(0) || 'V'}
                      </div>
                      <div>
                        <p className="font-black text-sm text-vp-navy group-hover:text-vp-cyan transition-colors">{apt.visitorName}</p>
                         <p className="text-[10px] font-bold text-slate-400">
                            <span className="text-vp-navy/60">{apt.date}</span> <span className="text-slate-300 mx-1">|</span> {formatTime(apt.heure)}
                         </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="scale-75 origin-right"><StatusBadge status={apt.statut} /></div>
                        {apt.statut === 'VALIDE' && (
                            <button 
                                onClick={() => setEntryModal({ isOpen: true, apt, mode: 'SELECT' })}
                                className="w-8 h-8 rounded-lg bg-vp-navy/5 text-vp-navy flex items-center justify-center hover:bg-vp-navy hover:text-white transition-all shadow-sm" 
                                title="Enregistrer l'entrée"
                            >
                                ⚡
                            </button>
                        )}

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link to="/agent/appointments/new-on-site" className="block w-full text-center py-3 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-colors">
            + {t('agent.dashboard.actions.create_onsite')}
          </Link>
        </div>

        {/* Live Visits Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-vp-navy flex items-center gap-2">
              <span className="text-vp-mint">🚪</span> {t('agent.visits.title')}
            </h2>
            <Link to="/agent/current-visitors" className="text-[10px] font-black text-vp-cyan uppercase tracking-[0.2em] hover:underline">{t('agent.visits.full_list')}</Link>
          </div>
          <div className="card fill-vp-navy p-4 border-none bg-vp-navy shadow-xl shadow-vp-navy/20 relative overflow-hidden">
             {/* ... (Live Visits Content - No Change needed) ... */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-vp-cyan/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            {visitsLoading ? (
              <div className="py-12 text-center text-white/20 text-xs font-bold uppercase tracking-widest animate-pulse">{t('agent.appointments.sync')}</div>
            ) : (visitsToday.filter(v => v.heureArrivee && !v.heureSortie).length === 0) ? (
              <div className="py-12 text-center text-white/30">
                 <p className="text-2xl mb-2">👥</p>
                 <p className="font-bold uppercase text-[9px] tracking-widest">{t('agent.visits.empty')}</p>
              </div>
            ) : (
              <div className="space-y-3 relative z-10">
                {visitsToday.filter(v => v.heureArrivee && !v.heureSortie).slice(0, 5).map(visit => (
                  <div key={visit.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-white hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-vp-mint text-white flex items-center justify-center font-black text-[10px] uppercase shadow-lg shadow-vp-mint/30 group-hover:scale-105 transition-transform">
                        {visit.visitorName?.charAt(0) || 'V'}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{visit.visitorName || 'Visiteur'}</p>
                        <p className="text-[10px] text-white/50 font-medium">
                          Entrée : {formatTime(visit.heureArrivee)}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCheckout(visit.id)}
                      className="px-3 py-1.5 bg-vp-cyan hover:bg-vp-cyan/80 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-vp-cyan/20"
                    >
                      SIGNALER SORTIE
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-vp-cyan/5 rounded-xl p-4 border border-vp-cyan/10">
             <div className="flex gap-3">
               <span className="text-xl">⚡</span>
               <div className="text-[10px] text-vp-navy/60 leading-relaxed font-bold uppercase tracking-tight">
                 <strong className="text-vp-cyan">Protocol :</strong> Vérifiez toujours la pièce d'identité avant de valider l'accès physique au bâtiment.
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Entry Validation Modal */}
      {entryModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
                <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 font-bold transition-colors">✕</button>
                
                <div className="text-center mb-6">
                    <h3 className="text-lg font-black text-vp-navy">{t('agent.entry.title')}</h3>
                    <p className="text-xs font-bold text-vp-cyan uppercase tracking-widest mt-1">{entryModal.apt?.visitorName}</p>
                </div>

                {entryModal.mode === 'SELECT' && (
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setEntryModal(prev => ({...prev, mode: 'CODE'}))} className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 hover:bg-vp-navy hover:text-white border-2 border-slate-100 hover:border-vp-navy transition-all group">
                            <span className="text-3xl group-hover:scale-110 transition-transform">⌨️</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Saisir Code</span>
                        </button>
                        <button onClick={() => setEntryModal(prev => ({...prev, mode: 'QR'}))} className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-slate-50 hover:bg-vp-cyan hover:text-white border-2 border-slate-100 hover:border-vp-cyan transition-all group">
                            <span className="text-3xl group-hover:scale-110 transition-transform">📷</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Scanner QR</span>
                        </button>
                    </div>
                )}

                {entryModal.mode === 'CODE' && (
                    <div className="space-y-4">
                        <input 
                            autoFocus
                            type="text" 
                            className="w-full text-center text-2xl font-black tracking-[0.5em] h-16 bg-slate-100 rounded-xl border-2 border-transparent focus:border-vp-navy focus:bg-white outline-none transition-all uppercase"
                            placeholder="CODE"
                            maxLength={8}
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                        />
                        <button onClick={validateCode} className="w-full btn-primary h-12 rounded-xl text-xs flex items-center justify-center gap-2">
                            <span>VALIDER L'ENTRÉE</span>
                        </button>
                        <button onClick={() => setEntryModal(prev => ({...prev, mode: 'SELECT'}))} className="w-full text-[10px] font-bold text-slate-400 hover:text-vp-navy uppercase tracking-widest">
                            ← Retour
                        </button>
                    </div>
                )}

                {entryModal.mode === 'QR' && (
                    <div className="text-center space-y-6">
                        <div className="w-48 h-48 mx-auto bg-black rounded-lg relative overflow-hidden">
                             <div className="absolute inset-0 border-2 border-vp-cyan opacity-50"></div>
                             <div className="absolute top-0 left-0 w-full h-1 bg-vp-cyan shadow-[0_0_15px_rgba(14,165,233,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
                             <p className="absolute inset-0 flex items-center justify-center text-white/50 text-xs font-mono">CAMERA FEED...</p>
                        </div>
                        <button onClick={simulateQRScan} className="w-full btn-primary h-12 rounded-xl text-xs flex items-center justify-center gap-2">
                            <span>SIMULER SCAN VALIDE</span>
                        </button>
                        <button onClick={() => setEntryModal(prev => ({...prev, mode: 'SELECT'}))} className="w-full text-[10px] font-bold text-slate-400 hover:text-vp-navy uppercase tracking-widest">
                            ← Retour
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  )
}
