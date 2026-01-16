import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function SecretarySettings() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      notificationsEmail: true,
      notificationsWA: true,
      language: 'fr',
      timezone: 'UTC+1',
      autoArchive: true
    }
  });

  const onSubmit = (data) => {
    console.log('Settings saved:', data);
    toast.success('Paramètres enregistrés avec succès !');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-vp-navy mb-2">Paramètres Secrétariat</h1>
          <p className="text-slate-500 font-medium tracking-wide italic">Personnalisez votre espace de travail opérationnel.</p>
        </div>
        <div className="w-16 h-16 rounded-3xl bg-vp-cyan/10 flex items-center justify-center text-3xl">⚙️</div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Notifications Section */}
          <div className="card p-10 border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-vp-cyan group-hover:w-2 transition-all"></div>
            <h2 className="text-xl font-black text-vp-navy mb-8 flex items-center gap-3">
               <span>🔔</span> Alertes & Notifications
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                <div>
                  <p className="text-xs font-black text-vp-navy uppercase tracking-widest">Email Notifications</p>
                  <p className="text-[10px] text-slate-400 font-bold">Réception des demandes de RDV</p>
                </div>
                <input type="checkbox" {...register('notificationsEmail')} className="w-5 h-5 accent-vp-cyan cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                <div>
                  <p className="text-xs font-black text-vp-navy uppercase tracking-widest">Alerte WhatsApp</p>
                  <p className="text-[10px] text-slate-400 font-bold">Confirmation instantanée</p>
                </div>
                <input type="checkbox" {...register('notificationsWA')} className="w-5 h-5 accent-vp-mint cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Interface Section */}
          <div className="card p-10 border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-vp-mint group-hover:w-2 transition-all"></div>
            <h2 className="text-xl font-black text-vp-navy mb-8 flex items-center gap-3">
               <span>🎨</span> Interface & Régional
            </h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Langue d'affichage</label>
                <select {...register('language')} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-vp-navy">
                  <option value="fr">Français (France)</option>
                  <option value="en">English (US)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fuseau horaire</label>
                <select {...register('timezone')} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-vp-navy">
                  <option value="UTC+1">Casablanca (UTC+1)</option>
                  <option value="UTC+2">Paris (UTC+2)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        <div className="card p-10 border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl border-4 border-white shadow-lg">💾</div>
             <div>
               <h3 className="font-black text-vp-navy">Mise à jour du Système</h3>
               <p className="text-sm font-medium text-slate-400 italic">Dernière synchronisation : Aujourd'hui à 10:45</p>
             </div>
          </div>
          <button 
            type="submit"
            className="h-14 px-10 bg-vp-navy text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-vp-navy/90 active:scale-95 transition-all shadow-xl shadow-vp-navy/20"
          >
            Enregistrer les Changements
          </button>
        </div>
      </form>

      <div className="mt-16 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">VisitePulse Internal Secretariat Setup v2.4.0</p>
      </div>
    </div>
  );
}
