import React from 'react';
import toast from 'react-hot-toast';

export default function SystemSettings() {
  const handleSave = () => {
    toast.success('Paramètres enregistrés avec succès');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-vp-navy mb-2">Configuration Système</h1>
        <p className="text-slate-500 font-medium tracking-wide italic">Gestion globale des paramètres et des contrôles de sécurité.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Navigation Hint / Status */}
        <div className="space-y-8">
           <div className="card p-8 bg-vp-navy text-white border-none shadow-2xl shadow-vp-navy/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-vp-cyan/10 blur-3xl -mr-16 -mt-16"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">État du Système</p>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-xs font-bold">Base de données</span>
                    <span className="w-2 h-2 rounded-full bg-vp-mint shadow-[0_0_10px_#10b981]"></span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-xs font-bold">API Gateway</span>
                    <span className="w-2 h-2 rounded-full bg-vp-mint shadow-[0_0_10px_#10b981]"></span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-xs font-bold">Mail Server</span>
                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></span>
                 </div>
              </div>
              <p className="text-[9px] text-white/40 mt-6 font-medium italic">Dernier check: {new Date().toLocaleTimeString()}</p>
           </div>

           <div className="p-8 rounded-[30px] bg-slate-50 border border-slate-100">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Aide Administrative</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Les modifications apportées ici affectent l'ensemble de l'organisation. Assurez-vous de valider les changements de politique de sécurité avec votre DSI.
              </p>
           </div>
        </div>

        {/* Right Column: Actual Settings */}
        <div className="lg:col-span-2 space-y-8">
           {/* General Section */}
           <div className="card p-10 border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-8">
                 <span className="w-10 h-10 rounded-xl bg-vp-cyan/10 flex items-center justify-center text-xl">⚙️</span>
                 <h3 className="text-xl font-bold text-vp-navy">Identité visuelle & Nom</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom de l'organisation</label>
                   <input 
                     type="text" 
                     className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-vp-cyan/20 focus:border-vp-cyan transition-all font-bold text-vp-navy outline-none"
                     placeholder="VisitePulse Enterprise"
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fuseau horaire</label>
                   <select className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-vp-cyan/20 focus:border-vp-cyan transition-all font-bold text-vp-navy outline-none appearance-none">
                      <option>(GMT+01:00) Paris, Berlin, Rome</option>
                      <option>(GMT+00:00) Casablanca, London</option>
                   </select>
                </div>
              </div>
           </div>

           {/* Security Section */}
           <div className="card p-10 border-none shadow-xl shadow-slate-200/40 bg-white/80 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-8">
                 <span className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-xl">🛡️</span>
                 <h3 className="text-xl font-bold text-vp-navy">Contrôle d'Accès & Sécurité</h3>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-vp-cyan/30 transition-all cursor-pointer">
                    <div>
                       <p className="text-sm font-bold text-vp-navy mb-1">Authentification à deux facteurs (2FA)</p>
                       <p className="text-[10px] font-medium text-slate-400">Exiger un code de vérification pour tous les administrateurs.</p>
                    </div>
                    <div className="w-12 h-6 bg-vp-mint rounded-full p-1 flex justify-end">
                       <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-vp-cyan/30 transition-all cursor-pointer">
                    <div>
                       <p className="text-sm font-bold text-vp-navy mb-1">Expiration de session Session</p>
                       <p className="text-[10px] font-medium text-slate-400">Déconnexion automatique après 4 heures d'inactivité.</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full p-1 flex justify-start">
                       <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Actions */}
           <div className="flex justify-end gap-4 pt-4">
              <button className="h-14 px-10 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-vp-navy transition-colors">
                Réinitialiser
              </button>
              <button 
                onClick={handleSave}
                className="btn-primary h-14 px-12 shadow-2xl shadow-vp-cyan/20"
              >
                Enregistrer les modifications
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
