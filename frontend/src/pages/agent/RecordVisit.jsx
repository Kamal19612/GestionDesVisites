import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Form/Input';
import visitService from '../../services/visitService';
import toast from 'react-hot-toast';

export default function RecordVisit() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue, watch } = useForm({
    defaultValues: {
      visitDate: new Date().toISOString().split('T')[0],
      visitTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      departementVisit: '',
      motifVisit: '',
      visitorFirstName: '',
      visitorLastName: '',
    }
  });
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const recordVisitMutation = useMutation({
    mutationFn: (data) => visitService.createVisit(data),
    onSuccess: () => {
      toast.success('Visite enregistrée avec succès');
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
      date: data.visitDate,
      HEntree: data.visitTime,
      HSortie: data.departureTime || null,
      motif: `[${data.departementVisit}] ${data.visitorFirstName} ${data.visitorLastName} | ${data.motifVisit}`
    };
    recordVisitMutation.mutate(visitPayload);
  };

  const departements = ['IT', 'RH', 'Finance', 'Ventes', 'Support', 'Marketing', 'Logistique', 'Direction'];

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
          <p className="text-slate-500 font-medium tracking-wide italic">Saisie des informations d'arrivée sur site.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section: Identité */}
        <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
          <div className="p-8 md:p-10 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="w-8 h-8 rounded-lg bg-vp-cyan/10 text-vp-cyan flex items-center justify-center text-sm font-bold shadow-inner">01</span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-vp-navy">Identité du Visiteur</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Prénom" 
                name="visitorFirstName" 
                register={register}
                options={{ required: 'Requis' }}
                error={errors.visitorFirstName?.message}
                placeholder="Ex: Thomas"
                className="rounded-xl border-slate-200 focus:border-vp-cyan"
              />
              <Input 
                label="Nom" 
                name="visitorLastName" 
                register={register}
                options={{ required: 'Requis' }}
                error={errors.visitorLastName?.message}
                placeholder="Ex: Anderson"
                className="rounded-xl border-slate-200 focus:border-vp-cyan"
              />
            </div>
          </div>

          {/* Section: Logistique */}
          <div className="px-8 md:px-10 py-10 bg-slate-50/50 border-t border-slate-100 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <span className="w-8 h-8 rounded-lg bg-vp-mint/10 text-vp-mint flex items-center justify-center text-sm font-bold shadow-inner">02</span>
              <h2 className="text-sm font-bold uppercase tracking-widest text-vp-navy">Horodatage & Destination</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input 
                label="Date" 
                name="visitDate" 
                type="date"
                register={register}
                className="rounded-xl border-slate-200"
              />
              <Input 
                label="Arrivée" 
                name="visitTime" 
                type="time"
                register={register}
                className="rounded-xl border-slate-200"
              />
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Département</label>
                <select 
                  {...register('departementVisit', { required: 'Requis' })}
                  className="w-full h-[50px] px-4 rounded-xl border border-slate-200 outline-none focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 bg-white font-medium text-sm transition-all"
                >
                  <option value="">Sélectionner...</option>
                  {departements.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.departementVisit && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.departementVisit.message}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Motif de la visite</label>
              <textarea
                {...register('motifVisit', { required: 'Requis' })}
                rows="3"
                placeholder="Décrivez brièvement l'objet du passage..."
                className="w-full p-6 rounded-2xl border border-slate-200 outline-none focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 bg-white font-medium text-sm transition-all placeholder:text-slate-300"
              ></textarea>
              {errors.motifVisit && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.motifVisit.message}</p>}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 bg-white border-t border-slate-100 flex justify-end gap-4">
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
              className="btn-primary px-10 flex items-center gap-2"
            >
              {recordVisitMutation.isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Envoi...
                </>
              ) : 'Valider Entrée'}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-10 p-6 bg-vp-navy rounded-3xl text-white relative overflow-hidden flex items-center">
         <div className="absolute top-0 right-0 w-40 h-40 bg-vp-cyan/10 blur-3xl -mr-20 -mt-20 rounded-full"></div>
         <div className="flex gap-4 relative z-10">
           <span className="text-2xl">📋</span>
           <div className="text-xs text-white/60 leading-relaxed font-medium">
             <strong>Note :</strong> L'heure de sortie pourra être complétée plus tard dans l'onglet "Visites en cours" ou manuellement via l'édition de visite.
           </div>
         </div>
      </div>
    </div>
  );
}
