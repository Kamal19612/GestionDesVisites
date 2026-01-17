import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Form/Input';
import visitService from '../../services/visitService';
import appointmentService from '../../services/appointmentService';
import userService from '../../services/userService';
import toast from 'react-hot-toast';

export default function RecordVisitWithList() {
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
      identityDoc: '',
    }
  });
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch today's visits
  const { data: rawVisits = [], isLoading: visitsLoading, refetch: refetchVisits } = useQuery({
    queryKey: ['visits', 'today'],
    queryFn: () => visitService.getVisitsToday(),
    staleTime: 0,
    refetchInterval: 30000,
  });
  const visitsToday = Array.isArray(rawVisits) ? rawVisits : (rawVisits?.content || []);

  const { data: rawAppointments = [] } = useQuery({
    queryKey: ['appointments', 'today'],
    queryFn: () => appointmentService.getTodayAppointments(),
    staleTime: 0,
    refetchInterval: 30000,
  });
  const todayAppointments = Array.isArray(rawAppointments) ? rawAppointments : (rawAppointments?.content || []);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });

  const employees = users.filter(u => {
    const role = typeof u.role === 'string' ? u.role : u.role?.name;
    return role === 'EMPLOYEUR';
  });

  const recordVisitMutation = useMutation({
    mutationFn: (data) => visitService.createVisit(data),
    onSuccess: () => {
      toast.success('Visite enregistrée avec succès !');
      reset();
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setTimeout(() => refetchVisits(), 500);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || err?.message || 'Erreur lors de l\'enregistrement.');
    }
  });

  const handleCheckout = useMutation({
    mutationFn: (id) => visitService.checkoutVisit(id),
    onSuccess: () => {
      toast.success('Sortie enregistrée avec succès !');
      refetchVisits();
      queryClient.invalidateQueries({ queryKey: ['visits'] });
    },
    onError: () => {
      toast.error('Erreur lors de l\'enregistrement de la sortie.');
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const searchVisitorMutation = useMutation({
    mutationFn: (term) => visitService.searchVisitor(term, term.includes('@') ? term : null), // Simple heuristics
    onSuccess: (data) => {
        toast.success(`Visiteur trouvé : ${data.name}`);
        const names = data.name.split(' ');
        setValue('visitorFirstName', names[0] || '');
        setValue('visitorLastName', names.slice(1).join(' ') || '');
        setValue('visitorEmail', data.email || '');
        setValue('visitorPhone', data.phoneNumber || '');
        // We could also pre-fill document if we had it, but API returns Visiteur entity which might have it
    },
    onError: () => {
        toast.error('Aucun visiteur trouvé avec ce critère.');
    }
  });

  const handleSearch = (e) => {
      e.preventDefault();
      if(searchTerm.length > 2) searchVisitorMutation.mutate(searchTerm);
  }

  const onSubmit = (data) => {
    const visitPayload = {
      date: data.visitDate,
      HEntree: data.visitTime,
      HSortie: null,
      motif: `[${data.departementVisit}] ${data.personneARencontrer} - ${data.motifVisit} (Doc: ${data.identityDoc})`,
      visitorName: `${data.visitorFirstName} ${data.visitorLastName}`,
      visitorEmail: data.visitorEmail,
      visitorPhone: data.visitorPhone
    };
    recordVisitMutation.mutate(visitPayload);
  };

  const fillFromAppointment = (apt) => {
    const names = apt.visitorName?.split(' ') || [];
    setValue('visitorFirstName', names[0] || '');
    setValue('visitorLastName', names.slice(1).join(' ') || '');
    setValue('visitorEmail', apt.email || apt.visitorEmail || '');
    setValue('departementVisit', apt.departement || apt.department || '');
    setValue('personneARencontrer', apt.personneARencontrer || '');
    setValue('motifVisit', apt.motif || '');
    toast.success('Données pré-remplies depuis le RDV');
  };

  const setCurrentTime = (field) => {
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });
    setValue(field, now);
  };

  const departements = ['IT', 'RH', 'Finance', 'Ventes', 'Support', 'Marketing', 'Production', 'Logistique', 'Autre'];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Area: Registration Form (8/12) */}
        <div className="lg:col-span-8 space-y-8">
           <div className="card p-0 border-none shadow-2xl shadow-slate-200/60 bg-white/90 backdrop-blur-xl relative overflow-hidden ring-1 ring-slate-100">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vp-navy via-vp-cyan to-vp-mint"></div>
             
             <div className="p-8 pb-4">
               <div className="flex items-center gap-4 mb-6">
                  <Link to="/agent/dashboard" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:bg-slate-100 transition-all shadow-inner">←</Link>
                  <div>
                     <h2 className="text-2xl font-black text-vp-navy tracking-tight">Saisie d'Entrée Directe</h2>
                     <p className="text-[10px] font-black text-vp-cyan uppercase tracking-[0.2em]">Enregistrement rapide au poste de garde</p>
                  </div>
               </div>
             </div>

              {/* Quick Search Bar */}
              <div className="px-8 pb-4">
                  <form onSubmit={handleSearch} className="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner">
                      <div className="w-10 h-10 rounded-xl bg-vp-cyan/10 flex items-center justify-center text-xl">🔍</div>
                      <input 
                        type="text" 
                        placeholder="Recherche rapide (Téléphone ou Email)..." 
                        className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-vp-navy placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button 
                        type="submit"
                        disabled={searchVisitorMutation.isPending || searchTerm.length < 3}
                        className="px-6 py-2 bg-vp-cyan text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-vp-cyan/80 transition-all disabled:opacity-50"
                      >
                         {searchVisitorMutation.isPending ? '...' : 'Chercher'}
                      </button>
                  </form>
              </div>

             <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-0 space-y-8">
                {/* Section 1: Identity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="w-5 h-5 rounded-lg bg-vp-navy text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-vp-navy/20">01</span>
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Identité du Visiteur</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        label="Prénom" name="visitorFirstName" register={register} options={{ required: 'Requis' }} error={errors.visitorFirstName?.message}
                        placeholder="Jean" className="bg-white border-slate-200"
                      />
                      <Input 
                        label="Nom" name="visitorLastName" register={register} options={{ required: 'Requis' }} error={errors.visitorLastName?.message}
                        placeholder="Dupont" className="bg-white border-slate-200"
                      />
                    </div>
                    <Input 
                      label="Email (Facultatif)" name="visitorEmail" register={register} placeholder="jean@email.com" className="bg-white border-slate-200"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="w-5 h-5 rounded-lg bg-vp-cyan text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-vp-cyan/20">02</span>
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Document & Contact</h3>
                    </div>
                    <Input 
                      label="Pièce d'Identité" name="identityDoc" register={register} options={{ required: 'Requis' }} error={errors.identityDoc?.message}
                      placeholder="CNI / PASSPORT / N°" className="bg-white border-slate-200"
                    />
                    <Input 
                      label="Téléphone" name="visitorPhone" register={register} placeholder="+212 ..." className="bg-white border-slate-200"
                    />
                  </div>
                </div>

                {/* Section 2: Visit Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="w-5 h-5 rounded-lg bg-vp-mint text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-vp-mint/20">03</span>
                         <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Destination</h3>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Département Ciblé</label>
                         <select 
                           {...register('departementVisit', { required: 'Requis' })}
                           className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-vp-cyan/10 focus:border-vp-cyan transition-all font-bold text-vp-navy outline-none appearance-none shadow-sm"
                         >
                           <option value="">Sélectionner</option>
                           {departements.map(d => <option key={d} value={d}>{d}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hôte interne (Employé)</label>
                         <select 
                           {...register('personneARencontrer', { required: 'Requis' })}
                           className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-vp-cyan/10 focus:border-vp-cyan transition-all font-bold text-vp-navy outline-none appearance-none shadow-sm"
                         >
                           <option value="">Sélectionner</option>
                           {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                           <option value="Autre">Autre / Non listé</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="w-5 h-5 rounded-lg bg-vp-navy text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-vp-navy/20">04</span>
                         <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Horodatage</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Date" name="visitDate" type="date" register={register} className="bg-white border-slate-200" />
                        <div className="relative">
                          <Input label="Heure" name="visitTime" type="time" register={register} className="bg-white border-slate-200" />
                          <button type="button" onClick={() => setCurrentTime('visitTime')}
                                  className="absolute right-3 top-9 text-[9px] font-black text-vp-cyan hover:text-vp-navy transition-colors bg-vp-cyan/5 px-2 py-1 rounded">NOW</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Motif de la visite</label>
                         <textarea
                           {...register('motifVisit', { required: 'Requis' })}
                           rows="2"
                           className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-vp-navy outline-none focus:ring-4 focus:ring-vp-cyan/10 focus:border-vp-cyan transition-all resize-none shadow-sm"
                           placeholder="Détails..."
                         />
                      </div>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={recordVisitMutation.isPending}
                  className="w-full h-16 bg-vp-navy text-white rounded-3xl text-sm font-black uppercase tracking-[0.2em] hover:bg-vp-navy/90 active:scale-95 transition-all shadow-2xl shadow-vp-navy/30 flex items-center justify-center gap-4 disabled:opacity-50 mt-4 overflow-hidden"
                >
                  {recordVisitMutation.isPending ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-xl">⚡</span>
                      ENREGISTRER L'ENTRÉE DU VISITEUR
                    </>
                  )}
                </button>
             </form>
           </div>

           {/* Today's Registre (Moved below form for wide screen readability) */}
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h2 className="text-2xl font-black text-vp-navy">Registre Opérationnel du Jour</h2>
                 <div className="px-4 py-2 bg-vp-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-vp-navy/20">
                    {visitsToday.length} Mouvments
                 </div>
              </div>

              {visitsLoading ? (
                <div className="py-20 text-center animate-pulse text-slate-300 font-black uppercase text-xs tracking-widest italic">Chargement...</div>
              ) : visitsToday.length === 0 ? (
                <div className="card py-20 text-center bg-white border-none shadow-xl shadow-slate-100/60 flex flex-col items-center">
                   <span className="text-5xl mb-6 grayscale opacity-20">📭</span>
                   <p className="font-black text-vp-navy text-lg">Aucun mouvement aujourd'hui</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {visitsToday.map((visit) => (
                     <div key={visit.id} className="card p-5 border-none shadow-xl shadow-slate-200/40 bg-white group hover:shadow-vp-cyan/10 transition-all border-l-4 border-l-vp-cyan">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-vp-navy/5 flex items-center justify-center text-sm font-black text-vp-navy">
                                 {visit.visitorName?.charAt(0) || 'V'}
                              </div>
                              <div>
                                 <h4 className="font-black text-vp-navy leading-none mb-1 text-sm">{visit.visitorName || 'Anonyme'}</h4>
                                 <span className="text-[8px] font-black uppercase tracking-widest text-vp-cyan">ID #{visit.id}</span>
                              </div>
                           </div>
                           <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${visit.HSortie ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-vp-mint/10 text-vp-mint border-vp-mint/20'}`}>
                              {visit.HSortie ? 'Terminée' : 'Actif'}
                           </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-4">
                           <span>🕒 {visit.HEntree}</span>
                           <span>{visit.HSortie ? `🏁 ${visit.HSortie}` : 'En cours...'}</span>
                        </div>
                        {!visit.HSortie && (
                           <button 
                             onClick={() => handleCheckout.mutate(visit.id)}
                             disabled={handleCheckout.isPending}
                             className="w-full h-8 bg-vp-cyan/10 hover:bg-vp-cyan hover:text-white text-vp-cyan rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                           >
                              Valider la Sortie
                           </button>
                        )}
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>

        {/* Sidebar: Appointments & Secondary Info (4/12) */}
        <div className="lg:col-span-4 sticky top-6 space-y-6">
           <div className="card p-0 border-none shadow-2xl shadow-slate-200/50 bg-vp-navy text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vp-cyan/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-vp-cyan animate-pulse shadow-[0_0_15px_rgba(14,165,233,0.5)]"></span>
                  Attentes du Jour
                </h3>
              </div>
              
              <div className="p-4 space-y-3 max-h-screen overflow-y-auto custom-scrollbar-white">
                {todayAppointments.filter(a => a.statut === 'APPROUVEE').length === 0 ? (
                  <div className="text-center py-12 opacity-30 flex flex-col items-center gap-3">
                    <span className="text-4xl grayscale">📅</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">Aucun RDV confirmé</p>
                  </div>
                ) : (
                  todayAppointments.filter(a => a.statut === 'APPROUVEE').map(apt => (
                    <button 
                      key={apt.id}
                      onClick={() => fillFromAppointment(apt)}
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex flex-col items-start gap-2 group text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-1 h-full bg-vp-cyan scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                      <div className="flex justify-between w-full items-center">
                         <span className="text-sm font-black text-white group-hover:text-vp-cyan transition-colors">{apt.visitorName}</span>
                         <span className="px-2 py-0.5 bg-vp-cyan/20 text-vp-cyan text-[10px] font-black rounded-lg">{apt.appointmentTime || apt.time}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-[9px] text-white/40 font-bold uppercase tracking-tight">
                         <span className="flex items-center gap-1.5"><span className="opacity-50">🏛️</span> {apt.departement || apt.department}</span>
                         <span className="flex items-center gap-1.5"><span className="opacity-50">👤</span> {apt.personneARencontrer}</span>
                      </div>
                      <div className="mt-2 w-full pt-2 border-t border-white/5 text-[8px] font-black italic text-vp-cyan/60 tracking-widest group-hover:text-vp-cyan transition-colors">
                         CLIQUEZ POUR ENREGISTRER L'ENTRÉE →
                      </div>
                    </button>
                  ))
                )}
              </div>
           </div>

           <div className="bg-vp-cyan/5 rounded-3xl p-6 border border-vp-cyan/10 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-vp-cyan">Memo Sécurité</h4>
              <p className="text-xs text-vp-navy/60 font-medium leading-relaxed italic">
                Toute personne doit présenter une pièce d'identité valide. Le scan du badge est obligatoire pour tout personnel externe.
              </p>
              <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-vp-mint"></div>
                 <div className="w-2 h-2 rounded-full bg-vp-cyan"></div>
                 <div className="w-2 h-2 rounded-full bg-vp-navy/10"></div>
              </div>
           </div>
        </div>
      </div>

            <div className="mt-12 p-8 rounded-3xl bg-vp-navy text-white/80 relative overflow-hidden flex items-center gap-8">
               <div className="absolute top-0 right-0 w-32 h-32 bg-vp-cyan/10 blur-3xl -mr-16 -mt-16"></div>
               <div className="text-4xl grayscale brightness-200 opacity-50">👮</div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Protocole Sécurité</p>
                  <p className="text-sm font-medium leading-relaxed italic">
                    Tout checkout manuel clôture définitivement la session de visite. Pour toute modification ultérieure, veuillez contacter l'administrateur système.
                  </p>
               </div>
            </div>
        </div>
  );
}
