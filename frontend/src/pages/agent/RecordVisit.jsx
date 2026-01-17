import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Form/Input';
import visitService from '../../services/visitService';
import toast from 'react-hot-toast';

export default function RecordVisit() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      departementVisit: '',
      motifVisit: '',
      visitorFirstName: '',
      visitorLastName: '',
      whatsapp: '',
      pieceIdentite: '',
      personneARencontrer: ''
    }
  });
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const recordVisitMutation = useMutation({
    mutationFn: (data) => visitService.createVisit(data),
    onSuccess: () => {
      toast.success('Entrée enregistrée avec succès');
      reset();
      queryClient.invalidateQueries({ queryKey: ['visits'] });
      setTimeout(() => navigate('/agent/dashboard'), 1500);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Échec de l\'enregistrement');
    }
  });

  const onSubmit = (data) => {
    const visitPayload = {
      // Mapping fields to backend expected format for Direct Visit (RendezVousDto)
      date: data.visitDate,
      heure: data.visitTime,
      visitorName: `${data.visitorFirstName} ${data.visitorLastName}`,
      email: '', // Optional for direct walk-in
      whatsapp: data.whatsapp,
      pieceIdentite: data.pieceIdentite,
      personneARencontrer: data.personneARencontrer,
      departement: data.departementVisit,
      motif: data.motifVisit,
      // Backend handles 'type: DIRECT' and 'statut: VALIDE' automatically for this endpoint
    };
    recordVisitMutation.mutate(visitPayload);
  };

  const departements = ['IT', 'RH', 'Finance', 'Ventes', 'Support', 'Marketing', 'Logistique', 'Direction', 'Sécurité'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link 
          to="/agent/dashboard" 
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm"
        >
          ←
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-vp-navy">Enregistrement Visiteur</h1>
          <p className="text-slate-500 font-medium tracking-wide italic">Saisie des informations pour une entrée immédiate.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
          <div className="p-8 md:p-12 space-y-10">
            
            {/* Sec 1: Planning / Horodatage (Adapted from Visitor Form style) */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                 <div className="w-8 h-8 rounded-lg bg-vp-cyan/10 text-vp-cyan flex items-center justify-center text-xs font-black">01</div>
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] text-vp-navy">Arrivée & Identité</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Input 
                    label="Date" 
                    name="visitDate" 
                    type="date"
                    register={register}
                    className="rounded-2xl h-[55px] bg-slate-50/50 border-slate-200"
                    options={{ required: 'Required' }}
                 />
                 <Input 
                    label="Heure d'arrivée" 
                    name="visitTime" 
                    type="time"
                    register={register}
                    className="rounded-2xl h-[55px] bg-slate-50/50 border-slate-200"
                    options={{ required: 'Required' }}
                 />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Input 
                    label="Prénom" 
                    name="visitorFirstName" 
                    register={register}
                    className="rounded-2xl h-[55px] bg-slate-50/50 border-slate-200"
                    placeholder="Prénom du visiteur"
                    options={{ required: 'Prénom requis' }}
                    error={errors.visitorFirstName?.message}
                 />
                 <Input 
                    label="Nom" 
                    name="visitorLastName" 
                    register={register}
                    className="rounded-2xl h-[55px] bg-slate-50/50 border-slate-200"
                    placeholder="Nom du visiteur"
                    options={{ required: 'Nom requis' }}
                    error={errors.visitorLastName?.message}
                 />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Input 
                      label="Téléphone / WhatsApp" 
                      name="whatsapp" 
                      register={register} 
                      placeholder="+212 ..."
                      className="rounded-2xl h-[55px] bg-slate-50/50 border-slate-200"
                   />
                   <Input 
                      label="Numéro Pièce d'Identité (CNI / Passeport)" 
                      name="pieceIdentite" 
                      register={register} 
                      placeholder="Ex: AB123456"
                      className="rounded-2xl h-[55px] bg-slate-50/50 border-slate-200"
                      options={{ required: 'Pièce d\'identité requise' }} // Mandatory for security agent
                      error={errors.pieceIdentite?.message}
                   />
                </div>
            </div>

            {/* Sec 2: Destination */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                 <div className="w-8 h-8 rounded-lg bg-vp-mint/10 text-vp-mint flex items-center justify-center text-xs font-black">02</div>
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] text-vp-navy">Destination</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Département / Service</label>
                    <select 
                      {...register('departementVisit', { required: 'Département requis' })}
                      className="w-full h-[55px] px-6 rounded-2xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 outline-none transition-all font-bold text-sm bg-slate-50/50"
                    >
                      <option value="">Sélectionner...</option>
                      {departements.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.departementVisit && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.departementVisit.message}</p>}
                 </div>
                 <Input
                    label="Hôte (Personne à voir)"
                    name="personneARencontrer"
                    placeholder="Ex: Marc Dupont"
                    register={register}
                    options={{ required: 'Hôte requis' }}
                    error={errors.personneARencontrer?.message}
                    className="rounded-2xl h-[55px] bg-slate-50/50 border-slate-200"
                  />
               </div>
               
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Motif de la visite</label>
                 <textarea
                   {...register('motifVisit', { required: 'Motif requis' })}
                   rows="3"
                   placeholder="Raison de la visite..."
                   className="w-full p-6 rounded-3xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 outline-none transition-all font-medium text-sm bg-slate-50/50 placeholder:italic"
                 />
                 {errors.motifVisit && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.motifVisit.message}</p>}
               </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100">
             <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                <span className="w-2 h-2 rounded-full bg-vp-mint animate-pulse"></span>
                Validation Immédiate
             </div>
             <div className="flex gap-4 w-full md:w-auto">
                 <button
                   type="button"
                   onClick={() => navigate('/agent/dashboard')}
                   className="px-8 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                 >
                   Annuler
                 </button>
                 <button 
                    type="submit" 
                    disabled={recordVisitMutation.isPending}
                    className="btn-primary px-12 h-[55px] flex items-center justify-center gap-3 w-full md:w-auto"
                 >
                   {recordVisitMutation.isPending ? '⏳ Enregistrement...' : '⚡ Valider Entrée'}
                 </button>
             </div>
          </div>
        </div>
      </form>
    </div>
  );
}
