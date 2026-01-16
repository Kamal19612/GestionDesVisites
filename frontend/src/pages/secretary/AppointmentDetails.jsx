import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Input from '../../components/Form/Input';
import secretaireService from '../../services/secretaireService';
import toast from 'react-hot-toast';

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isEditing, setIsEditing] = useState(false);

  const { data: appointment, isLoading, isError, error } = useQuery({
    queryKey: ['secretary', 'appointment', id],
    queryFn: () => secretaireService.getAppointmentById(id),
    enabled: !!id,
    staleTime: 0,
  });

  React.useEffect(() => {
    if (appointment) {
      reset(appointment);
    }
  }, [appointment, reset]);

  const updateMutation = useMutation({
    mutationFn: (updatedData) => secretaireService.updateAppointment(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secretary', 'appointment', id] });
      toast.success('Rendez-vous mis à jour');
      setIsEditing(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Échec de la mise à jour');
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status) => secretaireService.updateAppointment(id, { statut: status }),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['secretary', 'appointment', id] });
      toast.success(status === 'APPROUVEE' ? 'Rendez-vous approuvé' : 'Rendez-vous rejeté');
    },
    onError: (err) => {
      toast.error('Une erreur est survenue');
    },
  });

  const onSubmit = (data) => updateMutation.mutate(data);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'APPROUVEE': return { label: 'Approuvé', class: 'bg-vp-mint/10 text-vp-mint border-vp-mint/20', icon: '✓' };
      case 'EN_ATTENTE': return { label: 'En attente', class: 'bg-amber-100 text-amber-600 border-amber-200', icon: '⏳' };
      case 'REJETEE': return { label: 'Rejeté', class: 'bg-red-100 text-red-600 border-red-200', icon: '✕' };
      default: return { label: status, class: 'bg-slate-100 text-slate-500 border-slate-200', icon: '•' };
    }
  };

  if (isLoading) return (
    <div className="max-w-4xl mx-auto py-12 text-center">
      <div className="animate-spin w-10 h-10 border-4 border-vp-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-slate-400 font-medium">Récupération des détails...</p>
    </div>
  );

  if (isError || !appointment) return (
    <div className="max-w-4xl mx-auto py-12 text-center text-red-500">
      <span className="text-4xl mb-4 block">⚠️</span>
      <p className="font-bold">Erreur de chargement</p>
      <Link to="/secretary/appointments" className="text-vp-cyan hover:underline mt-4 inline-block font-bold uppercase tracking-widest text-xs">Retour à la liste</Link>
    </div>
  );

  const statusInfo = getStatusInfo(appointment.statut);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/secretary/appointments" 
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-vp-navy">Détails de la demande</h1>
            <p className="text-slate-500 font-medium text-xs tracking-wide">ID: #{id}</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-xs ${statusInfo.class}`}>
          <span>{statusInfo.icon}</span>
          <span className="uppercase tracking-widest">{statusInfo.label}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="card p-0 overflow-hidden border-none shadow-xl shadow-slate-200/40">
          <div className="p-6 md:p-8 space-y-6">
            {/* Visitor Section */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-vp-cyan border-b border-vp-cyan/10 pb-2">Informations Visiteur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Nom complet du visiteur" 
                  name="visitorName" 
                  register={register} 
                  readOnly={!isEditing}
                  className={`rounded-xl ${!isEditing ? 'bg-slate-50/50 border-transparent italic' : 'border-slate-200'}`}
                />
                <Input 
                  label="E-mail" 
                  name="email" 
                  type="email"
                  register={register} 
                  readOnly={!isEditing}
                  className={`rounded-xl ${!isEditing ? 'bg-slate-50/50 border-transparent italic' : 'border-slate-200'}`}
                />
                <Input 
                  label="WhatsApp" 
                  name="whatsapp" 
                  register={register} 
                  readOnly={!isEditing}
                  className={`rounded-xl ${!isEditing ? 'bg-slate-50/50 border-transparent italic' : 'border-slate-200'}`}
                />
                <Input 
                  label="Personne à rencontrer" 
                  name="personneARencontrer" 
                  register={register} 
                  readOnly={!isEditing}
                  className={`rounded-xl ${!isEditing ? 'bg-slate-50/50 border-transparent italic' : 'border-slate-200'}`}
                />
              </div>
            </div>

            {/* Appointment Section */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-vp-mint border-b border-vp-mint/10 pb-2">Détails Rendez-vous</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Date" 
                  name="date" 
                  type="date"
                  register={register} 
                  readOnly={!isEditing}
                  className={`rounded-xl ${!isEditing ? 'bg-slate-50/50 border-transparent italic' : 'border-slate-200'}`}
                />
                <Input 
                  label="Heure" 
                  name="time" 
                  type="time"
                  register={register} 
                  readOnly={!isEditing}
                  className={`rounded-xl ${!isEditing ? 'bg-slate-50/50 border-transparent italic' : 'border-slate-200'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-vp-navy ml-1">Motif du rendez-vous</label>
                <textarea
                  {...register("motif")}
                  rows="3"
                  readOnly={!isEditing}
                  className={`w-full p-4 rounded-xl outline-none transition-all ${!isEditing ? 'bg-slate-50/50 border-transparent italic text-slate-500' : 'border border-slate-200 focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5'}`}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              {!isEditing && appointment.statut === 'EN_ATTENTE' && (
                <>
                  <button 
                    type="button"
                    onClick={() => statusMutation.mutate('APPROUVEE')} 
                    disabled={statusMutation.isPending} 
                    className="btn-primary bg-vp-mint hover:bg-emerald-600 px-8"
                  >
                    Approuver
                  </button>
                  <button 
                    type="button"
                    onClick={() => statusMutation.mutate('REJETEE')} 
                    disabled={statusMutation.isPending} 
                    className="px-8 py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"
                  >
                    Rejeter
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-3 items-center">
              {!isEditing ? (
                (appointment.statut === 'EN_ATTENTE' || appointment.statut === 'APPROUVEE') && (
                  <button 
                    type="button"
                    onClick={() => setIsEditing(true)} 
                    className="text-xs font-heavy text-slate-400 hover:text-vp-navy uppercase tracking-[0.2em] transition-colors"
                  >
                    Modifier les informations
                  </button>
                )
              ) : (
                <>
                  <button 
                    type="button"
                    onClick={() => { setIsEditing(false); reset(appointment); }} 
                    className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="btn-primary"
                  >
                    Sauvegarder
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
