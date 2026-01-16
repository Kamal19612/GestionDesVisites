import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import appointmentService from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/Form/Input';

export default function AppointmentRequest() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Connexion requise pour cette action');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const mutation = useMutation({
    mutationFn: (data) => appointmentService.createAppointment(data),
    onSuccess: () => {
      toast.success('Demande envoyée avec succès');
      setTimeout(() => navigate('/visitor'), 1500);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Erreur lors de l\'envoi');
    }
  });

  const onSubmit = (data) => {
    const cleanedData = {
      date: data.date,
      heure: data.heure,
      motif: data.motif,
      personneARencontrer: data.personneARencontrer,
      departement: data.departement,
    };
    mutation.mutate(cleanedData);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin w-12 h-12 border-4 border-vp-cyan border-t-transparent rounded-full"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-vp-navy mb-4 tracking-tight">Coup d'envoi</h1>
        <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
          Préparez votre visite chez nous en quelques instants. Votre demande sera traitée par nos équipes et vous recevrez une confirmation par mail.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/40">
          <div className="p-8 md:p-12 space-y-10">
            {/* Sec 1: Planning */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                 <div className="w-8 h-8 rounded-lg bg-vp-cyan/10 text-vp-cyan flex items-center justify-center text-xs font-black">01</div>
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] text-vp-navy">Planification</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Date souhaitée</label>
                   <input 
                      type="date"
                      {...register('date', { required: 'Date requise' })}
                      className="w-full h-[55px] px-6 rounded-2xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 outline-none transition-all font-bold text-sm bg-slate-50/50"
                   />
                   {errors.date && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.date.message}</p>}
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Heure d'arrivée</label>
                   <input 
                      type="time"
                      {...register('heure', { required: 'Heure requise' })}
                      className="w-full h-[55px] px-6 rounded-2xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 outline-none transition-all font-bold text-sm bg-slate-50/50"
                   />
                   {errors.heure && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.heure.message}</p>}
                 </div>
               </div>
            </div>

            {/* Sec 2: Destination */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                 <div className="w-8 h-8 rounded-lg bg-vp-mint/10 text-vp-mint flex items-center justify-center text-xs font-black">02</div>
                 <h2 className="text-sm font-black uppercase tracking-[0.2em] text-vp-navy">Destination</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Input
                   label="Département / Service"
                   name="departement"
                   placeholder="Ex: RH, IT, Direction..."
                   register={register}
                   options={{ required: 'Département requis' }}
                   error={errors.departement?.message}
                   className="rounded-2xl h-[55px] bg-slate-50/50 border-slate-200"
                 />
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
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Objet de la visite</label>
                 <textarea
                   {...register('motif', { required: 'Motif requis' })}
                   rows="3"
                   placeholder="Dites-nous brièvement le but de votre visite..."
                   className="w-full p-6 rounded-3xl border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 outline-none transition-all font-medium text-sm bg-slate-50/50 placeholder:italic"
                 />
                 {errors.motif && <p className="text-[10px] text-red-500 font-bold mt-1 px-1">{errors.motif.message}</p>}
               </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100">
             <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                <span className="w-2 h-2 rounded-full bg-vp-mint animate-pulse"></span>
                Sécurité & Confidentialité garanties
             </div>
             <button 
                type="submit" 
                disabled={mutation.isPending}
                className="btn-primary px-12 h-[55px] flex items-center gap-3 w-full md:w-auto"
             >
               {mutation.isPending ? '⏳ Transmission...' : '🚀 Envoyer ma demande'}
             </button>
          </div>
        </div>
      </form>

      <div className="mt-12 text-center text-slate-300">
         <p className="text-[11px] font-black uppercase tracking-[0.4em]">VisitePulse Experience</p>
      </div>
    </div>
  );
}
