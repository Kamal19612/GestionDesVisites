import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '../../components/Form/Input';
import visitService from '../../services/visitService';
import appointmentService from '../../services/appointmentService';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

export default function RecordVisitWithList() {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      departementVisit: '',
      personneARencontrer: '',
      motifVisit: '',
      visitorFirstName: '',
      visitorLastName: '',
      visitorEmail: '',
      visitorPhone: '',
      pieceIdentite: '',
    }
  });
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch today's visits
  const { data: rawVisits = [], isLoading: visitsLoading, refetch: refetchVisits } = useQuery({
    queryKey: ['visits', 'today'],
    queryFn: () => visitService.getVisitsToday(),
    staleTime: 0,
    refetchInterval: 5000,
  });
  const visitsToday = Array.isArray(rawVisits) ? rawVisits : (rawVisits?.content || []);

  const { data: rawAppointments = [] } = useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: () => appointmentService.getAgentTodayAppointments(),
    staleTime: 0,
    refetchInterval: 5000,
  });
  const todayAppointments = Array.isArray(rawAppointments) ? rawAppointments : (rawAppointments?.content || []);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
    staleTime: 30000,
    refetchInterval: 60000,
  });

  const employees = users.filter(u => {
    const role = typeof u.role === 'string' ? u.role : u.role?.name;
    return role === 'EMPLOYE';
  });

  const recordVisitMutation = useMutation({
    mutationFn: (data) => visitService.createVisit(data),
    onSuccess: () => {
      toast.success(t('agent.onsite.success.message'));
      reset();
      setFoundRdvId(null);
      const now = new Date();
      setValue('visitDate', now.toISOString().split('T')[0]);
      setValue('visitTime', now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false }));
      
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setTimeout(() => refetchVisits(), 500);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || t('common.error'));
    }
  });

  const handleCheckout = useMutation({
    mutationFn: (id) => visitService.checkoutVisit(id),
    onSuccess: () => {
      toast.success(t('status.TERMINEE'));
      refetchVisits();
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
    onError: () => {
      toast.error(t('common.error'));
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchCode, setSearchCode] = useState('');

  const searchVisitorMutation = useMutation({
    mutationFn: (term) => visitService.searchVisitor(term, term.includes('@') ? term : null),
    onSuccess: (data) => {
        toast.success(`${t('agent.entry.search.button')}: ${data.name}`);
        const names = data.name.split(' ');
        setValue('visitorFirstName', names[0] || '');
        setValue('visitorLastName', names.slice(1).join(' ') || '');
        setValue('visitorEmail', data.email || '');
        setValue('visitorPhone', data.phoneNumber || '');
    },
    onError: () => {
        toast.error(t('common.error'));
    }
  });

  const [foundRdvId, setFoundRdvId] = useState(null);

  const startVisitMutation = useMutation({
    mutationFn: (id) => visitService.startVisit(id),
    onSuccess: () => {
        toast.success(t('agent.onsite.success.message'));
        reset();
        setFoundRdvId(null);
        queryClient.invalidateQueries({ queryKey: ['visits'] });
        queryClient.invalidateQueries({ queryKey: ['appointments'] });
        setTimeout(() => refetchVisits(), 500);
    },
    onError: (err) => {
        toast.error(t('common.error'));
        console.error(err);
    }
  });

  const searchCodeMutation = useMutation({
    mutationFn: (code) => visitService.searchByCode(code),
    onSuccess: (rdv) => {
        toast.success("Rendez-vous validé trouvé !");
        fillFromAppointment(rdv); // Reuse logic
        
        // Auto-start the visit as per user request ("passer automatiquement")
        startVisitMutation.mutate(rdv.id);
    },
    onError: () => {
        toast.error("Code invalide ou expiré.");
    }
  });

  const handleSearch = (e) => {
      e.preventDefault();
      if(searchTerm.length > 2) searchVisitorMutation.mutate(searchTerm);
  }

  const handleCodeSearch = (e) => {
      e.preventDefault();
      if(searchCode.length > 3) searchCodeMutation.mutate(searchCode);
  }

  const onSubmit = (data) => {
    if (foundRdvId) {
        // If we found an existing appointment, start it directly
        startVisitMutation.mutate(foundRdvId);
    } else {
        // Walk-in / New Visit
        const visitPayload = {
          date: data.visitDate,
          heureArrivee: data.visitTime, // Backend maps this to 'heure' for RendezVous creation? No, backend needs 'heure'
          heure: data.visitTime, // Add this for RDV creation
          heureSortie: null,
          motif: `[${data.departementVisit}] ${data.motifVisit}`,
          visitorName: `${data.visitorFirstName} ${data.visitorLastName}`,
          email: data.visitorEmail,
          whatsapp: data.visitorPhone,
          pieceIdentite: data.pieceIdentite,
          departement: data.departementVisit,
          personneARencontrer: data.personneARencontrer
        };
        recordVisitMutation.mutate(visitPayload);
    }
  };

  const fillFromAppointment = (apt) => {
    setFoundRdvId(apt.id); // Store ID for submission
    const names = apt.visitorName?.split(' ') || [];
    setValue('visitorFirstName', names[0] || '');
    setValue('visitorLastName', names.slice(1).join(' ') || '');
    setValue('visitorEmail', apt.email || apt.visitorEmail || '');
    setValue('departementVisit', apt.departement || apt.department || '');
    setValue('personneARencontrer', apt.personneARencontrer || '');
    setValue('motifVisit', apt.motif || '');
    // If it's a code search result, we can pre-select existing fields if any
    toast.success(t('agent.entry.search.button'));
  };

  const setCurrentTime = (field) => {
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
    setValue(field, now);
  };

  const departements = ['IT', 'RH', 'Finance', 'Ventes', 'Support', 'Marketing', 'Production', 'Logistique', 'Autre'];

  return (
    <div className="max-w-[1920px] mx-auto p-6 lg:p-10 font-sans text-slate-800">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start h-full">
        
        {/* Main Area: Registration Form (8/12) */}
        <div className="xl:col-span-8 flex flex-col gap-8">
           
           {/* Header & Quick Search */}
           <div className="flex flex-col gap-6 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                  <Link to="/agent/dashboard" className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  </Link>
                  <div>
                     <h2 className="text-3xl font-black text-vp-navy tracking-tighter">{t('agent.entry.title')}</h2>
                     <p className="text-sm font-bold text-vp-cyan uppercase tracking-widest">{t('agent.entry.subtitle')}</p>
                  </div>
              </div>

               <div className="flex flex-col md:flex-row gap-4">
                   {/* Search by Info */}
                   <form onSubmit={handleSearch} className="flex-1 relative group">
                       <input 
                         type="text" 
                         placeholder={t('agent.entry.search.placeholder')}
                         className="w-full pl-6 pr-14 h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/10 transition-all font-bold text-vp-navy placeholder:text-slate-400"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                       <button 
                         type="submit"
                         disabled={searchVisitorMutation.isPending || searchTerm.length < 3}
                         className="absolute right-2 top-2 bottom-2 px-4 bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-vp-navy hover:text-white transition-colors disabled:opacity-0"
                       >
                          {searchVisitorMutation.isPending ? '...' : t('agent.entry.search.button')}
                       </button>
                   </form>

                   {/* Search by Code */}
                   <form onSubmit={handleCodeSearch} className="flex-1 md:max-w-xs relative group">
                       <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-vp-cyan">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
                       </div>
                       <input 
                         type="text" 
                         placeholder={t('agent.entry.search.code_placeholder')}
                         className="w-full pl-12 pr-14 h-14 bg-vp-cyan/5 border-2 border-vp-cyan/20 rounded-2xl outline-none focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/10 transition-all font-bold text-vp-navy placeholder:text-vp-cyan/40"
                         value={searchCode}
                         onChange={(e) => setSearchCode(e.target.value)}
                       />
                       <button 
                         type="submit"
                         disabled={searchCodeMutation.isPending || searchCode.length < 3}
                         className="absolute right-2 top-2 bottom-2 px-4 bg-vp-cyan text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-vp-cyan/80 transition-colors disabled:opacity-0"
                       >
                          {searchCodeMutation.isPending ? '...' : 'OK'}
                       </button>
                   </form>
               </div>
           </div>

           <div className="flex flex-col gap-8">
             <form onSubmit={handleSubmit(onSubmit)} className="card p-0 border-none shadow-2xl shadow-slate-200/50 bg-white relative overflow-hidden ring-1 ring-slate-100/50">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-vp-navy via-vp-cyan to-vp-mint"></div>
                
                <div className="p-8 space-y-8">
                   {/* Section 1: Identity */}
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12">
                     <div className="space-y-6">
                       <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-2">
                          <span className="w-8 h-8 rounded-lg bg-vp-navy text-white flex items-center justify-center text-xs font-black shadow-lg shadow-vp-navy/20">01</span>
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{t('agent.entry.sections.identity')}</h3>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <Input 
                           label={t('agent.onsite.labels.firstname')} name="visitorFirstName" register={register} options={{ required: t('common.required') }} error={errors.visitorFirstName?.message}
                           placeholder="Jean" className="bg-slate-50 border-transparent hover:bg-white focus:bg-white transition-colors"
                         />
                         <Input 
                           label={t('agent.onsite.labels.lastname')} name="visitorLastName" register={register} options={{ required: t('common.required') }} error={errors.visitorLastName?.message}
                           placeholder="Dupont" className="bg-slate-50 border-transparent hover:bg-white focus:bg-white transition-colors"
                         />
                       </div>
                       <Input 
                         label="Email (Facultatif)" name="visitorEmail" register={register} placeholder="jean@email.com" className="bg-slate-50 border-transparent hover:bg-white focus:bg-white transition-colors"
                       />
                     </div>

                     <div className="space-y-6">
                       <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-2">
                          <span className="w-8 h-8 rounded-lg bg-vp-cyan text-white flex items-center justify-center text-xs font-black shadow-lg shadow-vp-cyan/20">02</span>
                          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{t('agent.entry.sections.doc')}</h3>
                       </div>
                       <Input 
                         label={t('agent.entry.labels.doc_id')} name="pieceIdentite" register={register} options={{ required: t('common.required') }} error={errors.pieceIdentite?.message}
                         placeholder="CNI / PASSPORT / N°" className="bg-slate-50 border-transparent hover:bg-white focus:bg-white transition-colors"
                       />
                       <Input 
                         label={t('agent.onsite.labels.phone')} name="visitorPhone" register={register} placeholder="+212 ..." className="bg-slate-50 border-transparent hover:bg-white focus:bg-white transition-colors"
                       />
                     </div>
                   </div>

                   {/* Divider */}
                   <div className="h-px bg-slate-100 w-full"></div>

                   {/* Section 2: Visit Details */}
                   <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12">
                      <div className="space-y-6">
                         <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-2">
                            <span className="w-8 h-8 rounded-lg bg-vp-mint text-white flex items-center justify-center text-xs font-black shadow-lg shadow-vp-mint/20">03</span>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{t('agent.entry.sections.destination')}</h3>
                         </div>
                          <div className="space-y-2">
                             <Input 
                                label={t('agent.entry.labels.target_dept')} name="departementVisit" register={register} options={{ required: t('common.required') }} error={errors.departementVisit?.message}
                                placeholder="Département..." className="bg-slate-50 border-transparent hover:bg-white focus:bg-white transition-colors" 
                             />
                          </div>
                          <div className="space-y-2">
                             <Input 
                                label={t('agent.entry.labels.host_internal')} name="personneARencontrer" register={register} options={{ required: t('common.required') }} error={errors.personneARencontrer?.message}
                                placeholder="Nom de l'hôte..." className="bg-slate-50 border-transparent hover:bg-white focus:bg-white transition-colors" 
                             />
                          </div>
                      </div>

                      <div className="space-y-6">
                         <div className="flex items-center gap-3 border-b-2 border-slate-50 pb-2">
                            <span className="w-8 h-8 rounded-lg bg-vp-navy text-white flex items-center justify-center text-xs font-black shadow-lg shadow-vp-navy/20">04</span>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{t('agent.entry.sections.time')}</h3>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                           <Input label={t('common.date')} name="visitDate" type="date" register={register} className="bg-slate-50 border-transparent hover:bg-white focus:bg-white transition-colors" />
                           <div className="space-y-2">
                             <div className="flex justify-between items-center px-1">
                               <label className="text-sm font-medium text-slate-700">{t('common.time')}</label>
                               <button type="button" onClick={() => setCurrentTime('visitTime')}
                                       className="text-[9px] font-black text-vp-cyan hover:text-vp-navy transition-colors bg-vp-cyan/10 hover:bg-vp-cyan/20 px-2 py-1 rounded-md uppercase tracking-wider">
                                  {t('agent.entry.labels.now')}
                               </button>
                             </div>
                             <Input name="visitTime" type="time" register={register} className="bg-slate-50 border-transparent hover:bg-white focus:bg-white transition-colors" />
                           </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('agent.onsite.labels.motif')}</label>
                            <textarea
                              {...register('motifVisit', { required: t('common.required') })}
                              rows="1"
                              className="w-full p-4 bg-slate-50 border-transparent hover:bg-white focus:bg-white rounded-2xl text-sm font-medium text-vp-navy outline-none focus:ring-4 focus:ring-vp-cyan/10 focus:border-vp-cyan transition-all resize-none"
                              placeholder="Détails..."
                            />
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={recordVisitMutation.isPending}
                  className="w-full h-20 bg-vp-navy text-white text-sm font-black uppercase tracking-[0.25em] hover:bg-vp-cyan transition-all shadow-inner flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {recordVisitMutation.isPending ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-2xl group-hover:scale-125 transition-transform duration-300">⚡</span>
                      {t('agent.entry.submit')}
                    </>
                  )}
                </button>
             </form>
           </div>

           {/* Today's Registre */}
           <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl shadow-slate-200/40">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h2 className="text-2xl font-black text-vp-navy tracking-tight">{t('agent.entry.register.title')}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('agent.entry.register.subtitle')}</p>
                 </div>
                 <div className="px-5 py-2.5 bg-white text-vp-navy border-2 border-vp-navy rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {visitsToday.length} {t('agent.entry.register.movements')}
                 </div>
              </div>

              {visitsLoading ? (
                <div className="py-20 text-center animate-pulse text-slate-300 font-black uppercase text-xs tracking-widest italic">{t('common.loading')}</div>
              ) : visitsToday.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center">
                   <span className="text-4xl mb-4 grayscale opacity-20">📭</span>
                   <p className="font-black text-vp-navy text-sm opacity-50 uppercase tracking-widest">{t('agent.entry.register.empty')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
                   {visitsToday.map((visit) => (
                     <div key={visit.id} className="relative p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${visit.heureSortie ? 'bg-slate-200' : 'bg-vp-cyan'}`}></div>
                        
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-sm font-black text-vp-navy shadow-inner">
                                 {visit.visitorName?.charAt(0) || 'V'}
                              </div>
                              <div>
                                 <h4 className="font-black text-vp-navy leading-tight text-sm line-clamp-1">{visit.visitorName || 'Anonyme'}</h4>
                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">ID #{visit.id}</span>
                              </div>
                           </div>
                           <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${visit.heureSortie ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-vp-mint/10 text-vp-mint border-vp-mint/20'}`}>
                              {visit.heureSortie ? t('status.TERMINEE') : t('status.EN_COURS')}
                           </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-4 bg-slate-50 p-2 rounded-lg">
                           <span className="flex items-center gap-1">🕒 <span className="text-vp-navy">{visit.heureArrivee}</span></span>
                           <span className="text-slate-300">➜</span>
                           <span className="flex items-center gap-1">{visit.heureSortie ? <span className="text-slate-500">{visit.heureSortie}</span> : <span className="italic text-vp-mint">...</span>}</span>
                        </div>
                        
                        {!visit.heureSortie && (
                           <button 
                             onClick={() => handleCheckout.mutate(visit.id)}
                             disabled={handleCheckout.isPending}
                             className="w-full h-9 bg-vp-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-vp-cyan transition-colors"
                           >
                              {t('agent.entry.register.checkout_btn')}
                           </button>
                        )}
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Sidebar: Appointments & Secondary Info (4/12) */}
        <div className="xl:col-span-4 sticky top-6 space-y-8">
           <div className="card p-0 border-none shadow-2xl shadow-vp-navy/20 bg-vp-navy text-white overflow-hidden relative min-h-[500px] flex flex-col">
              {/* Decorative bgs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-vp-cyan/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-vp-mint/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>

              <div className="p-8 border-b border-white/5 relative z-10 backdrop-blur-sm bg-white/5">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-vp-cyan">
                  <span className="w-2 h-2 rounded-full bg-vp-cyan animate-pulse shadow-[0_0_15px_rgba(14,165,233,1)]"></span>
                  {t('agent.appointments.title')}
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2 font-medium">{t('agent.appointments.subtitle')}</p>
              </div>
              
              <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar-dark relative z-10">
                {todayAppointments.filter(a => a.statut === 'VALIDE' || a.statut === 'APPROUVEE' || a.status === 'VALIDE').length === 0 ? (
                  <div className="text-center py-20 opacity-30 flex flex-col items-center gap-4">
                    <span className="text-5xl grayscale">📅</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">{t('agent.appointments.empty')}</p>
                  </div>
                ) : (
                  todayAppointments.filter(a => a.statut === 'VALIDE' || a.statut === 'APPROUVEE' || a.status === 'VALIDE').map(apt => (
                    <button 
                      key={apt.id}
                      onClick={() => fillFromAppointment(apt)}
                      className="w-full p-4 bg-white/5 hover:bg-white/10 hover:border-vp-cyan/30 border border-white/5 rounded-2xl transition-all flex flex-col items-start gap-3 group text-left relative overflow-hidden backdrop-blur-sm"
                    >
                      <div className="absolute top-0 right-0 w-1 h-full bg-vp-cyan scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                      
                      <div className="flex justify-between w-full items-center">
                         <span className="text-sm font-black text-white group-hover:text-vp-cyan transition-colors line-clamp-1">{apt.visitorName}</span>
                         <span className="px-2 py-0.5 bg-vp-cyan/20 text-vp-cyan text-[10px] font-black rounded-lg whitespace-nowrap">{apt.heure || apt.appointmentTime || '--:--'}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-tight w-full">
                         <div className="flex items-center gap-2 p-1.5 rounded bg-black/20 w-fit">
                            <span className="opacity-70">📍</span> 
                            <span className="text-slate-300">{apt.departement || apt.department}</span>
                         </div>
                         <div className="flex items-center gap-2 px-1">
                            <span className="opacity-50">👤</span> 
                            <span className="truncate">{apt.personneARencontrer}</span>
                         </div>
                      </div>
                      
                      <div className="mt-1 w-full pt-3 border-t border-white/5 flex justify-between items-center group-hover:pl-2 transition-all">
                          <span className="text-[8px] font-black text-vp-cyan/60 tracking-widest group-hover:text-vp-cyan transition-colors">RELINK</span>
                          <span className="text-xs text-vp-cyan opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                         {/* Show code small if exists */}
                         {apt.code && <span className="text-[8px] font-mono text-white/20">{apt.code}</span>}
                      </div>
                    </button>
                  ))
                )}
              </div>
           </div>

           <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white/80 relative overflow-hidden flex items-center gap-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vp-cyan/10 blur-3xl -mr-16 -mt-16"></div>
              <div className="text-4xl grayscale brightness-200 opacity-50">🛡️</div>
              <div className="space-y-1 relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-vp-cyan mb-1">{t('agent.entry.memos.security_title')}</p>
                 <p className="text-xs font-medium leading-relaxed text-slate-300">
                   {t('agent.entry.memos.security_text')}
                   <br/>
                   <span className="text-white font-bold block mt-1">Codes d'accès requis pour vérification automatique.</span>
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
