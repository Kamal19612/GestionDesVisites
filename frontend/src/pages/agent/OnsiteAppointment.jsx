import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/Form/Input'
import appointmentService from '../../services/appointmentService'
import toast from 'react-hot-toast'

export default function OnsiteAppointment() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [showSuccess, setShowSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: (data) => appointmentService.createOnsiteAppointment(data),
    onSuccess: () => {
      setShowSuccess(true)
      toast.success('Rendez-vous créé avec succès')
      setTimeout(() => navigate('/agent/dashboard'), 2000)
    },
    onError: (err) => {
      console.error('Erreur Onsite:', err);
      toast.error(err?.response?.data?.message || 'Erreur lors de la création')
    }
  })

  const onSubmit = (data) => {
    const appointmentData = {
      visitorFirstName: data.visitorFirstName,
      visitorLastName: data.visitorLastName,
      visitorEmail: data.visitorEmail || '',
      visitorPhone: data.visitorPhone || '',
      date: data.appointmentDate,
      heure: data.appointmentTime,
      motif: data.motif,
      personneARencontrer: data.contactPerson,
      departement: data.department,
      type: 'REUNION',
      statut: 'EN_ATTENTE'
    }
    mutation.mutate(appointmentData)
  }

  const departements = ['IT', 'RH', 'Finance', 'Ventes', 'Support', 'Marketing']

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to="/agent/dashboard" 
          className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-vp-navy hover:border-vp-navy transition-all shadow-sm text-xs font-black"
        >
          ←
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-vp-navy">Nouveau RDV sur site</h1>
          <p className="text-slate-500 font-medium tracking-wide text-sm">Prise de rendez-vous immédiate au poste.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="card p-0 overflow-hidden border-none shadow-xl shadow-slate-200/40">
          <div className="p-6 md:p-8 space-y-6">
            {/* Step 1: Identity */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="w-6 h-6 rounded-lg bg-vp-cyan/10 text-vp-cyan flex items-center justify-center text-[10px] font-black shadow-inner">01</span>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-vp-navy">Identité Visiteur</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Prénom" 
                name="visitorFirstName" 
                register={register}
                options={{ required: 'Prénom requis' }}
                error={errors.visitorFirstName?.message}
                placeholder="Ex: John"
                className="rounded-xl"
              />
              <Input 
                label="Nom" 
                name="visitorLastName" 
                register={register}
                options={{ required: 'Nom requis' }}
                error={errors.visitorLastName?.message}
                placeholder="Ex: Doe"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Email" 
                name="visitorEmail" 
                type="email"
                register={register}
                placeholder="Ex: john@mail.com"
                className="rounded-xl"
              />
              <Input 
                label="Téléphone" 
                name="visitorPhone" 
                register={register}
                placeholder="Ex: +212..."
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="px-6 md:px-8 py-8 bg-slate-50/50 border-t border-slate-100 space-y-6">
            {/* Step 2: Planning */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <span className="w-6 h-6 rounded-lg bg-vp-mint/10 text-vp-mint flex items-center justify-center text-[10px] font-black shadow-inner">02</span>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-vp-navy">Détails du Rendez-vous</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Date du RDV</label>
                <input 
                  type="date"
                  {...register('appointmentDate', { required: 'Date requise' })}
                  className="w-full h-[50px] px-4 rounded-xl border border-slate-200 outline-none focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 bg-white font-medium text-sm transition-all shadow-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Heure du RDV</label>
                <input 
                  type="time"
                  {...register('appointmentTime', { required: 'Heure requise' })}
                  className="w-full h-[50px] px-4 rounded-xl border border-slate-200 outline-none focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 bg-white font-medium text-sm transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Département</label>
                <select 
                  {...register('department', { required: 'Requis' })}
                  className="w-full h-[50px] px-4 rounded-xl border border-slate-200 outline-none focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 bg-white font-medium text-sm transition-all"
                >
                  <option value="">Sélectionner...</option>
                  {departements.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <Input 
                label="Hôte (Personne à voir)" 
                name="contactPerson" 
                register={register}
                options={{ required: 'Hôte requis' }}
                error={errors.contactPerson?.message}
                placeholder="Nom complet"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Motif du rendez-vous</label>
              <textarea
                {...register('motif', { required: 'Requis' })}
                rows="2"
                className="w-full p-5 rounded-xl border border-slate-200 outline-none focus:border-vp-cyan focus:ring-4 focus:ring-vp-cyan/5 bg-white font-bold text-sm transition-all placeholder:text-slate-300 shadow-inner"
                placeholder="Ex: Entretien d'embauche, Livraison..."
              ></textarea>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/agent/dashboard')}
              className="px-6 py-2.5 text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary py-2.5 px-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
            >
              {mutation.isPending ? '⏳ Traitement...' : 'Confirmer RDV'}
            </button>
          </div>
        </div>
      </form>

      {/* Success Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-vp-navy/60 backdrop-blur-md flex items-center justify-center z-[200] animate-in fade-in duration-500">
           <div className="card p-12 max-w-sm w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 bg-vp-mint/10 text-vp-mint rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner ring-4 ring-vp-mint/5 animate-bounce">
                ✓
              </div>
              <div>
                <h2 className="text-2xl font-black text-vp-navy">RDV Enregistré</h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Dossier créé avec succès</p>
              </div>
              <p className="text-xs font-medium text-slate-500 italic pb-4">
                Redirection automatique vers le tableau de bord...
              </p>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-vp-cyan animate-progress origin-left"></div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
